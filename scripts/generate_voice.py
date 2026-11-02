#!/usr/bin/env python3
"""
Generate voiceover using edge-tts (Microsoft Neural Voices) and output 48kHz WAV + word-level timestamps.
"""
import os
import sys
import json
import asyncio
import subprocess

SCRIPT_TEXT = """Seventy-four soldiers knocked down an iron bridge just by walking across it.
It's 1831, and the brand new bridge over the river is the pride of the whole town.
The men are marching home four across, every boot hitting the planks at the exact same moment.
Halfway over, the bridge starts bouncing under their feet.
A normal person would slow down, but these guys think it's hilarious.
Somebody starts whistling a marching tune, and the whole column stomps along to it, a little harder every step.
The bounce gets bigger, the chains start groaning, and nobody wants to be the one who breaks step.
Then a single bolt snaps, and the whole end of the bridge drops into the river.
Luckily, the river was only two feet deep.
Unluckily, the river was only two feet deep.
You see, every bridge has a rhythm it naturally likes to sway at.
Ever pushed a kid on a swing? Each push is tiny, but if they all land at just the right moment, the swing goes higher and higher.
Seventy-four men stepping together were pushing that bridge like a swing.
Nobody died, but the army made a rule: never cross a bridge in step.
So now, the best drilled soldiers in the world cross every bridge like a crowd of tourists."""

async def generate(text: str, voice: str = "en-US-ChristopherNeural", out_dir: str = "voice"):
    import edge_tts
    os.makedirs(out_dir, exist_ok=True)
    mp3_path = os.path.join(out_dir, "voice.mp3")
    vtt_path = os.path.join(out_dir, "voice.vtt")
    wav_path = os.path.join(out_dir, "voice.wav")
    words_path = os.path.join(out_dir, "words.json")

    print(f"[*] Synthesizing speech with voice: {voice}...")
    communicate = edge_tts.Communicate(text, voice, rate="+2%", pitch="-1Hz")
    sub_maker = edge_tts.SubMaker()

    with open(mp3_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                sub_maker.create_sub((chunk["offset"], chunk["duration"]), chunk["text"])

    print(f"[*] Converting {mp3_path} to 48kHz WAV: {wav_path}...")
    subprocess.run([
        "ffmpeg", "-y", "-i", mp3_path,
        "-ar", "48000", "-ac", "2",
        wav_path
    ], check=True)

    # Export word timings
    words = []
    # If submaker has subs
    for sub in sub_maker.subs:
        start_sec = sub.start.total_seconds()
        end_sec = sub.end.total_seconds()
        words.append({
            "w": sub.text.strip(),
            "s": round(start_sec, 3),
            "e": round(end_sec, 3)
        })

    with open(words_path, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2)

    print(f"[+] Voice generation complete: {wav_path} & {words_path}")

if __name__ == "__main__":
    text = SCRIPT_TEXT
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]
            text = " ".join(lines)
    asyncio.run(generate(text))
