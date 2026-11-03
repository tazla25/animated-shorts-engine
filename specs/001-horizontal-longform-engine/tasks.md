# Task Breakdown: 001-horizontal-longform-engine

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Status**: ✅ COMPLETE & DELIVERED (2026-11-03)  
**Deliverable**: `/sdcard/Movies/What_If_Pause_Time_8Min.mp4` (145.1 MB, 11m 13s, 1920x1080)

---

## 📋 Phase 1: Setup & Foundational
- [x] [TASK-001] [P1] [US1] Create horizontal video workspace directory: `src/videos/horizontal/` and register horizontal composition in `src/Root.tsx`.
- [x] [TASK-002] [P1] [US2] Create longform scripts directory: `scripts/longform/` and define 8-minute 8-chapter script in `scripts/longform/story_script.json`.

*Verification*: `npx remotion compositions src/index.ts` reports horizontal composition registered at 1920x1080.

---

## 🎙️ Phase 2: User Story 2 — Script & Audio Synthesis Engine
- [x] [TASK-003] [P1] [US2] Implement `scripts/longform/generate_audio.py` for batch TTS (`en-US-ChristopherNeural`) generating 8 chapter audio tracks and sentence timestamps.
- [x] [TASK-004] [P1] [US2] Implement procedural SFX generator and background ambient music ducking per chapter in `scripts/longform/audio_mix.py`.

*Verification*: `python scripts/longform/generate_audio.py` produces 8 WAV files with total duration 673.3s (11.2 minutes).

---

## 🎨 Phase 3: User Story 1 — 1920x1080 2.5D Vector Visual Engine
- [x] [TASK-005] [P1] [US1] Build 2.5D stage backgrounds (Street, Bank, Dark Void, Molecular Grid, Earth in Space, Spacetime, Entropy, Snapback) in `src/videos/horizontal/stage.ts`.
- [x] [TASK-006] [P1] [US1] Port `toon.ts` character choreographies (walking, watch snapping, panic, flight, relief) to 16:9 canvas in `src/videos/horizontal/actors.ts`.
- [x] [TASK-007] [P1] [US1] Assemble Chapter compositions in `src/videos/horizontal/ChapterView.tsx` with dynamic camera zoom, pan, and text callouts (zero blur).

*Verification*: Verified 1920x1080 crisp graphics without blur across preview frames.

---

## 🚀 Phase 4: User Story 3 & 4 — Fast Cloud Render & Stitching Pipeline
- [x] [TASK-008] [P1] [US3] Implement Kaggle execution runner `kaggle/render_script.py` with multi-chapter batch rendering and 4x concurrency.
- [x] [TASK-009] [P2] [US4] Implement FFmpeg lossless chapter concatenation in `scripts/longform/concat_chapters.py` to produce final master MP4.
- [x] [TASK-010] [P1] [US3] Push to Kaggle GPU, execute cloud render, and download `What_If_Pause_Time_8Min.mp4` to `/sdcard/Movies/`.

*Verification*: `ffprobe /sdcard/Movies/What_If_Pause_Time_8Min.mp4` confirms 1920x1080, duration 673.34s (11m 13s), 20,196 frames @ 30fps.
