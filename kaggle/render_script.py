#!/usr/bin/env python3
"""
Kaggle GPU Automated Render Pipeline for 16:9 Longform Animated Video
Render target: "What If You Could Pause Time for 10 Seconds?" (~11 mins, 1920x1080)
"""
import os
import sys
import subprocess
import time
import json

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

print("\n🚀 Starting Animated Longform GPU Rendering on Kaggle (Nvidia Tesla T4)...")

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
run("pip install edge-tts numpy scipy", cwd=work_dir)

# 5. Synthesize Audio & Ensure Assets
run("python scripts/longform/generate_audio.py", cwd=work_dir)

# 6. Ensure Chrome for Testing with GPU Acceleration
run("npx remotion browser ensure --chrome-mode=chrome-for-testing", cwd=work_dir)

# 7. Verify Compositions
run("npx remotion compositions src/index.ts", cwd=work_dir)

# 8. Render Strategy
output_master = "/kaggle/working/What_If_Pause_Time_8Min.mp4"
os.makedirs("/kaggle/working", exist_ok=True)

meta_path = os.path.join(work_dir, "public", "pause_time", "chapters_meta.json")
if not os.path.exists(meta_path):
    print("[!] Metadata missing in public/pause_time!")
    sys.exit(1)

with open(meta_path, "r", encoding="utf-8") as f:
    meta = json.load(f)

print(f"\n🎬 Rendering {len(meta['chapters'])} Chapters (Total Frames: {meta['total_frames']} @ 30fps)...")

# Render Chapter by Chapter into /tmp/chapters/ for maximum resilience
chapters_dir = "/tmp/chapters"
os.makedirs(chapters_dir, exist_ok=True)

rendered_chapters = []
for ch in meta["chapters"]:
    ch_id = ch["id"]
    slug = ch["slug"].replace("-", "_")
    comp_id = f"Chapter_{ch_id}_{slug}"
    ch_out = os.path.join(chapters_dir, f"chapter_{ch_id}.mp4")
    
    print(f"\n-------------------------------------------------------------")
    print(f"[*] Rendering Chapter {ch_id}/{len(meta['chapters'])}: {ch['title']} ({ch['frames']} frames)...")
    print(f"-------------------------------------------------------------")
    
    cmd = (
        f"npx remotion render src/index.ts {comp_id} {ch_out} "
        f"--codec h264 --gl=angle-egl --chrome-mode=chrome-for-testing --concurrency 4"
    )
    rc = run(cmd, cwd=work_dir, ignore_error=False)
    if os.path.exists(ch_out):
        ch_size = os.path.getsize(ch_out) / (1024 * 1024)
        print(f"[+] Chapter {ch_id} Rendered: {ch_out} ({ch_size:.2f} MB)")
        rendered_chapters.append(ch_out)
    else:
        print(f"[!] Error: Chapter {ch_id} failed to render.")
        sys.exit(1)

# 8. Concatenate with Lossless FFmpeg stream copy
print("\n🔗 Merging all 8 Chapters with FFmpeg Lossless Stream Copy...")
list_file = os.path.join(chapters_dir, "list.txt")
with open(list_file, "w") as f:
    for ch_path in rendered_chapters:
        f.write(f"file '{ch_path}'\n")

run(f"ffmpeg -y -f concat -safe 0 -i {list_file} -c copy {output_master}")

# 9. Verify Final Master Video
if os.path.exists(output_master):
    size_mb = os.path.getsize(output_master) / (1024 * 1024)
    run(f"ffprobe -v error -show_entries format=duration,size:stream=width,height {output_master}")
    print(f"\n=======================================================")
    print(f"🎉 [MASTER SUCCESS] Final 16:9 Longform Video Ready!")
    print(f"📍 Location: {output_master}")
    print(f"📦 Size: {size_mb:.2f} MB")
    print(f"=======================================================\n")
else:
    print("\n[!] Concat failed: Master video not found!")
    sys.exit(1)
