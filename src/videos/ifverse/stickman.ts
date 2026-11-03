// Procedural 2D Stickman Engine for Ifverse-Style Animated Shorts
// Pure Canvas2D, fluid joint physics, expressive silhouette body language.

export type Point = [number, number];

export interface StickmanPose {
  head: Point;
  neck: Point;
  hip: Point;
  leftElbow: Point;
  leftHand: Point;
  rightElbow: Point;
  rightHand: Point;
  leftKnee: Point;
  leftFoot: Point;
  rightKnee: Point;
  rightFoot: Point;
  headTilt?: number;
  eyes?: "normal" | "wide" | "shock" | "closed" | "glow";
  holdingWatch?: boolean;
}

export class Stickman {
  static drawBone(
    g: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    color: string,
    width: number
  ) {
    g.strokeStyle = color;
    g.lineWidth = width;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(from[0], from[1]);
    g.lineTo(to[0], to[1]);
    g.stroke();
  }

  static render(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    pose: StickmanPose,
    color = "#ffffff",
    glowColor = "rgba(0, 210, 255, 0.4)",
    boneWidth = 9
  ) {
    g.save();
    g.translate(x, y);
    g.scale(scale, scale);

    // Optional neon glow
    if (glowColor) {
      g.shadowColor = glowColor;
      g.shadowBlur = 12;
    }

    const bw = boneWidth;

    // 1. Torso Spine (Neck -> Hip)
    this.drawBone(g, pose.neck, pose.hip, color, bw + 1);

    // 2. Left Leg (Back leg)
    this.drawBone(g, pose.hip, pose.leftKnee, color, bw);
    this.drawBone(g, pose.leftKnee, pose.leftFoot, color, bw);

    // 3. Right Leg (Front leg)
    this.drawBone(g, pose.hip, pose.rightKnee, color, bw);
    this.drawBone(g, pose.rightKnee, pose.rightFoot, color, bw);

    // 4. Left Arm
    this.drawBone(g, pose.neck, pose.leftElbow, color, bw);
    this.drawBone(g, pose.leftElbow, pose.leftHand, color, bw);

    // 5. Right Arm
    this.drawBone(g, pose.neck, pose.rightElbow, color, bw);
    this.drawBone(g, pose.rightElbow, pose.rightHand, color, bw);

    // 6. Hands (Joint dots)
    g.fillStyle = color;
    g.beginPath();
    g.arc(pose.leftHand[0], pose.leftHand[1], bw * 0.7, 0, Math.PI * 2);
    g.arc(pose.rightHand[0], pose.rightHand[1], bw * 0.7, 0, Math.PI * 2);
    g.fill();

    // 7. Head (Solid circle + outline)
    const [hx, hy] = pose.head;
    const hr = 28;
    g.fillStyle = color;
    g.beginPath();
    g.arc(hx, hy, hr, 0, Math.PI * 2);
    g.fill();

    // Eyes (Ifverse style glowing or wide pupils)
    if (pose.eyes === "shock" || pose.eyes === "glow") {
      g.fillStyle = "#00d2d3";
      g.beginPath();
      g.arc(hx - 8, hy - 4, 7, 0, Math.PI * 2);
      g.arc(hx + 8, hy - 4, 7, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(hx - 8, hy - 4, 3, 0, Math.PI * 2);
      g.arc(hx + 8, hy - 4, 3, 0, Math.PI * 2);
      g.fill();
    } else if (pose.eyes === "wide") {
      g.fillStyle = "#1e272e";
      g.beginPath();
      g.arc(hx - 7, hy - 3, 5, 0, Math.PI * 2);
      g.arc(hx + 7, hy - 3, 5, 0, Math.PI * 2);
      g.fill();
    }

    // 8. Golden Pocket Watch (If holding)
    if (pose.holdingWatch) {
      const wx = pose.rightHand[0];
      const wy = pose.rightHand[1];
      g.save();
      g.translate(wx, wy);
      g.shadowColor = "#f1c40f";
      g.shadowBlur = 16;
      g.fillStyle = "#f1c40f";
      g.beginPath();
      g.arc(0, 0, 16, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#ffffff";
      g.lineWidth = 2.5;
      g.stroke();
      // Watch face
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(0, 0, 10, 0, Math.PI * 2);
      g.fill();
      // Watch hands
      g.strokeStyle = "#e74c3c";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -6);
      g.moveTo(0, 0);
      g.lineTo(5, 0);
      g.stroke();
      g.restore();
    }

    g.restore();
  }

  // -------------------------------------------------------------------------
  // Procedural Animation Pose Builders
  // -------------------------------------------------------------------------

  // 1. Walk Cycle
  static getWalkPose(phase: number): StickmanPose {
    const twoPi = Math.PI * 2;
    const legAngle = Math.sin(phase * twoPi) * 0.65;
    const armAngle = -Math.sin(phase * twoPi) * 0.55;
    const bob = Math.abs(Math.sin(phase * twoPi)) * 8;

    const hip: Point = [0, -110 + bob];
    const neck: Point = [0, -210 + bob];
    const head: Point = [0, -260 + bob];

    // Left leg
    const lk: Point = [-Math.sin(legAngle) * 55, hip[1] + Math.cos(legAngle) * 55];
    const lf: Point = [lk[0] - Math.sin(legAngle * 0.8) * 55, lk[1] + Math.cos(legAngle * 0.8) * 55];

    // Right leg
    const rk: Point = [Math.sin(legAngle) * 55, hip[1] + Math.cos(legAngle) * 55];
    const rf: Point = [rk[0] + Math.sin(legAngle * 0.8) * 55, rk[1] + Math.cos(legAngle * 0.8) * 55];

    // Left arm
    const le: Point = [Math.sin(armAngle) * 45, neck[1] + Math.cos(armAngle) * 45];
    const lh: Point = [le[0] + Math.sin(armAngle) * 40, le[1] + Math.cos(armAngle) * 40];

    // Right arm
    const re: Point = [-Math.sin(armAngle) * 45, neck[1] + Math.cos(armAngle) * 45];
    const rh: Point = [re[0] - Math.sin(armAngle) * 40, re[1] + Math.cos(armAngle) * 40];

    return {
      head, neck, hip,
      leftElbow: le, leftHand: lh,
      rightElbow: re, rightHand: rh,
      leftKnee: lk, leftFoot: lf,
      rightKnee: rk, rightFoot: rf,
      eyes: "wide"
    };
  }

  // 2. Click Watch Pose
  static getClickWatchPose(progress: number): StickmanPose {
    const clickY = progress > 0.6 ? 2 : 0;
    return {
      head: [10, -255],
      neck: [0, -210],
      hip: [-5, -110],
      leftElbow: [-35, -170],
      leftHand: [-45, -120],
      rightElbow: [25, -185],
      rightHand: [30, -200 + clickY],
      leftKnee: [-20, -55],
      leftFoot: [-25, 0],
      rightKnee: [15, -55],
      rightFoot: [20, 0],
      eyes: progress > 0.6 ? "shock" : "wide",
      holdingWatch: true
    };
  }

  // 3. Shock God Pose (Arms raised in triumph/awe)
  static getGodPose(f: number): StickmanPose {
    const bob = Math.sin(f * 0.1) * 5;
    return {
      head: [0, -260 + bob],
      neck: [0, -210 + bob],
      hip: [0, -110 + bob],
      leftElbow: [-55, -230 + bob],
      leftHand: [-75, -270 + bob],
      rightElbow: [55, -230 + bob],
      rightHand: [75, -270 + bob],
      leftKnee: [-25, -55],
      leftFoot: [-35, 0],
      rightKnee: [25, -55],
      rightFoot: [35, 0],
      eyes: "shock",
      holdingWatch: true
    };
  }

  // 4. Blind Grope Pose (Groping in the dark)
  static getBlindPose(f: number): StickmanPose {
    const wave = Math.sin(f * 0.12) * 15;
    return {
      head: [25, -245],
      neck: [15, -200],
      hip: [-10, -105],
      leftElbow: [55, -190 + wave],
      leftHand: [95, -180 + wave],
      rightElbow: [65, -210 - wave],
      rightHand: [110, -205 - wave],
      leftKnee: [-10, -55],
      leftFoot: [-15, 0],
      rightKnee: [25, -55],
      rightFoot: [35, 0],
      eyes: "shock"
    };
  }

  // 5. Push Solid Concrete Air
  static getPushPose(f: number): StickmanPose {
    const strain = (f % 4 < 2) ? 2 : -2;
    return {
      head: [35 + strain, -235],
      neck: [20 + strain, -195],
      hip: [-25, -110],
      leftElbow: [65, -190],
      leftHand: [95, -195],
      rightElbow: [70, -170],
      rightHand: [95, -165],
      leftKnee: [-45, -55],
      leftFoot: [-65, 0],
      rightKnee: [10, -55],
      rightFoot: [20, 0],
      eyes: "shock"
    };
  }

  // 6. Absolute Zero Shiver
  static getShiverPose(f: number): StickmanPose {
    const jx = (f % 2 === 0) ? 3 : -3;
    const jy = (f % 3 === 0) ? 2 : -2;
    return {
      head: [jx, -230 + jy],
      neck: [0, -190],
      hip: [-5, -100],
      leftElbow: [-25, -170],
      leftHand: [15, -165],
      rightElbow: [25, -170],
      rightHand: [-15, -165],
      leftKnee: [-20, -50],
      leftFoot: [-25, 0],
      rightKnee: [15, -50],
      rightFoot: [20, 0],
      eyes: "shock"
    };
  }

  // 7. Catapulted Mach 88 Flight Pose
  static getMach88Pose(): StickmanPose {
    return {
      head: [70, -180],
      neck: [40, -160],
      hip: [-40, -120],
      leftElbow: [-10, -175],
      leftHand: [-60, -190],
      rightElbow: [-15, -145],
      rightHand: [-65, -150],
      leftKnee: [-85, -130],
      leftFoot: [-130, -140],
      rightKnee: [-80, -100],
      rightFoot: [-125, -90],
      eyes: "shock"
    };
  }

  // 8. Kneel in Relief Pose
  static getKneelPose(f: number): StickmanPose {
    const breathe = Math.sin(f * 0.08) * 4;
    return {
      head: [5, -135 + breathe],
      neck: [0, -105 + breathe],
      hip: [-15, -45],
      leftElbow: [-15, -60],
      leftHand: [25, -5],
      rightElbow: [15, -60],
      rightHand: [35, -5],
      leftKnee: [20, -15],
      leftFoot: [-25, 0],
      rightKnee: [25, -15],
      rightFoot: [-20, 0],
      eyes: "closed",
      holdingWatch: true
    };
  }
}
