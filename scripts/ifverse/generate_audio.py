#!/usr/bin/env python3
"""
Audio and Subtitle Timing Generator for Ifverse-Style Animated Short
"""
import os
import sys
import json
import asyncio
import subprocess

async def generate_voice(shot: dict, voice: str, out_dir: str):
    import edge_tts
    shot_id = shot["id"]
    tag = shot["tag"]
    text = shot["text"]
    
    mp3_path = os.path.join(out_dir, f"shot_{shot_id}_{tag}.mp3")
    wav_path = os.path.join(out_dir, f"shot_{shot_id}_{tag}.wav")
    words_path = os.path.join(out_dir, f"words_{shot_id}_{tag}.json")
    
    print(f"[*] Synthesizing Shot {shot_id}: {tag}...")
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
    frames = int(round(dur * 30))
    print(f"[+] Shot {shot_id} done: {dur:.2f}s ({frames} frames) -> {wav_path}")
    return {
        "id": shot_id,
        "tag": tag,
        "text": text,
        "duration": dur,
        "frames": frames,
        "wav": wav_path,
        "words": words_path,
        "words_data": words
    }

async def main():
    base_dir = os.path.dirname(__file__)
    script_path = os.path.join(base_dir, "script.json")
    with open(script_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    voice = data.get("voice", "en-US-ChristopherNeural")
    out_dir = os.path.join(base_dir, "audio")
    pub_dir = os.path.join(base_dir, "..", "..", "public", "ifverse")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(pub_dir, exist_ok=True)
    
    shots_meta = []
    total_sec = 0.0
    total_frames = 0
    
    for shot in data["shots"]:
        res = await generate_voice(shot, voice, out_dir)
        shots_meta.append(res)
        total_sec += res["duration"]
        total_frames += res["frames"]
        
        # Copy to public/ifverse
        import shutil
        shutil.copy2(res["wav"], os.path.join(pub_dir, os.path.basename(res["wav"])))
        shutil.copy2(res["words"], os.path.join(pub_dir, os.path.basename(res["words"])))

    # Concatenate all shot wavs into one master voice track
    concat_list = os.path.join(out_dir, "concat_voice.txt")
    with open(concat_list, "w") as f:
        for s in shots_meta:
            f.write(f"file '{os.path.abspath(s['wav'])}'\n")
            
    master_wav = os.path.join(out_dir, "master_voice.wav")
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", master_wav], check=True)
    import shutil
    shutil.copy2(master_wav, os.path.join(pub_dir, "master_voice.wav"))
    
    meta_path = os.path.join(out_dir, "shots_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump({
            "title": data["title"],
            "total_duration": total_sec,
            "total_frames": total_frames,
            "shots": shots_meta
        }, f, indent=2)
    shutil.copy2(meta_path, os.path.join(pub_dir, "shots_meta.json"))
    
    print(f"\n🎉 Voice Generation Complete: {len(shots_meta)} Shots ({total_sec:.2f}s, {total_frames} frames @ 30fps)")

if __name__ == "__main__":
    asyncio.run(main())
