#!/usr/bin/env python3
import os
import sys
import subprocess
import time

def run(cmd, cwd=None):
    print(f"\n==========================================")
    print(f"[*] Running: {cmd}")
    print(f"==========================================")
    t0 = time.time()
    res = subprocess.run(cmd, shell=True, cwd=cwd)
    dt = time.time() - t0
    if res.returncode != 0:
        print(f"[!] Error: Command exited with code {res.returncode} after {dt:.1f}s")
        sys.exit(res.returncode)
    print(f"[+] Finished in {dt:.1f}s")

print("\n🚀 Starting Animated Shorts GPU Rendering on Kaggle...")

# 1. Verify GPU
run("nvidia-smi")

# 2. Install Node.js 22, FFmpeg, and Linux graphics & Chrome system dependencies
run("curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get update && apt-get install -y nodejs ffmpeg libnss3 libdbus-1-3 libatk1.0-0 libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0 libgl1-mesa-dri libgl1 libegl1")
run("node -v && npm -v && ffmpeg -version | head -n 1")

# 3. Clone Repository into /tmp (keeps /kaggle/working clean so only final_video.mp4 is saved)
work_dir = "/tmp/animated-shorts-engine"
if os.path.exists(work_dir):
    run("git pull", cwd=work_dir)
else:
    run(f"git clone https://github.com/tazla25/animated-shorts-engine.git {work_dir}")

# 4. Install Node Dependencies & Python Dependencies
run("npm install --legacy-peer-deps", cwd=work_dir)
run("pip install edge-tts numpy scipy", cwd=work_dir)

# 5. Ensure Chrome for Testing with GPU support
run("npx remotion browser ensure --chrome-mode=chrome-for-testing", cwd=work_dir)

# 6. Generate Voiceover & Timings
run("python scripts/generate_voice.py", cwd=work_dir)

# 7. Synthesize SFX & March Audio Mix
run("python mix.py", cwd=os.path.join(work_dir, "scripts", "audio"))

# 8. Check GPU in Remotion & Render
run("npx remotion gpu --gl=angle-egl --chrome-mode=chrome-for-testing || true", cwd=work_dir)
run("mkdir -p out", cwd=work_dir)
run("npx remotion render src/index.ts BridgeShort out/raw_video.mp4 --codec h264 --scale 0.5 --gl=angle-egl --chrome-mode=chrome-for-testing --concurrency 4", cwd=work_dir)

# 9. Mux Video and Audio to /kaggle/working/
output_mp4 = "/kaggle/working/final_video.mp4"
mix_wav = os.path.join(work_dir, "scripts", "audio", "mix.wav")
raw_mp4 = os.path.join(work_dir, "out", "raw_video.mp4")

if os.path.exists(mix_wav) and os.path.exists(raw_mp4):
    run(f"ffmpeg -y -i {raw_mp4} -i {mix_wav} -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 -shortest {output_mp4}")
elif os.path.exists(raw_mp4):
    run(f"cp {raw_mp4} {output_mp4}")

if os.path.exists(output_mp4):
    size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
    print(f"\n🎉 [SUCCESS] Rendered Final Video: {output_mp4} ({size_mb:.2f} MB)")
else:
    print("\n[!] Output video not found!")
