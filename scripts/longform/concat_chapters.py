#!/usr/bin/env python3
"""
Lossless FFmpeg Chapter Concatenation Pipeline
Combines rendered chapter MP4s into a single master video in seconds.
"""
import os
import sys
import subprocess
import json

def concat_chapters(input_dir: str, output_mp4: str, meta_path: str = None):
    if meta_path is None:
        meta_path = os.path.join(input_dir, "chapters_meta.json")
        if not os.path.exists(meta_path):
            meta_path = os.path.join(os.path.dirname(__file__), "voice", "chapters_meta.json")

    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    chapter_files = []
    for ch in meta["chapters"]:
        ch_id = ch["id"]
        # Look for chapter MP4 in input_dir
        expected_names = [
            f"chapter_{ch_id}.mp4",
            f"Chapter_{ch_id}_{ch['slug'].replace('-', '_')}.mp4",
            f"chapter_{ch_id}_{ch['slug']}.mp4"
        ]
        found = None
        for name in expected_names:
            p = os.path.join(input_dir, name)
            if os.path.exists(p):
                found = p
                break
        if not found:
            print(f"[!] Warning: Chapter {ch_id} file not found in {input_dir}")
            sys.exit(1)
        chapter_files.append(found)

    print(f"[*] Found all {len(chapter_files)} chapter files. Creating concat manifest...")
    list_path = os.path.join(input_dir, "chapters_list.txt")
    with open(list_path, "w", encoding="utf-8") as f:
        for p in chapter_files:
            f.write(f"file '{os.path.abspath(p)}'\n")

    print(f"[*] Running FFmpeg stream copy concatenation...")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", list_path,
        "-c", "copy",
        output_mp4
    ]
    subprocess.run(cmd, check=True)

    if os.path.exists(output_mp4):
        size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
        print(f"🎉 [SUCCESS] Master video created: {output_mp4} ({size_mb:.2f} MB)")
    else:
        print("[!] Concat failed: Output file missing.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: concat_chapters.py <input_dir> <output_mp4> [meta_json]")
        sys.exit(1)
    meta = sys.argv[3] if len(sys.argv) > 3 else None
    concat_chapters(sys.argv[1], sys.argv[2], meta)
