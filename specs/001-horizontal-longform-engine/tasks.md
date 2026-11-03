# Task Breakdown: 001-horizontal-longform-engine

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Status**: READY FOR IMPLEMENTATION  

---

## 📋 Phase 1: Setup & Foundational
- [ ] [TASK-001] [P1] [US1] Create horizontal video workspace directory: `src/videos/horizontal/` and register horizontal composition in `src/Root.tsx`.
- [ ] [TASK-002] [P1] [US2] Create longform scripts directory: `scripts/longform/` and define 8-minute 6-chapter script in `scripts/longform/story_script.json`.

*Verification*: `npx remotion compositions src/index.ts` reports horizontal composition registered at 1920x1080.

---

## 🎙️ Phase 2: User Story 2 — Script & Audio Synthesis Engine
- [ ] [TASK-003] [P1] [US2] Implement `scripts/longform/generate_audio.py` for batch TTS (`en-US-ChristopherNeural`) generating 6 chapter audio tracks and word timestamps.
- [ ] [TASK-004] [P1] [US2] Implement procedural SFX generator and background ambient music ducking per chapter in `scripts/longform/audio_mix.py`.

*Verification*: `python scripts/longform/generate_audio.py` produces 6 WAV files with total duration ~480 seconds (8 minutes).

---

## 🎨 Phase 3: User Story 1 — 1920x1080 2.5D Vector Visual Engine
- [ ] [TASK-005] [P1] [US1] Build 2.5D stage backgrounds (Street, Bank, Dark Void, Molecular Grid, Earth in Space) in `src/videos/horizontal/stage.ts`.
- [ ] [TASK-006] [P1] [US1] Port `toon.ts` character choreographies (walking, watch snapping, panic, flight) to 16:9 canvas in `src/videos/horizontal/actors.ts`.
- [ ] [TASK-007] [P1] [US1] Assemble Chapter compositions in `src/videos/horizontal/ChapterView.tsx` with dynamic camera zoom, pan, and text callouts (zero blur).

*Verification*: `npx remotion still src/index.ts Chapter1_Fantasy out/test_still.png --gl=angle` produces crisp 1920x1080 image without blur.

---

## 🚀 Phase 4: User Story 3 & 4 — Fast Cloud Render & Stitching Pipeline
- [ ] [TASK-008] [P1] [US3] Implement Kaggle execution runner `kaggle/render_longform.py` with multi-chapter batch rendering and 4x concurrency.
- [ ] [TASK-009] [P2] [US4] Implement FFmpeg lossless chapter concatenation in `scripts/longform/concat_chapters.py` to produce final master MP4.
- [ ] [TASK-010] [P1] [US3] Push to Kaggle GPU, execute cloud render, and download `final_8min_horizontal.mp4` to `/sdcard/Movies/`.

*Verification*: `ffprobe -v error -show_entries format=duration,size:stream=width,height /sdcard/Movies/final_8min_horizontal.mp4` confirms 1920x1080 and duration ~480s.
