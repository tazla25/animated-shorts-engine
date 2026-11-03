// 11 High-Impact Cinematic 2D Shots for Ifverse-Style Animated Short
// Pure Canvas2D, 1920x1080 Widescreen, 60fps rendering, zero blur.

import { Stickman, StickmanPose } from "./stickman";

export type ShotDrawer = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => void;

// Helper: draw stylish sci-fi HUD badge
export const drawHUD = (
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  lines: string[],
  borderColor = "#00d2d3"
) => {
  g.save();
  g.fillStyle = "rgba(10, 15, 25, 0.88)";
  g.strokeStyle = borderColor;
  g.lineWidth = 2.5;

  // Chamfered box
  g.beginPath();
  g.moveTo(x + 15, y);
  g.lineTo(x + w, y);
  g.lineTo(x + w, y + h - 15);
  g.lineTo(x + w - 15, y + h);
  g.lineTo(x, y + h);
  g.lineTo(x, y + 15);
  g.closePath();
  g.fill();
  g.stroke();

  // Title
  g.fillStyle = borderColor;
  g.font = "bold 20px monospace";
  g.fillText(title, x + 18, y + 28);

  // Divider
  g.strokeStyle = "rgba(255, 255, 255, 0.2)";
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(x + 18, y + 36);
  g.lineTo(x + w - 18, y + 36);
  g.stroke();

  // Content Lines
  g.fillStyle = "#ffffff";
  g.font = "18px monospace";
  lines.forEach((l, i) => {
    g.fillText(l, x + 18, y + 64 + i * 26);
  });
  g.restore();
};

// -----------------------------------------------------------------------------------
// SHOT 1: City Chaos (Rain, Neon City, Walking)
// -----------------------------------------------------------------------------------
export const drawShot1_CityChaos: ShotDrawer = (g, f, w, h) => {
  // Midnight navy sky
  const skyGrad = g.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#080c14");
  skyGrad.addColorStop(1, "#141c2c");
  g.fillStyle = skyGrad;
  g.fillRect(0, 0, w, h);

  // Distant neon skyscrapers
  const bldgs = [140, 200, 110, 180, 240, 160, 220, 150, 190, 230, 170];
  let curX = -50;
  for (let i = 0; i < bldgs.length; i++) {
    const bw = bldgs[i];
    const bh = 450 + ((i * 67) % 350);
    g.fillStyle = "#0d131f";
    g.fillRect(curX, h * 0.75 - bh, bw, bh);

    // Neon roof edge
    g.strokeStyle = i % 2 === 0 ? "rgba(0, 210, 255, 0.5)" : "rgba(255, 71, 87, 0.4)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(curX, h * 0.75 - bh);
    g.lineTo(curX + bw, h * 0.75 - bh);
    g.stroke();

    // Windows
    for (let wy = h * 0.75 - bh + 40; wy < h * 0.75 - 40; wy += 35) {
      for (let wx = curX + 15; wx < curX + bw - 15; wx += 25) {
        if ((wx + wy + i * 19) % 4 === 0) {
          g.fillStyle = "rgba(255, 234, 167, 0.75)";
          g.fillRect(wx, wy, 10, 16);
        }
      }
    }
    curX += bw + 15;
  }

  // Sidewalk & Road
  const groundY = h * 0.78;
  g.fillStyle = "#1e272e";
  g.fillRect(0, groundY, w, h - groundY);
  g.strokeStyle = "rgba(0, 210, 255, 0.6)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, groundY);
  g.lineTo(w, groundY);
  g.stroke();

  // Rain streaks
  g.strokeStyle = "rgba(116, 185, 255, 0.35)";
  g.lineWidth = 1.5;
  for (let r = 0; r < 90; r++) {
    const rx = ((r * 127 + f * 18) % (w + 200)) - 100;
    const ry = (r * 89 + f * 28) % h;
    g.beginPath();
    g.moveTo(rx, ry);
    g.lineTo(rx - 8, ry + 32);
    g.stroke();
  }

  // Stickman walking with umbrella / hurried gait
  const stickX = w * 0.42 + Math.sin(f * 0.05) * 40;
  const walkPhase = (f % 26) / 26;
  const pose = Stickman.getWalkPose(walkPhase);
  Stickman.render(g, stickX, groundY, 1.25, pose, "#ffffff", "rgba(0, 210, 255, 0.7)");
};

