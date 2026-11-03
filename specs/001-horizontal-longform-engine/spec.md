# Feature Specification: 001-horizontal-longform-engine

**Title**: 8-10 Minute Horizontal (16:9) Animated Video Creation & Fast-Render Engine  
**Status**: DRAFT  
**Author**: Suman & Antigravity  
**Target Video**: "What If You Could Pause Time for 10 Seconds?" (8-Minute Deep-Dive)  
**Format**: 1920x1080 (16:9 Landscape, 30 FPS, H.264 / AAC)  

---

## 🎯 Objective & Problem Statement
The user wants to produce long-form, high-retention horizontal YouTube videos (8 to 10 minutes) in the signature visual style of `@JeremyBearimyTheory` and `Kurzgesagt` (2D vector bean-head stickman characters, dynamic camera moves, crisp zero-blur vector backgrounds, and scientific second-person storytelling). 

Previous Three.js full-shader tests took ~1.5 hours for 67 seconds due to heavy convolution passes (LensBlur DOF). This specification defines a **modular 2.5D Parallax Vector Engine** that renders full 8-10 minute videos (14,400+ frames) in **under 8 minutes total** on Kaggle GPU.

---

## 👤 User Stories

### P1 - US1: 1920x1080 Horizontal 2.5D Vector Canvas Engine
**As a** viewer on YouTube,  
**I want** sharp, colorful, zero-blur 1080p landscape animation featuring expressive 2D bean-head stickman characters and fluid camera pans/zooms,  
**So that** the video looks professional, crisp on desktop and TV screens, and maintains high visual retention without blurry artifacts.

**Acceptance Criteria**:
- Composition resolution: `1920` width $\times$ `1080` height (16:9).
- Visual rendering: 2.5D layered architecture (Background -> Midground Props -> Character Billboards -> Foreground / Camera).
- Zero-blur: Post-processing depth-of-field convolution is disabled (`lens: false`); all lines and characters are razor-sharp.
- Frame rate: Locked 30 FPS.

### P1 - US2: 8-Minute Chapter-Based Script & Audio Synthesis
**As a** creator,  
**I want** a compelling, scientifically grounded 8-minute script divided into distinct thematic chapters,  
**So that** the narrative maintains high curiosity and each chapter can be processed as a modular scene.

**Story Structure ("What If You Could Pause Time for 10 Seconds?")**:
1. *Chapter 1 (0:00 - 1:15)*: The Fantasy — Snapping fingers, frozen crowds, grabbing free snacks, the god complex.
2. *Chapter 2 (1:15 - 2:30)*: The Photons Trap — Light freezes in space; walking into darkness; instant blindness.
3. *Chapter 3 (2:30 - 3:45)*: The Concrete Air — Nitrogen and oxygen molecules freeze solid; unable to breathe or move.
4. *Chapter 4 (3:45 - 5:00)*: Absolute Zero Shock — Thermal energy is atomic movement; kinetic cessation causes terrifying cold.
5. *Chapter 5 (5:00 - 6:30)*: Orbital Catastrophe — Earth moves at 30 km/s around the Sun; the inertia paradox.
6. *Chapter 6 (6:30 - 8:00)*: The 10-Second Snapback — Shockwaves, sonic booms, resumed momentum, and the philosophical takeaway.

**Acceptance Criteria**:
- Voiceover generated via `edge-tts` (`en-US-ChristopherNeural` or `en-US-GuyNeural`) with word-level timestamps (`words.json`).
- Dynamic sound effects (clock freeze, whoosh, glass shatter, heartbeat, sonic boom) mixed per chapter.

### P1 - US3: Sub-8-Minute Fast Cloud Rendering on Kaggle GPU
**As a** mobile orchestrator in Termux,  
**I want** the cloud GPU to encode 14,400 frames at 40-60+ frames per second,  
**So that** an 8-minute video renders in 5 to 8 minutes without approaching Kaggle's 9-hour timeout limit.

**Acceptance Criteria**:
- Concurrency configured to 4 workers.
- 2.5D Canvas2D / SVG rendering without heavy WebGL shader passes.
- Verification command outputs 0 exit code with total duration ~480 seconds.

### P2 - US4: Autonomous Multi-Chapter Stitching (FFmpeg Concat)
**As an** engine pipeline,  
**I want** all rendered chapter MP4 slices to be stitched together with chapter markers and continuous background score,  
**So that** the final output is a single, uninterrupted 8-minute MP4 file ready for YouTube upload.

**Acceptance Criteria**:
- Fast FFmpeg stream copy (`-c copy` or audio re-mux) merges chapters in < 5 seconds.
- Final artifact: `/sdcard/Movies/What_If_Pause_Time_8Min.mp4`.

---

## 🚫 Non-Goals & Out of Scope
- No 3D photorealistic ray-tracing or complex vertex displacement (the channel identity is 2D doodle cartoon vector).
- No manual Blender GUI modeling (all animation is 100% automated via code from Termux).
- No vertical 9:16 aspect ratio (this feature is strictly horizontal 16:9 for YouTube main feed).

---

## ❓ Clarification Matrix (The 3 Critical Choices)

| Decision Item | Option A (Recommended) | Option B | Option C |
| :--- | :--- | :--- | :--- |
| **1. Voice Persona** | **Christopher Neural** (Deep, documentary, serious authoritative narrator like JeremyBearimy) | **Guy Neural** (Casual, friendly, conversational indie creator) | **Custom Multi-Voice** (Narrator + Character voice) |
| **2. Chapter Count** | **6 Chapters (~1m15s each = 7.5-8 mins)** (Optimal for deep scientific pacing) | **8 Chapters (~1m each = 8 mins)** (Faster scene cuts, higher visual variation) | **4 Chapters (~2m each = 8 mins)** |
| **3. Target Resolution** | **1080p Full HD (1920x1080 @ 30fps)** (Standard YouTube quality, fast render) | **720p HD (1280x720 @ 30fps)** (Ultra-fast preview render) | **1440p 2K (2560x1440)** |
