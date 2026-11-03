# Implementation Plan: 001-horizontal-longform-engine

**Feature**: 8-10 Minute Horizontal (16:9) Animated Video Creation & Fast-Render Engine  
**Spec**: [spec.md](./spec.md)  
**Status**: DRAFT  

---

## 🏛️ Phase -1 Gates Audit

| Gate | Assessment | Status |
| :--- | :--- | :--- |
| **Simplicity Gate** | Max 3 primary modules: `scripts/longform/` (script & audio synthesis), `src/videos/horizontal/` (2.5D Remotion compositions), `kaggle/render_longform.py` (GPU batch runner). | ✅ PASSED |
| **Anti-Abstraction Gate** | Direct use of Remotion's `Composition`, HTML5 `Canvas2D`, and FFmpeg concat protocol. Zero gratuitous framework wrappers. | ✅ PASSED |
| **Integration Gate** | Clear schema contracts for Chapter metadata (`chapters.json`), Voice synthesis (`voice/chapter_X.wav`, `words_X.json`), and Render outputs. | ✅ PASSED |

---

## 📐 Architecture & Component Design

```
~/animated-shorts-engine/
├── scripts/longform/
│   ├── story_script.json          # Master 8-minute script split into 6 chapters
│   ├── generate_audio.py          # Batch TTS (edge-tts) + SFX per chapter
│   └── concat_chapters.py         # FFmpeg lossless concat script
├── src/videos/horizontal/
│   ├── HorizontalRoot.tsx         # Registers 1920x1080 Chapter compositions
│   ├── ChapterView.tsx            # 2.5D Parallax Canvas stage (16:9)
│   ├── stage.ts                   # 2.5D Layered Backgrounds (City, Bank, Space, Earth)
│   └── actors.ts                  # Toon character choreographies (walk, snap, scream, fly)
└── kaggle/
    └── render_longform.py         # Kaggle GPU execution pipeline (batch render + concat)
```

---

## ⚡ Performance Optimization Plan (Why it renders in 5-8 minutes)
1. **Zero WebGL Post-Processing Overhead**:
   - `LensBlur` is completely stripped (`lens: false`). No 80-tap texture convolution loops.
   - Clean 2.5D Vector drawing via Canvas2D with hardware-accelerated 2D context.
2. **Horizontal 1920x1080 Native Scaling**:
   - Canvas natively matches 16:9 viewport without cropping.
3. **4-Worker Parallel Execution**:
   - Remotion renders 4 frames simultaneously across all 4 vCPUs.
   - Target benchmark: 40–50 fps = 14,400 frames rendered in ~300 seconds (5 minutes).

---

## 🔬 Red-Green Verification Protocol
- **Audio Verification**: `python scripts/longform/generate_audio.py` produces 6 WAV files totaling ~480s with clean loudness (-16 LUFS).
- **Single Chapter Render Verification**: Render Chapter 1 (1m15s / 2,250 frames) locally or on Kaggle and confirm execution in < 60 seconds.
- **Full Video Verification**: `ffprobe` confirms `1920x1080`, `30fps`, `duration >= 450s (7.5m)`, audio in sync, zero dropped frames.