// -----------------------------------------------------------------------------------
// SHOT 2: Watch Click (Punch-Zoom Close-up on Hand)
// -----------------------------------------------------------------------------------
export const drawShot2_WatchClick: ShotDrawer = (g, f, w, h) => {
  // Vignette background
  const radGrad = g.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, 700);
  radGrad.addColorStop(0, "#192a56");
  radGrad.addColorStop(1, "#05070e");
  g.fillStyle = radGrad;
  g.fillRect(0, 0, w, h);

  // Dynamic punch-zoom on frame 120
  const zoom = f > 120 ? 1.0 + Math.min(0.35, (f - 120) * 0.02) : 1.0;
  g.save();
  g.translate(w / 2, h / 2);
  g.scale(zoom, zoom);
  g.translate(-w / 2, -h / 2);

  // Stickman in center clicking watch
  const clickProgress = f / 180;
  const pose = Stickman.getClickWatchPose(clickProgress);
  Stickman.render(g, w / 2 - 20, h * 0.76, 1.45, pose, "#ffffff", "rgba(241, 196, 15, 0.6)");

  // Golden pulse rings expanding from watch
  const pulseR = (f * 12) % 450;
  g.strokeStyle = `rgba(241, 196, 15, ${1 - pulseR / 450})`;
  g.lineWidth = 4;
  g.beginPath();
  g.arc(w / 2 + 25, h * 0.76 - 290, pulseR, 0, Math.PI * 2);
  g.stroke();

  // White flash on click frame (~140)
  if (f >= 135 && f <= 150) {
    const flashAlpha = 1 - (f - 135) / 15;
    g.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    g.fillRect(0, 0, w, h);
  }

  g.restore();

  drawHUD(g, 60, 60, 360, 130, "CHRONO-PULSE", [
    "DEVICE: GOLDEN CROWN",
    f > 140 ? "STATUS: CLICKED (ACTIVE)" : "STATUS: ARMED",
    "TARGET: UNIVERSAL FLOW"
  ], "#f1c40f");
};

