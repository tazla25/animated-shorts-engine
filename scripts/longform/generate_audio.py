#!/usr/bin/env python3
"""
Batch Voice & Timestamp Generator for 8-10 Minute Longform Chapters
"""
import os
import sys
import json
import asyncio
import subprocess

async def generate_chapter(ch: dict, voice: str, out_dir: str):
    import edge_tts
    os.makedirs(out_dir, exist_ok=True)
    ch_id = ch["id"]
    slug = ch["slug"]
    text = ch["text"]
    
    mp3_path = os.path.join(out_dir, f"chapter_{ch_id}_{slug}.mp3")
    wav_path = os.path.join(out_dir, f"chapter_{ch_id}_{slug}.wav")
    words_path = os.path.join(out_dir, f"words_{ch_id}_{slug}.json")
    
    print(f"[*] Synthesizing Chapter {ch_id}: {ch['title']}...")
    communicate = edge_tts.Communicate(text, voice, rate="+2%", pitch="-1Hz")
    
    words = []
    with open(mp3_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
                start_sec = chunk["offset"] / 10_000_000.0
                dur_sec = chunk["duration"] / 10_000_000.0
                words.append({
                    "text": chunk.get("text", "").strip(),
                    "start": round(start_sec, 3),
                    "end": round(start_sec + dur_sec, 3)
                })
                
    with open(words_path, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2)
        
    cmd = [
        "ffmpeg", "-y", "-i", mp3_path,
        "-ar", "48000", "-ac", "2",
        wav_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    # Measure duration with ffprobe
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", wav_path],
        capture_output=True, text=True, check=True
    )
    dur = float(probe.stdout.strip())
    print(f"[+] Chapter {ch_id} done: {dur:.2f}s ({len(words)} words) -> {wav_path}")
    return {
        "id": ch_id,
        "slug": slug,
        "title": ch["title"],
        "duration": dur,
        "frames": int(dur * 30),
        "wav": wav_path,
        "words": words_path
    }

async def main():
    script_path = os.path.join(os.path.dirname(__file__), "story_script.json")
    with open(script_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    voice = data.get("voice", "en-US-ChristopherNeural")
    out_dir = os.path.join(os.path.dirname(__file__), "voice")
    pub_dir = os.path.join(os.path.dirname(__file__), "..", "..", "public", "pause_time")
    os.makedirs(pub_dir, exist_ok=True)
    
    results = []
    total_sec = 0.0
    for ch in data["chapters"]:
        res = await generate_chapter(ch, voice, out_dir)
        results.append(res)
        total_sec += res["duration"]
        # Copy to public/pause_time
        for ext in (".mp3", ".wav", ".json"):
            src_file = os.path.join(out_dir, f"chapter_{ch['id']}_{ch['slug']}{ext}" if ext != ".json" else f"words_{ch['id']}_{ch['slug']}.json")
            dst_file = os.path.join(pub_dir, os.path.basename(src_file))
            if os.path.exists(src_file):
                import shutil
                shutil.copy2(src_file, dst_file)
        
    meta_path = os.path.join(out_dir, "chapters_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump({
            "title": data["title"],
            "total_duration": total_sec,
            "total_frames": int(total_sec * 30),
            "chapters": results
        }, f, indent=2)
    import shutil
    shutil.copy2(meta_path, os.path.join(pub_dir, "chapters_meta.json"))
        
    print(f"\n🎉 All {len(results)} Chapters Generated! Total Duration: {total_sec / 60:.2f} minutes ({total_sec:.1f}s, {int(total_sec * 30)} frames)")
    print(f"[+] Metadata written to: {meta_path}")

if __name__ == "__main__":
    asyncio.run(main())
