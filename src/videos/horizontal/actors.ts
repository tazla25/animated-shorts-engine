// 16:9 Character Choreography & Actor Animations
// Uses toon.ts procedural cartoon pipeline directly on Canvas2D.
// Zero Three.js / WebGL overhead, razor-sharp 1080p outlines.

import {
  Pen, bodyFront, bodySide, Outfit, Expr, FrontOpts, SideOpts, townsfolk, KID, PARENT, INK, SKIN
} from "../bridge/toon";

export const PROTAGONIST: Outfit = {
  jacket: "#2980b9", // vibrant blue winter jacket
  pants: "#2c3e50",  // dark denim
  boots: "#1a1a1a",  // dark boots
  hat: "hair",
  hair: "#3d2314",   // dark brown hair
  skin: "#ffe2c2",
  build: "adult",
};

export const FROZEN_CITIZEN_1: Outfit = {
  jacket: "#e67e22", // orange jacket
  pants: "#34495e",
  boots: "#2c3e50",
  hat: "hair",
  hair: "#2c3e50",
  skin: "#f5c9a0",
  build: "adult",
};

export const FROZEN_CITIZEN_2: Outfit = {
  ...townsfolk(1),
  skin: "#ecd0b6",
  build: "stout",
};

// Helper to draw character at (x, y) with a target height in pixels
export const drawCharacter = (
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  targetHeight: number,
  view: "front" | "side",
  outfit: Outfit,
  frontOpts?: FrontOpts,
  sideOpts?: SideOpts
) => {
  g.save();
  // Design space in toon.ts has soles at y = 975, bounding height ~1000
  g.translate(x, y);
  const s = targetHeight / 975;
  g.scale(s, s);

  const pen = new Pen(g);
  if (view === "front") {
    bodyFront(pen, outfit, frontOpts ?? {});
  } else {
    bodySide(pen, outfit, sideOpts ?? {});
  }
  g.restore();
};

// ---------------------------------------------------------------------------------
// Chapter Actor Choreographies
// ---------------------------------------------------------------------------------

// Scene 1: Walking on street & pausing watch
export const drawScene1Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const groundY = h * 0.75 + 40;
  
  // Frozen pedestrian background
  drawCharacter(g, 280, groundY - 20, 320, "front", FROZEN_CITIZEN_1, {
    mode: "stand",
    expr: "neutral",
    look: 0.3
  });

  drawCharacter(g, 1080, groundY - 20, 310, "front", FROZEN_CITIZEN_2, {
    mode: "stand",
    expr: "shock",
    look: -0.4
  });

  // Protagonist
  // From frame 0 to 60: walking forward
  // After frame 60: halts, looks down at watch, clicks
  if (f < 60) {
    const walkX = 450 + (f / 60) * 120;
    const walkPhase = (f % 24) / 24;
    drawCharacter(g, walkX, groundY, 380, "side", PROTAGONIST, undefined, {
      phase: walkPhase,
      mode: "march",
      stride: 1.0,
      expr: "neutral"
    });
  } else {
    // Halts and looks at golden watch
    const expr: Expr = f > 80 ? "shock" : "grin";
    drawCharacter(g, 570, groundY, 380, "front", PROTAGONIST, {
      mode: "stand",
      expr,
      tilt: 0.05,
      headTilt: 0.12,
      look: 0.2
    });

    // Draw Golden Pocket Watch in Protagonist's hand
    g.save();
    g.translate(610, groundY - 180);
    g.fillStyle = "#f1c40f";
    g.beginPath();
    g.arc(0, 0, 18, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 3;
    g.stroke();
    // Crown
    g.fillRect(-4, -24, 8, 7);
    g.strokeRect(-4, -24, 8, 7);
    // Watch face
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.arc(0, 0, 13, 0, Math.PI * 2);
    g.fill();
    // Watch hands
    g.strokeStyle = "#c0392b";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, -9);
    g.moveTo(0, 0);
    g.lineTo(6, 2);
    g.stroke();
    g.restore();
  }
};

// Scene 2: Blind panic in photon void
export const drawScene2Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const actorX = w * 0.38;
  const actorY = h * 0.72;
  const bob = Math.sin(f * 0.08) * 8;

  // Protagonist feeling around blindly in the dark
  drawCharacter(g, actorX, actorY + bob, 420, "front", PROTAGONIST, {
    mode: "stand",
    expr: "shock",
    tilt: Math.sin(f * 0.05) * 0.08,
    headTilt: Math.cos(f * 0.06) * 0.1,
    facing: 0
  });

  // Reaching hands in front (cartoon blind grope lines)
  g.strokeStyle = "rgba(255, 255, 255, 0.4)";
  g.lineWidth = 3;
  g.setLineDash([6, 6]);
  g.beginPath();
  g.moveTo(actorX + 80, actorY - 220);
  g.lineTo(actorX + 220, actorY - 220 + Math.sin(f * 0.1) * 20);
  g.stroke();
  g.setLineDash([]);
};