// -----------------------------------------------------------------------------------
// SHOT 3: Freeze God (Frozen Coffee, Pigeon, Wide Glide)
// -----------------------------------------------------------------------------------
export const drawShot3_FreezeGod: ShotDrawer = (g, f, w, h) => {
  // Frozen gold-tinted street
  const skyGrad = g.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#1e272e");
  skyGrad.addColorStop(1, "#2f3640");
  g.fillStyle = skyGrad;
  g.fillRect(0, 0, w, h);

  const groundY = h * 0.78;
  g.fillStyle = "#1e272e";
  g.fillRect(0, groundY, w, h - groundY);

  // Suspended Spilled Coffee Cup (Mid-air liquid glass)
  const cupX = w * 0.35;
  const cupY = h * 0.45;
  g.save();
  g.translate(cupX, cupY);
  g.rotate(0.7);
  g.fillStyle = "#e84118";
  g.fillRect(-22, -35, 44, 70);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 3;
  g.strokeRect(-22, -35, 44, 70);
  // Amber coffee droplets frozen in space
  g.fillStyle = "#d35400";
  g.beginPath();
  g.arc(35, -20, 10, 0, Math.PI * 2);
  g.arc(55, -12, 7, 0, Math.PI * 2);
  g.arc(75, -28, 6, 0, Math.PI * 2);
  g.arc(95, -15, 5, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // Frozen Pigeon mid-flap
  const pigX = w * 0.22;
  const pigY = h * 0.28;
  g.fillStyle = "#718093";
  g.beginPath();
  g.ellipse(pigX, pigY, 28, 16, -0.2, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 2.5;
  g.stroke();

  // Stickman standing triumphantly as a god
  const pose = Stickman.getGodPose(f);
  Stickman.render(g, w * 0.65, groundY, 1.35, pose, "#ffffff", "rgba(241, 196, 15, 0.8)");

  // Golden aura rays
  g.strokeStyle = "rgba(241, 196, 15, 0.25)";
  g.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const ang = (i * Math.PI) / 6;
    g.beginPath();
    g.moveTo(w * 0.65, groundY - 180);
    g.lineTo(w * 0.65 + Math.cos(ang) * 900, groundY - 180 + Math.sin(ang) * 900);
    g.stroke();
  }

  drawHUD(g, w - 420, 60, 360, 120, "REALITY LOCK", [
    "CHRONO-STATUS: FROZEN",
    "ENTROPY RATE: 0.00 %",
    "GOD MODE: ACTIVE"
  ], "#f1c40f");
};

// -----------------------------------------------------------------------------------
// SHOT 4: Sudden Blackout (Punch-Zoom to Eyes in Darkness)
// -----------------------------------------------------------------------------------
export const drawShot4_SuddenBlackout: ShotDrawer = (g, f, w, h) => {
  // Pitch black background
  g.fillStyle = "#040508";
  g.fillRect(0, 0, w, h);

  // Severe punch zoom on face
  const zoom = 1.0 + Math.min(0.6, f * 0.015);
  g.save();
  g.translate(w / 2, h / 2);
  g.scale(zoom, zoom);
  g.translate(-w / 2, -h / 2);

  // Stickman in utter shock
  const pose = Stickman.getBlindPose(f);
  Stickman.render(g, w / 2, h * 0.72, 1.45, pose, "#ffffff", "rgba(231, 76, 60, 0.6)");

  // Red glitch alarm border
  g.strokeStyle = "rgba(231, 76, 60, 0.5)";
  g.lineWidth = 14;
  g.strokeRect(0, 0, w, h);

  g.restore();

  drawHUD(g, 60, 60, 420, 140, "OPTICAL COLLAPSE", [
    "ERROR: PHOTONS UNREACHABLE",
    "RETINA ENERGY: 0.00 JOULES",
    "VISUAL STATE: COMPLETE BLINDNESS"
  ], "#ff4757");
};

// -----------------------------------------------------------------------------------
// SHOT 5: The Photon Prison (Frozen Light Wave-Packets in Void)
// -----------------------------------------------------------------------------------
export const drawShot5_PhotonPrison: ShotDrawer = (g, f, w, h) => {
  // Deep space indigo void
  g.fillStyle = "#050811";
  g.fillRect(0, 0, w, h);

  // Isometric grid
  g.strokeStyle = "rgba(30, 55, 90, 0.4)";
  g.lineWidth = 1.5;
  for (let gx = 0; gx < w; gx += 90) {
    g.beginPath();
    g.moveTo(gx, 0);
    g.lineTo(gx, h);
    g.stroke();
  }
  for (let gy = 0; gy < h; gy += 90) {
    g.beginPath();
    g.moveTo(0, gy);
    g.lineTo(w, gy);
    g.stroke();
  }

  // Hundreds of frozen photons (wavy light packets locked stationary)
  const pcols = ["#ffeaa7", "#00cec9", "#fd79a8", "#74b9ff"];
  for (let px = 80; px < w; px += 120) {
    for (let py = 80; py < h; py += 120) {
      const col = pcols[(px * 7 + py * 11) % pcols.length];
      g.strokeStyle = col;
      g.lineWidth = 3;
      g.beginPath();
      for (let x = -15; x <= 15; x += 3) {
        const y = Math.sin((x / 15) * Math.PI * 2) * 8;
        if (x === -15) g.moveTo(px + x, py + y);
        else g.lineTo(px + x, py + y);
      }
      g.stroke();

      // Glowing core dot
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(px, py, 3.5, 0, Math.PI * 2);
      g.fill();
    }
  }

  // Stickman groping blindly across the photon field
  const pose = Stickman.getBlindPose(f);
  Stickman.render(g, w * 0.45, h * 0.72, 1.35, pose, "#ffffff", "rgba(0, 210, 255, 0.8)");

  drawHUD(g, w - 460, 60, 400, 130, "PHOTON PRISON", [
    "PHOTON VELOCITY: 0.00 km/s",
    "LIGHT WAVE PROPAGATION: CEASED",
    "STATUS: FROZEN MARBLES"
  ], "#00cec9");
};

// -----------------------------------------------------------------------------------
// SHOT 6: The Concrete Air (Hexagonal Rigid Lattice & Pushing)
// -----------------------------------------------------------------------------------
export const drawShot6_ConcreteAir: ShotDrawer = (g, f, w, h) => {
  // Dark cold slate background
  g.fillStyle = "#0c121e";
  g.fillRect(0, 0, w, h);

  // Microscopic nitrogen/oxygen hexagonal lattice (steel bars)
  const hex = 80;
  const dy = hex * 1.5;
  const dx = hex * Math.sqrt(3);
  for (let r = 0; r < h / dy + 1; r++) {
    for (let c = 0; c < w / dx + 1; c++) {
      const cx = c * dx + (r % 2 === 0 ? 0 : dx / 2);
      const cy = r * dy;
      g.strokeStyle = "rgba(72, 219, 251, 0.35)";
      g.lineWidth = 3;
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = cx + hex * 0.5 * Math.cos(a);
        const y = cy + hex * 0.5 * Math.sin(a);
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.stroke();

      // Molecules (Cyan N2, Coral O2)
      g.fillStyle = (r + c) % 3 === 0 ? "#ff6b81" : "#00d2d3";
      g.beginPath();
      g.arc(cx - 8, cy, 9, 0, Math.PI * 2);
      g.arc(cx + 8, cy, 9, 0, Math.PI * 2);
      g.fill();
    }
  }

  // Rigid Wall barrier
  g.strokeStyle = "#ff4757";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(w * 0.58, 80);
  g.lineTo(w * 0.58, h - 80);
  g.stroke();

  // Stickman pushing with immense strain against the wall
  const pose = Stickman.getPushPose(f);
  Stickman.render(g, w * 0.46, h * 0.72, 1.4, pose, "#ffffff", "rgba(255, 71, 87, 0.7)");

  drawHUD(g, 60, 60, 420, 140, "ATMOSPHERIC WALL", [
    "KINETIC ENERGY: 0.0 J",
    "COMPRESSIBILITY: 0.000 (RIGID)",
    "SURROUNDINGS: SOLID CONCRETE"
  ], "#ff4757");
};

// -----------------------------------------------------------------------------------
// SHOT 7: Absolute Zero (-273.15°C Cryogenic Plunge)
// -----------------------------------------------------------------------------------
export const drawShot7_AbsoluteZero: ShotDrawer = (g, f, w, h) => {
  // Deep cryogenic gradient
  const iceGrad = g.createLinearGradient(0, 0, 0, h);
  iceGrad.addColorStop(0, "#081c3c");
  iceGrad.addColorStop(1, "#020a17");
  g.fillStyle = iceGrad;
  g.fillRect(0, 0, w, h);

  // Frost crystal shards creeping on edges
  g.fillStyle = "rgba(223, 249, 251, 0.28)";
  for (let x = 0; x < w; x += 35) {
    const sp = 50 + ((x * 23) % 80);
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + 18, sp);
    g.lineTo(x + 35, 0);
    g.fill();
    g.beginPath();
    g.moveTo(x, h);
    g.lineTo(x + 18, h - sp);
    g.lineTo(x + 35, h);
    g.fill();
  }

  // Plunging retro-futuristic thermometer
  const tx = 220;
  const ty = 140;
  g.fillStyle = "#dfe4ea";
  g.fillRect(tx, ty, 45, 680);
  g.strokeStyle = "#ffffff";
  g.lineWidth = 4;
  g.strokeRect(tx, ty, 45, 680);

  // Mercury bulb
  g.fillStyle = "#00d2d3";
  g.beginPath();
  g.arc(tx + 22.5, ty + 700, 55, 0, Math.PI * 2);
  g.fill();

  // Low temperature highlight
  g.fillStyle = "#ff4757";
  g.font = "bold 26px monospace";
  g.fillText("⬅ -273.15°C (0 KELVIN)", tx + 65, ty + 660);

  // Shivering stickman
  const pose = Stickman.getShiverPose(f);
  Stickman.render(g, w * 0.62, h * 0.74, 1.35, pose, "#dff9fb", "rgba(0, 210, 255, 0.8)");

  drawHUD(g, w - 440, 60, 380, 130, "THERMAL EQUILIBRIUM", [
    "ATOMIC VIBRATION: ZERO",
    "AMBIENT TEMP: 0 KELVIN",
    "STATE: FLASH-FREEZING"
  ], "#00d2d3");
};

