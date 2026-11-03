// High-performance 16:9 2.5D Procedural Vector Stages (1920x1080)
// Designed in crisp Kurzgesagt / JeremyBearimy cartoon aesthetic.
// Pure Canvas2D: 0 WebGL shader bottlenecks, razor-sharp outlines, zero blur.

export const INK = "#1e1424";
export const BG_DARK = "#0d1117";

export type StageDrawer = (g: CanvasRenderingContext2D, f: number, w: number, h: number) => void;

// Helper: draw smooth rounded rect
export const roundRect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath();
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y);
  g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
};

// -----------------------------------------------------------------------------------------
// STAGE 1: The Metropolitan Street & Frozen Time
// -----------------------------------------------------------------------------------------
export const drawStreetScene: StageDrawer = (g, f, w, h) => {
  // Sky gradient
  const skyGrad = g.createLinearGradient(0, 0, 0, h * 0.75);
  skyGrad.addColorStop(0, "#ffb07c");
  skyGrad.addColorStop(0.5, "#ffd8a8");
  skyGrad.addColorStop(1, "#f3eed9");
  g.fillStyle = skyGrad;
  g.fillRect(0, 0, w, h);

  // Distant City Skyline
  g.fillStyle = "#a88fa3";
  const bldgWidths = [120, 160, 90, 140, 200, 110, 170, 130, 150, 180, 210, 140, 190];
  const bldgHeights = [480, 620, 390, 510, 680, 440, 590, 420, 550, 640, 710, 500, 580];
  let curX = -40;
  for (let i = 0; i < bldgWidths.length; i++) {
    const bw = bldgWidths[i];
    const bh = bldgHeights[i];
    g.fillRect(curX, h * 0.75 - bh, bw, bh);
    // windows
    g.fillStyle = "#ffeaa7";
    for (let wy = h * 0.75 - bh + 40; wy < h * 0.75 - 40; wy += 35) {
      for (let wx = curX + 15; wx < curX + bw - 20; wx += 25) {
        if ((wx + wy + i * 17) % 3 === 0) {
          g.fillRect(wx, wy, 12, 18);
        }
      }
    }
    g.fillStyle = "#a88fa3";
    curX += bw - 20;
  }

  // Midground Buildings (Sharper, darker)
  g.fillStyle = "#624b68";
  const midWidths = [180, 220, 160, 250, 190, 230, 260, 180];
  const midHeights = [340, 420, 310, 460, 380, 450, 490, 360];
  curX = -20;
  for (let i = 0; i < midWidths.length; i++) {
    const bw = midWidths[i];
    const bh = midHeights[i];
    g.fillRect(curX, h * 0.75 - bh, bw, bh);
    // Windows
    g.fillStyle = "#fed330";
    for (let wy = h * 0.75 - bh + 30; wy < h * 0.75 - 30; wy += 45) {
      for (let wx = curX + 20; wx < curX + bw - 25; wx += 35) {
        if ((wx * 3 + wy) % 5 !== 0) {
          g.fillRect(wx, wy, 16, 24);
        }
      }
    }
    g.fillStyle = "#624b68";
    curX += bw + 30;
  }

  // Street Ground & Sidewalk
  // Sidewalk
  g.fillStyle = "#d1ccc0";
  g.fillRect(0, h * 0.75, w, 50);
  g.strokeStyle = INK;
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, h * 0.75);
  g.lineTo(w, h * 0.75);
  g.stroke();
  g.beginPath();
  g.moveTo(0, h * 0.75 + 50);
  g.lineTo(w, h * 0.75 + 50);
  g.stroke();

  // Sidewalk paver lines
  g.lineWidth = 2;
  g.strokeStyle = "#a4b0be";
  for (let sx = 0; sx < w; sx += 80) {
    g.beginPath();
    g.moveTo(sx, h * 0.75);
    g.lineTo(sx - 30, h * 0.75 + 50);
    g.stroke();
  }

  // Asphalt Road
  g.fillStyle = "#2f3542";
  g.fillRect(0, h * 0.75 + 50, w, h - (h * 0.75 + 50));

  // Crosswalk white stripes
  g.fillStyle = "#f1f2f6";
  for (let cx = 80; cx < 480; cx += 50) {
    g.fillRect(cx, h * 0.75 + 70, 30, 160);
  }

  // Frozen Yellow Taxi
  const taxiX = 1350;
  const taxiY = h * 0.75 + 60;
  // Wheels
  g.fillStyle = "#1e272e";
  g.beginPath();
  g.arc(taxiX + 70, taxiY + 120, 36, 0, Math.PI * 2);
  g.arc(taxiX + 320, taxiY + 120, 36, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#d2dae2";
  g.beginPath();
  g.arc(taxiX + 70, taxiY + 120, 18, 0, Math.PI * 2);
  g.arc(taxiX + 320, taxiY + 120, 18, 0, Math.PI * 2);
  g.fill();
  // Body
  g.fillStyle = "#eccc68";
  roundRect(g, taxiX, taxiY + 30, 400, 90, 20);
  g.fill();
  g.lineWidth = 5;
  g.strokeStyle = INK;
  g.stroke();
  // Roof / cabin
  roundRect(g, taxiX + 90, taxiY - 30, 220, 70, 25);
  g.fill();
  g.stroke();
  // Windows
  g.fillStyle = "#70a1ff";
  roundRect(g, taxiX + 105, taxiY - 20, 90, 50, 10);
  g.fill();
  roundRect(g, taxiX + 210, taxiY - 20, 85, 50, 10);
  g.fill();
  // Taxi sign on roof
  g.fillStyle = "#ff4757";
  roundRect(g, taxiX + 170, taxiY - 55, 60, 22, 5);
  g.fill();
  g.stroke();
  // Headlight beam (frozen solid!)
  const beamGrad = g.createLinearGradient(taxiX, taxiY + 60, taxiX - 350, taxiY + 60);
  beamGrad.addColorStop(0, "rgba(255, 242, 0, 0.75)");
  beamGrad.addColorStop(1, "rgba(255, 242, 0, 0)");
  g.fillStyle = beamGrad;
  g.beginPath();
  g.moveTo(taxiX, taxiY + 45);
  g.lineTo(taxiX - 400, taxiY - 20);
  g.lineTo(taxiX - 400, taxiY + 140);
  g.lineTo(taxiX, taxiY + 95);
  g.closePath();
  g.fill();

  // Suspended Spilled Coffee Cup (mid-air)
  const cupX = 750;
  const cupY = h * 0.75 - 120;
  g.save();
  g.translate(cupX, cupY);
  g.rotate(0.65); // frozen tilted
  // Cup body
  g.fillStyle = "#ff6b81";
  g.beginPath();
  g.moveTo(-20, -35);
  g.lineTo(20, -35);
  g.lineTo(15, 35);
  g.lineTo(-15, 35);
  g.closePath();
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 3;
  g.stroke();
  // Lid
  g.fillStyle = "#ffffff";
  g.fillRect(-22, -43, 44, 9);
  g.strokeRect(-22, -43, 44, 9);
  // Coffee Splash (frozen droplets)
  g.fillStyle = "#4b2810";
  g.beginPath();
  g.arc(28, -25, 8, 0, Math.PI * 2);
  g.arc(42, -18, 6, 0, Math.PI * 2);
  g.arc(58, -32, 5, 0, Math.PI * 2);
  g.arc(72, -15, 4, 0, Math.PI * 2);
  g.arc(50, -5, 7, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // Frozen Pigeon in flight
  const pigX = 600;
  const pigY = 280;
  g.fillStyle = "#747d8c";
  g.beginPath();
  g.ellipse(pigX, pigY, 25, 14, -0.2, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 3;
  g.stroke();
  // Wings frozen mid-flap
  g.fillStyle = "#57606f";
  g.beginPath();
  g.moveTo(pigX - 5, pigY - 5);
  g.lineTo(pigX - 25, pigY - 45);
  g.lineTo(pigX + 15, pigY - 20);
  g.closePath();
  g.fill();
  g.stroke();

  // Golden Pocket Watch (Foreground UI element or icon)
  if (f > 60) {
    // Subtle golden time-pause wave ring
    const ringT = Math.min(1, (f - 60) / 45);
    g.save();
    g.strokeStyle = `rgba(255, 215, 0, ${1 - ringT * 0.7})`;
    g.lineWidth = 12 * (1 - ringT * 0.5);
    g.beginPath();
    g.arc(380, h * 0.75 - 180, ringT * 1200, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
};

// -----------------------------------------------------------------------------------------
// STAGE 2: The Photon Prison & Optical Blindness
// -----------------------------------------------------------------------------------------
export const drawPhotonVoid: StageDrawer = (g, f, w, h) => {
  // Pitch black void
  g.fillStyle = "#08090f";
  g.fillRect(0, 0, w, h);

  // Subtle isometric optical grid
  g.strokeStyle = "rgba(40, 55, 90, 0.35)";
  g.lineWidth = 1.5;
  for (let gx = 0; gx < w; gx += 80) {
    g.beginPath();
    g.moveTo(gx, 0);
    g.lineTo(gx, h);
    g.stroke();
  }
  for (let gy = 0; gy < h; gy += 80) {
    g.beginPath();
    g.moveTo(0, gy);
    g.lineTo(w, gy);
    g.stroke();
  }

  // Frozen Photons (Glowing particle grid)
  const cols = ["#ffeaa7", "#00cec9", "#fd79a8", "#ff7675", "#74b9ff"];
  for (let px = 100; px < w; px += 110) {
    for (let py = 80; py < h; py += 110) {
      const pSeed = (px * 13 + py * 29) % 100;
      const col = cols[pSeed % cols.length];
      
      // Photon wave packet (frozen sinusoidal wobble)
      g.strokeStyle = col;
      g.lineWidth = 2.5;
      g.beginPath();
      for (let wx = -20; wx <= 20; wx += 4) {
        const wy = Math.sin((wx / 20) * Math.PI * 2) * 8;
        if (wx === -20) g.moveTo(px + wx, py + wy);
        else g.lineTo(px + wx, py + wy);
      }
      g.stroke();

      // Central core photon dot
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(px, py, 4, 0, Math.PI * 2);
      g.fill();

      // Outer glow halo
      g.fillStyle = `${col}33`;
      g.beginPath();
      g.arc(px, py, 14, 0, Math.PI * 2);
      g.fill();
    }
  }

  // Biological Eye Cross-Section Diagram (Right Side)
  const eyeX = w * 0.72;
  const eyeY = h * 0.48;
  const eyeR = 190;

  // Sclera / Outer Eye
  g.fillStyle = "#1e272e";
  g.beginPath();
  g.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#57606f";
  g.lineWidth = 4;
  g.stroke();

  // Retina (Back surface)
  g.strokeStyle = "#ff4757";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(eyeX, eyeY, eyeR - 10, -Math.PI * 0.4, Math.PI * 0.4);
  g.stroke();

  // Cornea & Pupil (Front surface pointing left)
  g.fillStyle = "#000000";
  g.beginPath();
  g.arc(eyeX - eyeR + 35, eyeY, 55, -Math.PI * 0.5, Math.PI * 0.5);
  g.fill();
  g.strokeStyle = "#00d2d3";
  g.lineWidth = 6;
  g.stroke();

  // Frozen Light Ray ending abruptly before pupil
  g.strokeStyle = "rgba(255, 234, 167, 0.9)";
  g.lineWidth = 5;
  g.setLineDash([12, 8]);
  g.beginPath();
  g.moveTo(eyeX - 450, eyeY);
  g.lineTo(eyeX - 220, eyeY); // Stops dead in space!
  g.stroke();
  g.setLineDash([]);

  // Red "BLOCKED / ZERO ENERGY" indicator
  g.fillStyle = "#ff4757";
  g.font = "bold 26px sans-serif";
  g.fillText("⚠️ ZERO PHOTON FLUX (OPTICAL VOID)", eyeX - 250, eyeY + 110);
  g.fillStyle = "#a4b0be";
  g.font = "20px monospace";
  g.fillText("v = 0.00 km/s (LIGHT STOPPED)", eyeX - 210, eyeY + 145);
};

// -----------------------------------------------------------------------------------------
// STAGE 3: The Concrete Air & Acoustic Void
// -----------------------------------------------------------------------------------------
export const drawConcreteAir: StageDrawer = (g, f, w, h) => {
  // Cold steel blue background
  g.fillStyle = "#131b26";
  g.fillRect(0, 0, w, h);

  // Microscopic Nitrogen / Oxygen Molecular Lattice
  const hexSize = 65;
  const dy = hexSize * 1.5;
  const dx = hexSize * Math.sqrt(3);

  for (let r = -1; r < h / dy + 2; r++) {
    for (let c = -1; c < w / dx + 2; c++) {
      const cx = c * dx + (r % 2 === 0 ? 0 : dx / 2);
      const cy = r * dy;

      // Hexagonal frozen bond links
      g.strokeStyle = "rgba(74, 105, 189, 0.28)";
      g.lineWidth = 3;
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const hx = cx + hexSize * 0.55 * Math.cos(ang);
        const hy = cy + hexSize * 0.55 * Math.sin(ang);
        if (i === 0) g.moveTo(hx, hy);
        else g.lineTo(hx, hy);
      }
      g.closePath();
      g.stroke();

      // Frozen Molecules (N2 = Cyan, O2 = Coral Red)
      const isO2 = (r * 7 + c * 3) % 4 === 0;
      g.fillStyle = isO2 ? "#ff6b81" : "#48dbfb";
      g.beginPath();
      g.arc(cx - 10, cy, 11, 0, Math.PI * 2);
      g.arc(cx + 10, cy, 11, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = INK;
      g.lineWidth = 2.5;
      g.stroke();
    }
  }

  // Rigid "Concrete Pressure" Barrier Walls
  g.fillStyle = "rgba(47, 53, 66, 0.5)";
  g.fillRect(150, 100, w - 300, h - 200);
  g.strokeStyle = "#ff4757";
  g.lineWidth = 6;
  g.strokeRect(150, 100, w - 300, h - 200);

  // Frozen Sound Wave: Concentric rings with "CRACK / FROZEN" label
  const sndX = w * 0.35;
  const sndY = h * 0.5;
  for (let sr = 60; sr < 240; sr += 45) {
    g.strokeStyle = "rgba(255, 255, 255, 0.45)";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(sndX, sndY, sr, -Math.PI * 0.6, Math.PI * 0.6);
    g.stroke();
  }

  // Metric HUD Card
  g.fillStyle = "rgba(0,0,0,0.75)";
  roundRect(g, w - 520, h - 260, 460, 190, 16);
  g.fill();
  g.strokeStyle = "#00d2d3";
  g.lineWidth = 3;
  g.stroke();

  g.fillStyle = "#ffffff";
  g.font = "bold 24px sans-serif";
  g.fillText("ATMOSPHERIC STATUS", w - 490, h - 215);
  g.fillStyle = "#ff6b6b";
  g.font = "20px monospace";
  g.fillText("KINETIC PRESSURE: 0.000 Pa", w - 490, h - 175);
  g.fillText("AIR RIGIDITY: CONCRETE SOLID", w - 490, h - 140);
  g.fillText("ACOUSTIC PROPAGATION: 0.0 m/s", w - 490, h - 105);
};

// -----------------------------------------------------------------------------------------
// STAGE 4: The Absolute Zero Trap (-273.15°C)
// -----------------------------------------------------------------------------------------
export const drawAbsoluteZero: StageDrawer = (g, f, w, h) => {
  // Glacial ice gradient
  const iceGrad = g.createLinearGradient(0, 0, 0, h);
  iceGrad.addColorStop(0, "#0c2461");
  iceGrad.addColorStop(0.5, "#1e3799");
  iceGrad.addColorStop(1, "#0a3d62");
  g.fillStyle = iceGrad;
  g.fillRect(0, 0, w, h);

  // Crystalline Frost Spikes along screen perimeter
  g.fillStyle = "rgba(255, 255, 255, 0.22)";
  for (let x = 0; x < w; x += 40) {
    const spikeH = 40 + ((x * 19) % 70);
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + 20, spikeH);
    g.lineTo(x + 40, 0);
    g.fill();
    g.beginPath();
    g.moveTo(x, h);
    g.lineTo(x + 20, h - spikeH);
    g.lineTo(x + 40, h);
    g.fill();
  }

  // Giant Retro-Futuristic Thermometer on Left Side
  const thX = 220;
  const thY = 160;
  const thW = 60;
  const thH = 720;

  // Background stem
  g.fillStyle = "#dcdde1";
  roundRect(g, thX, thY, thW, thH, 30);
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 5;
  g.stroke();

  // Bottom mercury bulb
  g.fillStyle = "#00d2d3";
  g.beginPath();
  g.arc(thX + thW / 2, thY + thH + 20, 65, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Mercury level plunged to absolute bottom
  g.fillStyle = "#00d2d3";
  roundRect(g, thX + 10, thY + thH - 40, thW - 20, 50, 10);
  g.fill();

  // Tick marks & Temperatures
  g.fillStyle = "#2f3542";
  g.font = "bold 20px sans-serif";
  const ticks = [
    { label: "+100°C (Boiling)", y: thY + 50 },
    { label: "+37°C (Human Body)", y: thY + 190 },
    { label: "0°C (Ice Point)", y: thY + 310 },
    { label: "-196°C (Liquid Nitrogen)", y: thY + 520 },
    { label: "-273.15°C (0 KELVIN)", y: thY + 680, highlight: true }
  ];

  ticks.forEach((tk) => {
    g.fillRect(thX + thW, tk.y, 35, 4);
    if (tk.highlight) {
      g.fillStyle = "#ff4757";
      g.font = "bold 26px sans-serif";
      g.fillText(`⬅ ${tk.label}`, thX + thW + 45, tk.y + 9);
      g.fillStyle = "#2f3542";
      g.font = "bold 20px sans-serif";
    } else {
      g.fillText(tk.label, thX + thW + 45, tk.y + 7);
    }
  });

  // Frost crystal particles floating
  for (let i = 0; i < 45; i++) {
    const fx = 600 + ((i * 127) % (w - 700));
    const fy = 120 + ((i * 91) % (h - 240));
    g.strokeStyle = "rgba(223, 230, 233, 0.6)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(fx - 15, fy);
    g.lineTo(fx + 15, fy);
    g.moveTo(fx, fy - 15);
    g.lineTo(fx, fy + 15);
    g.moveTo(fx - 10, fy - 10);
    g.lineTo(fx + 10, fy + 10);
    g.moveTo(fx - 10, fy + 10);
    g.lineTo(fx + 10, fy - 10);
    g.stroke();
  }
};

// -----------------------------------------------------------------------------------------
// STAGE 5: The Orbital Nightmare at Mach 88 (30 km/s)
// -----------------------------------------------------------------------------------------
export const drawOrbitalNightmare: StageDrawer = (g, f, w, h) => {
  // Deep space cosmos
  g.fillStyle = "#05070e";
  g.fillRect(0, 0, w, h);

  // Distant stars
  for (let i = 0; i < 120; i++) {
    const sx = (i * 157) % w;
    const sy = (i * 211) % h;
    const sr = 1 + ((i * 7) % 3);
    g.fillStyle = (i % 3 === 0) ? "#ffeaa7" : "#ffffff";
    g.beginPath();
    g.arc(sx, sy, sr, 0, Math.PI * 2);
    g.fill();
  }

  // Planet Earth hanging on left/center
  const earthX = w * 0.32;
  const earthY = h * 0.52;
  const earthR = 260;

  // Atmosphere glow
  const atmoGrad = g.createRadialGradient(earthX, earthY, earthR * 0.9, earthX, earthY, earthR * 1.25);
  atmoGrad.addColorStop(0, "rgba(72, 219, 251, 0.65)");
  atmoGrad.addColorStop(1, "rgba(72, 219, 251, 0)");
  g.fillStyle = atmoGrad;
  g.beginPath();
  g.arc(earthX, earthY, earthR * 1.25, 0, Math.PI * 2);
  g.fill();

  // Oceans
  g.fillStyle = "#1e90ff";
  g.beginPath();
  g.arc(earthX, earthY, earthR, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 5;
  g.stroke();

  // Continents
  g.fillStyle = "#2ed573";
  g.beginPath();
  g.ellipse(earthX - 70, earthY - 40, 110, 80, 0.4, 0, Math.PI * 2);
  g.ellipse(earthX + 80, earthY + 60, 90, 120, -0.3, 0, Math.PI * 2);
  g.fill();

  // 30 km/s Orbital Velocity Arrow (Massive red vector)
  g.strokeStyle = "#ff4757";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(earthX, earthY - earthR - 40);
  g.lineTo(w - 200, earthY - earthR - 40);
  g.stroke();

  // Arrowhead
  g.fillStyle = "#ff4757";
  g.beginPath();
  g.moveTo(w - 200, earthY - earthR - 65);
  g.lineTo(w - 140, earthY - earthR - 40);
  g.lineTo(w - 200, earthY - earthR - 15);
  g.closePath();
  g.fill();

  // Supersonic Shockwave Cones (Mach 88)
  const coneOriginX = w * 0.72;
  const coneOriginY = h * 0.48;
  for (let c = 1; c <= 4; c++) {
    g.strokeStyle = `rgba(255, 107, 129, ${0.85 / c})`;
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(coneOriginX - c * 50, coneOriginY);
    g.lineTo(coneOriginX - c * 250, coneOriginY - c * 140);
    g.moveTo(coneOriginX - c * 50, coneOriginY);
    g.lineTo(coneOriginX - c * 250, coneOriginY + c * 140);
    g.stroke();
  }

  // Telemetry HUD Card
  g.fillStyle = "rgba(10, 15, 30, 0.88)";
  roundRect(g, w - 580, h - 310, 520, 240, 16);
  g.fill();
  g.strokeStyle = "#ff4757";
  g.lineWidth = 3;
  g.stroke();

  g.fillStyle = "#ffffff";
  g.font = "bold 26px sans-serif";
  g.fillText("ORBITAL INERTIAL OVERLOAD", w - 540, h - 260);
  g.fillStyle = "#ffa502";
  g.font = "22px monospace";
  g.fillText("EARTH ORBIT: 29.78 km/s (107,200 km/h)", w - 540, h - 215);
  g.fillText("RELATIVE IMPACT VELOCITY: MACH 88.2", w - 540, h - 175);
  g.fillStyle = "#ff4757";
  g.fillText("KINETIC ENERGY: EQUIV. 120 TONS TNT", w - 540, h - 135);
  g.fillText("STATUS: CATASTROPHIC SHEAR", w - 540, h - 95);
};

// -----------------------------------------------------------------------------------------
// STAGE 6: The Gravitational Grid Paradox
// -----------------------------------------------------------------------------------------
export const drawGravitationalGrid: StageDrawer = (g, f, w, h) => {
  // Dark spacetime void
  g.fillStyle = "#0c1017";
  g.fillRect(0, 0, w, h);

  // Einstein Spacetime Warped Grid (Perspective Sheet)
  const gridCenterY = h * 0.65;
  g.lineWidth = 2;

  for (let gy = 0; gy < 14; gy++) {
    const yRatio = gy / 14;
    const curY = gridCenterY + yRatio * (h - gridCenterY);
    g.strokeStyle = `rgba(112, 161, 255, ${0.2 + yRatio * 0.5})`;
    g.beginPath();
    for (let x = 0; x <= w; x += 40) {
      // Gravitational well dip in center
      const distToMid = Math.abs(x - w / 2);
      const dip = Math.max(0, 180 - distToMid * 0.4) * (1 - yRatio * 0.6);
      if (x === 0) g.moveTo(x, curY + dip);
      else g.lineTo(x, curY + dip);
    }
    g.stroke();
  }

  // Spacetime longitudinal lines converging toward horizon
  for (let gx = -200; gx <= w + 200; gx += 90) {
    g.strokeStyle = "rgba(112, 161, 255, 0.35)";
    g.beginPath();
    g.moveTo(w / 2, gridCenterY - 140);
    g.lineTo(gx, h);
    g.stroke();
  }

  // Gravitational Mass Sphere causing the well
  g.fillStyle = "#ff6348";
  g.beginPath();
  g.arc(w / 2, gridCenterY + 40, 75, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = INK;
  g.lineWidth = 4;
  g.stroke();

  // Floating zero-g objects (Apple, coin, pebbles)
  g.fillStyle = "#ff4757";
  g.beginPath();
  g.arc(380, 290, 22, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  // Apple leaf
  g.fillStyle = "#2ed573";
  g.fillRect(380, 265, 8, 12);

  // Suspended coin
  g.fillStyle = "#eccc68";
  g.beginPath();
  g.ellipse(1450, 260, 28, 15, 0.4, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Info Card
  g.fillStyle = "rgba(0, 0, 0, 0.78)";
  roundRect(g, 80, 80, 480, 160, 14);
  g.fill();
  g.strokeStyle = "#70a1ff";
  g.lineWidth = 3;
  g.stroke();

  g.fillStyle = "#ffffff";
  g.font = "bold 24px sans-serif";
  g.fillText("GENERAL RELATIVITY METRIC", 110, 130);
  g.fillStyle = "#70a1ff";
  g.font = "20px monospace";
  g.fillText("ds² = -c²dt² + dx² + dy² + dz²", 110, 170);
  g.fillStyle = "#ff6b81";
  g.fillText("WHEN dt = 0 ➔ SINGULARITY COLLAPSE", 110, 205);
};

// -----------------------------------------------------------------------------------------
// STAGE 7: The Quantum Observer & Entropy Arrow
// -----------------------------------------------------------------------------------------
export const drawEntropyQuantum: StageDrawer = (g, f, w, h) => {
  // Midnight purple background
  g.fillStyle = "#120e24";
  g.fillRect(0, 0, w, h);

  // Giant Cosmic Hourglass in Center (Entropy Arrow frozen)
  const hgX = w / 2;
  const hgY = h * 0.48;

  // Upper chamber
  g.strokeStyle = "#a55eea";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(hgX - 160, hgY - 240);
  g.lineTo(hgX + 160, hgY - 240);
  g.lineTo(hgX + 25, hgY);
  g.lineTo(hgX + 160, hgY + 240);
  g.lineTo(hgX - 160, hgY + 240);
  g.lineTo(hgX - 25, hgY);
  g.closePath();
  g.stroke();

  // Glass glow
  g.fillStyle = "rgba(165, 94, 234, 0.12)";
  g.fill();

  // Upper Sand (Full)
  g.fillStyle = "#ffd32a";
  g.beginPath();
  g.moveTo(hgX - 130, hgY - 220);
  g.lineTo(hgX + 130, hgY - 220);
  g.lineTo(hgX + 45, hgY - 50);
  g.lineTo(hgX - 45, hgY - 50);
  g.closePath();
  g.fill();

  // Suspended Sand grains (frozen in neck, zero flow)
  g.fillStyle = "#ffd32a";
  for (let s = -15; s <= 15; s += 7) {
    g.beginPath();
    g.arc(hgX + s, hgY - 15, 3, 0, Math.PI * 2);
    g.arc(hgX + s * 0.6, hgY + 15, 3, 0, Math.PI * 2);
    g.fill();
  }

  // Large Entropy Arrow pointing Right (Frozen / Red cross)
  g.strokeStyle = "#ff3838";
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(w * 0.72, h * 0.48);
  g.lineTo(w * 0.92, h * 0.48);
  g.stroke();
  g.beginPath();
  g.moveTo(w * 0.92, h * 0.48);
  g.lineTo(w * 0.88, h * 0.44);
  g.moveTo(w * 0.92, h * 0.48);
  g.lineTo(w * 0.88, h * 0.52);
  g.stroke();

  // Giant Red "X" over Arrow
  g.lineWidth = 14;
  g.beginPath();
  g.moveTo(w * 0.80, h * 0.42);
  g.lineTo(w * 0.84, h * 0.54);
  g.moveTo(w * 0.84, h * 0.42);
  g.lineTo(w * 0.80, h * 0.54);
  g.stroke();

  // Text Callout
  g.fillStyle = "#ffffff";
  g.font = "bold 26px sans-serif";
  g.fillText("THE ARROW OF TIME (ENTROPY)", w * 0.68, h * 0.36);
  g.fillStyle = "#ff3838";
  g.font = "22px monospace";
  g.fillText("ΔS ≥ 0 FORBIDDEN BY TIME STOP", w * 0.68, h * 0.62);
};

// -----------------------------------------------------------------------------------------
// STAGE 8: The 10th Second Snapback & Climax
// -----------------------------------------------------------------------------------------
export const drawSnapbackClimax: StageDrawer = (g, f, w, h) => {
  // First draw the street scene base
  drawStreetScene(g, f, w, h);

  // Snapback supersonic shockwave expanding from center
  const cx = w / 2;
  const cy = h * 0.65;

  // Concentric supersonic pressure shockwaves
  for (let r = 100; r < 1400; r += 160) {
    g.strokeStyle = "rgba(255, 255, 255, 0.7)";
    g.lineWidth = 8;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
  }

  // Blinding white / golden burst rays
  g.fillStyle = "rgba(255, 234, 167, 0.45)";
  for (let i = 0; i < 16; i++) {
    const ang = (i * Math.PI) / 8;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(ang - 0.08) * 1600, cy + Math.sin(ang - 0.08) * 1600);
    g.lineTo(cx + Math.cos(ang + 0.08) * 1600, cy + Math.sin(ang + 0.08) * 1600);
    g.closePath();
    g.fill();
  }

  // Giant 10-Second Countdown Digital Clock in Sky
  g.fillStyle = "rgba(0, 0, 0, 0.85)";
  roundRect(g, cx - 220, 80, 440, 110, 20);
  g.fill();
  g.strokeStyle = "#2ed573";
  g.lineWidth = 4;
  g.stroke();

  g.fillStyle = "#2ed573";
  g.font = "bold 58px monospace";
  g.textAlign = "center";
  g.fillText("00:10.00", cx, 158);
  g.textAlign = "left";
};

// Registry of stage drawers
export const STAGE_DRAWERS: Record<number, StageDrawer> = {
  1: drawStreetScene,
  2: drawPhotonVoid,
  3: drawConcreteAir,
  4: drawAbsoluteZero,
  5: drawOrbitalNightmare,
  6: drawGravitationalGrid,
  7: drawEntropyQuantum,
  8: drawSnapbackClimax,
};