// Scene 3: Trapped against solid concrete air
export const drawScene3Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const actorX = w * 0.45;
  const actorY = h * 0.72;

  // Straining to push forward against invisible barrier
  drawCharacter(g, actorX, actorY, 410, "side", PROTAGONIST, undefined, {
    mode: "push",
    expr: "nervous",
    pose: 1.0,
    stride: 0.6
  });

  // Stress sweat beads
  g.fillStyle = "#3498db";
  g.beginPath();
  g.arc(actorX - 10, actorY - 330 + (f % 15), 4, 0, Math.PI * 2);
  g.arc(actorX - 25, actorY - 320 + ((f + 7) % 15), 3, 0, Math.PI * 2);
  g.fill();
};

// Scene 4: Flash-freezing at absolute zero
export const drawScene4Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const actorX = w * 0.62;
  const actorY = h * 0.75;
  const shiver = (f % 4 < 2) ? 3 : -3;

  // Icy blue tinted protagonist shivering
  const frozenProtagonist: Outfit = {
    ...PROTAGONIST,
    jacket: "#2980b9",
    skin: "#dff9fb" // pale frozen skin
  };

  drawCharacter(g, actorX + shiver, actorY, 420, "front", frozenProtagonist, {
    mode: "stand",
    expr: "shock",
    tilt: -0.06,
    headTilt: 0.08
  });

  // Frost breath cloud (frozen solid in mid-air!)
  g.fillStyle = "rgba(223, 249, 251, 0.75)";
  g.beginPath();
  g.arc(actorX - 60, actorY - 320, 18, 0, Math.PI * 2);
  g.arc(actorX - 85, actorY - 325, 26, 0, Math.PI * 2);
  g.arc(actorX - 115, actorY - 320, 22, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 2;
  g.stroke();
};

// Scene 5: Orbital inertia flight at Mach 88
export const drawScene5Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const actorX = w * 0.68;
  const actorY = h * 0.48;

  g.save();
  g.translate(actorX, actorY);
  g.rotate(0.35); // Flying horizontally forward through space
  drawCharacter(g, 0, 0, 360, "front", PROTAGONIST, {
    mode: "fall",
    expr: "dazed",
    tilt: 0.1
  });
  g.restore();

  // Speed lines behind flying character
  g.strokeStyle = "rgba(231, 76, 60, 0.85)";
  g.lineWidth = 4;
  for (let i = 0; i < 5; i++) {
    const ly = actorY - 80 + i * 40;
    g.beginPath();
    g.moveTo(actorX - 120, ly);
    g.lineTo(actorX - 450 - ((f * 17 + i * 50) % 200), ly);
    g.stroke();
  }
};

// Scene 6: Zero-G Spacetime Float
export const drawScene6Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const actorX = w * 0.5;
  const actorY = h * 0.42;
  const floatBob = Math.sin(f * 0.04) * 25;
  const floatRot = Math.sin(f * 0.03) * 0.18;

  g.save();
  g.translate(actorX, actorY + floatBob);
  g.rotate(floatRot);
  drawCharacter(g, 0, 180, 390, "front", PROTAGONIST, {
    mode: "stand",
    expr: "nervous",
    tilt: 0.08
  });
  g.restore();
};

// Scene 7: Quantum Observer & Entropy Clock
export const drawScene7Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const actorX = w * 0.28;
  const actorY = h * 0.72;

  // Staring in awe at the frozen cosmic hourglass
  drawCharacter(g, actorX, actorY, 410, "side", PROTAGONIST, undefined, {
    mode: "stand",
    expr: "dazed",
    stride: 0.4
  });
};

// Scene 8: Relief & The 10th Second Snapback
export const drawScene8Actors = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => {
  const groundY = h * 0.75 + 40;
  const actorX = w * 0.5;

  // Protagonist on ground / knees in pure relief
  drawCharacter(g, actorX, groundY + 30, 360, "front", PROTAGONIST, {
    mode: "sit",
    expr: "relief",
    headTilt: 0.15,
    tilt: 0.08
  });

  // Golden Pocket Watch resting safely on ground
  g.save();
  g.translate(actorX + 110, groundY);
  g.fillStyle = "#f1c40f";
  g.beginPath();
  g.arc(0, 0, 20, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 3;
  g.stroke();
  g.restore();
};

export const ACTOR_DRAWERS: Record<number, (g: CanvasRenderingContext2D, f: number, w: number, h: number) => void> = {
  1: drawScene1Actors,
  2: drawScene2Actors,
  3: drawScene3Actors,
  4: drawScene4Actors,
  5: drawScene5Actors,
  6: drawScene6Actors,
  7: drawScene7Actors,
  8: drawScene8Actors,
};