// -----------------------------------------------------------------------------------
// SHOT 8: Orbital Nightmare (Mach 88 Catapult in Space)
// -----------------------------------------------------------------------------------
export const drawShot8_OrbitalMach88: ShotDrawer = (g, f, w, h) => {
  // Deep space cosmos
  g.fillStyle = "#030408";
  g.fillRect(0, 0, w, h);

  // Stars
  for (let i = 0; i < 90; i++) {
    const sx = (i * 137) % w;
    const sy = (i * 193) % h;
    g.fillStyle = (i % 3 === 0) ? "#f1c40f" : "#ffffff";
    g.beginPath();
    g.arc(sx, sy, 1.5, 0, Math.PI * 2);
    g.fill();
  }

  // Planet Earth
  const ex = w * 0.28;
  const ey = h * 0.52;
  const er = 240;

  // Atmosphere glow
  const atmo = g.createRadialGradient(ex, ey, er * 0.9, ex, ey, er * 1.3);
  atmo.addColorStop(0, "rgba(0, 210, 255, 0.6)");
  atmo.addColorStop(1, "rgba(0, 210, 255, 0)");
  g.fillStyle = atmo;
  g.beginPath();
  g.arc(ex, ey, er * 1.3, 0, Math.PI * 2);
  g.fill();

  // Earth body
  g.fillStyle = "#0984e3";
  g.beginPath();
  g.arc(ex, ey, er, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#00b894";
  g.beginPath();
  g.ellipse(ex - 60, ey - 30, 90, 70, 0.3, 0, Math.PI * 2);
  g.ellipse(ex + 70, ey + 60, 80, 110, -0.4, 0, Math.PI * 2);
  g.fill();

  // Blazing 30 km/s Orbital Velocity Arrow
  g.strokeStyle = "#ff4757";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(ex, ey - er - 50);
  g.lineTo(w - 220, ey - er - 50);
  g.stroke();
  g.fillStyle = "#ff4757";
  g.beginPath();
  g.moveTo(w - 220, ey - er - 70);
  g.lineTo(w - 160, ey - er - 50);
  g.lineTo(w - 220, ey - er - 30);
  g.closePath();
  g.fill();

  // Stickman catapulted forward at Mach 88
  const flyX = w * 0.68;
  const flyY = h * 0.5;
  const pose = Stickman.getMach88Pose();
  Stickman.render(g, flyX, flyY, 1.3, pose, "#ffffff", "rgba(255, 71, 87, 0.9)");

  // Supersonic shockwave speed lines behind stickman
  g.strokeStyle = "rgba(255, 71, 87, 0.8)";
  g.lineWidth = 4;
  for (let s = 1; s <= 4; s++) {
    g.beginPath();
    g.moveTo(flyX - s * 50, flyY);
    g.lineTo(flyX - s * 220, flyY - s * 110);
    g.moveTo(flyX - s * 50, flyY);
    g.lineTo(flyX - s * 220, flyY + s * 110);
    g.stroke();
  }

  drawHUD(g, w - 520, h - 260, 460, 180, "INERTIAL DISCONNECT", [
    "EARTH ORBIT: 29.78 km/s",
    "RELATIVE SPEED: MACH 88.2",
    "KINETIC IMPACT: EXTREME DANGER",
    "STATUS: ATMOSPHERIC SHEAR"
  ], "#ff4757");
};

// -----------------------------------------------------------------------------------
// SHOT 9: 10th Second Countdown (Giant Tension Timer)
// -----------------------------------------------------------------------------------
export const drawShot9_Countdown: ShotDrawer = (g, f, w, h) => {
  // Blood red tension background
  const grad = g.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 800);
  grad.addColorStop(0, "#2d0a0a");
  grad.addColorStop(1, "#0a0303");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  // Concentric alarm rings
  const ring = (f * 15) % 600;
  g.strokeStyle = `rgba(255, 71, 87, ${1 - ring / 600})`;
  g.lineWidth = 5;
  g.beginPath();
  g.arc(w / 2, h / 2, ring, 0, Math.PI * 2);
  g.stroke();

  // Digital Countdown Timer in Center
  g.fillStyle = "rgba(10, 0, 0, 0.9)";
  g.strokeStyle = "#ff4757";
  g.lineWidth = 5;
  g.strokeRect(w / 2 - 320, h / 2 - 120, 640, 240);
  g.fillRect(w / 2 - 320, h / 2 - 120, 640, 240);

  const sec = f < 80 ? "00:08.40" : f < 160 ? "00:09.80" : "00:10.00";
  g.fillStyle = f >= 160 ? "#2ed573" : "#ff4757";
  g.font = "bold 96px monospace";
  g.textAlign = "center";
  g.fillText(sec, w / 2, h / 2 + 35);
  g.textAlign = "left";

  g.fillStyle = "#ffffff";
  g.font = "bold 24px monospace";
  g.fillText("CHRONO-SNAPBACK THRESHOLD", w / 2 - 210, h / 2 + 85);
};

