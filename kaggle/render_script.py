#!/usr/bin/env python3
"""
Kaggle GPU Automated Render Pipeline for Ifverse-Style Animated Sci-Fi Video
Target: "What If You Could Pause Time for 10 Seconds?" (16:9 Full HD 1920x1080 @ 30fps)
Composition: Ifverse-PauseTime (~130s, 3892 frames)
"""
import os
import sys
import subprocess
import time

def run(cmd, cwd=None, ignore_error=False):
    print(f"\n==========================================")
    print(f"[*] Running: {cmd}")
    print(f"==========================================")
    t0 = time.time()
    res = subprocess.run(cmd, shell=True, cwd=cwd)
    dt = time.time() - t0
    if res.returncode != 0 and not ignore_error:
        print(f"[!] Error: Command exited with code {res.returncode} after {dt:.1f}s")
        sys.exit(res.returncode)
    print(f"[+] Finished in {dt:.1f}s")
    return res.returncode

print("\n🚀 Starting Ifverse 2D Animated Video GPU Rendering on Kaggle (Nvidia Tesla T4)...")

# 1. Inspect GPU
run("nvidia-smi")

# 2. Install Node.js 22, FFmpeg, and Linux Graphics/Chrome Libraries
run("curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get update && apt-get install -y nodejs ffmpeg libnss3 libdbus-1-3 libatk1.0-0 libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0 libgl1-mesa-dri libgl1 libegl1")
run("node -v && npm -v && ffmpeg -version | head -n 1")

# 3. Clone Repository
work_dir = "/tmp/animated-shorts-engine"
if os.path.exists(work_dir):
    run("git pull", cwd=work_dir)
else:
    run(f"git clone https://github.com/tazla25/animated-shorts-engine.git {work_dir}")

# 4. Install Dependencies
run("npm install --legacy-peer-deps", cwd=work_dir)

# 5. Ensure Chrome for Testing with GPU Acceleration
run("npx remotion browser ensure --chrome-mode=chrome-for-testing", cwd=work_dir)

# 6. Verify Compositions
run("npx remotion compositions src/index.ts", cwd=work_dir)

# 7. Render Ifverse-PauseTime
output_video = "/kaggle/working/What_If_Pause_Time_Ifverse.mp4"
os.makedirs("/kaggle/working", exist_ok=True)

print(f"\n🎬 Rendering Ifverse-PauseTime to {output_video}...")
render_cmd = (
    f"npx remotion render src/index.ts Ifverse-PauseTime {output_video} "
    f"--codec h264 --gl=angle-egl --chrome-mode=chrome-for-testing --concurrency 4"
)
run(render_cmd, cwd=work_dir)

# 8. Verification & Preview Still Generation
if os.path.exists(output_video):
    size_mb = os.path.getsize(output_video) / (1024 * 1024)
    run(f"ffprobe -v error -show_entries format=duration,size:stream=width,height,nb_frames {output_video}")
    
    # Generate Preview Still Shots across the timeline
    run(f"ffmpeg -y -ss 00:00:05 -i {output_video} -vframes 1 -q:v 2 /kaggle/working/preview_shot1_city.jpg")
    run(f"ffmpeg -y -ss 00:00:20 -i {output_video} -vframes 1 -q:v 2 /kaggle/working/preview_shot3_freeze.jpg")
    run(f"ffmpeg -y -ss 00:00:50 -i {output_video} -vframes 1 -q:v 2 /kaggle/working/preview_shot5_photons.jpg")
    run(f"ffmpeg -y -ss 00:01:25 -i {output_video} -vframes 1 -q:v 2 /kaggle/working/preview_shot8_orbital.jpg")
    run(f"ffmpeg -y -ss 00:01:50 -i {output_video} -vframes 1 -q:v 2 /kaggle/working/preview_shot10_explosion.jpg")
    
    print(f"\n=======================================================")
    print(f"🎉 [IFVERSE MASTER SUCCESS] Final 16:9 Video Ready!")
    print(f"📍 Location: {output_video}")
    print(f"📦 Size: {size_mb:.2f} MB")
    print(f"=======================================================\n")
else:
    print("\n[!] Render failed: Master video not found!")
    sys.exit(1)