// -----------------------------------------------------------------------------------
// SHOT 10: Snapback Explosion (Sonic Boom & White Burst)
// -----------------------------------------------------------------------------------
export const drawShot10_SnapbackExplosion: ShotDrawer = (g, f, w, h) => {
  // Screen shake on first 30 frames
  const shakeX = f < 30 ? (Math.random() - 0.5) * 35 : 0;
  const shakeY = f < 30 ? (Math.random() - 0.5) * 35 : 0;

  g.save();
  g.translate(shakeX, shakeY);

  // Blinding white / golden burst background
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, w, h);

  // Supersonic shockwave expanding rings
  const cx = w / 2;
  const cy = h / 2;
  for (let r = 50; r < 1400; r += 160) {
    g.strokeStyle = `rgba(241, 196, 15, ${Math.max(0, 0.8 - r / 1400)})`;
    g.lineWidth = 14;
    g.beginPath();
    g.arc(cx, cy, r + f * 10, 0, Math.PI * 2);
    g.stroke();
  }

  // Radial burst rays
  g.fillStyle = "rgba(255, 234, 167, 0.35)";
  for (let i = 0; i < 18; i++) {
    const ang = (i * Math.PI) / 9;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(ang - 0.08) * 1600, cy + Math.sin(ang - 0.08) * 1600);
    g.lineTo(cx + Math.cos(ang + 0.08) * 1600, cy + Math.sin(ang + 0.08) * 1600);
    g.closePath();
    g.fill();
  }

  g.restore();
};

// -----------------------------------------------------------------------------------
// SHOT 11: Aftermath & Verdict (Sunlight, Kneeling Relief)
// -----------------------------------------------------------------------------------
export const drawShot11_Aftermath: ShotDrawer = (g, f, w, h) => {
  // Warm golden morning sky
  const skyGrad = g.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#ffbe76");
  skyGrad.addColorStop(0.6, "#ffdd59");
  skyGrad.addColorStop(1, "#f1f2f6");
  g.fillStyle = skyGrad;
  g.fillRect(0, 0, w, h);

  const groundY = h * 0.78;
  g.fillStyle = "#2f3542";
  g.fillRect(0, groundY, w, h - groundY);

  // Warm sunlight rays
  g.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 8; i++) {
    const ang = 0.6 + i * 0.15;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(Math.cos(ang - 0.04) * 2200, Math.sin(ang - 0.04) * 2200);
    g.lineTo(Math.cos(ang + 0.04) * 2200, Math.sin(ang + 0.04) * 2200);
    g.closePath();
    g.fill();
  }

  // Stickman kneeling on pavement in profound relief
  const pose = Stickman.getKneelPose(f);
  Stickman.render(g, w * 0.5, groundY + 10, 1.4, pose, "#ffffff", "rgba(241, 196, 15, 0.7)");

  // Golden Pocket Watch resting in front
  g.fillStyle = "#f1c40f";
  g.beginPath();
  g.arc(w * 0.5 + 85, groundY, 18, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 3;
  g.stroke();

  // Final Philosophical Hook Card
  drawHUD(g, w / 2 - 280, 80, 560, 120, "THE VERDICT", [
    "TIME: THE ARROW OF ENTROPY",
    "WOULD YOU EVER PRESS IT AGAIN?"
  ], "#2ed573");
};

export const SHOT_DRAWERS: Record<number, ShotDrawer> = {
  1: drawShot1_CityChaos,
  2: drawShot2_WatchClick,
  3: drawShot3_FreezeGod,
  4: drawShot4_SuddenBlackout,
  5: drawShot5_PhotonPrison,
  6: drawShot6_ConcreteAir,
  7: drawShot7_AbsoluteZero,
  8: drawShot8_OrbitalMach88,
  9: drawShot9_Countdown,
  10: drawShot10_SnapbackExplosion,
  11: drawShot11_Aftermath,
};
