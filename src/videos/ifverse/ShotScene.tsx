import React, { useRef, useEffect } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ShotInfo } from "./data";
import { SHOT_DRAWERS } from "./shots";

export const ShotScene: React.FC<{ shot: ShotInfo }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const curSec = frame / fps;
  const activeSub = shot.words_data.find(
    (w) => curSec >= w.start && curSec <= w.end
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Call shot-specific Canvas2D procedural renderer
    const drawer = SHOT_DRAWERS[shot.id];
    if (drawer) {
      drawer(ctx, frame, width, height);
    }
  }, [frame, width, height, shot.id]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#060910" }}>
      {/* High-DPI 1080p Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      {/* Top Sci-Fi Telemetry Badge */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 48,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 20px",
          backgroundColor: "rgba(10, 15, 25, 0.85)",
          border: "1.5px solid #00d2d3",
          borderRadius: 8,
          boxShadow: "0 0 15px rgba(0, 210, 211, 0.3)",
          color: "#00d2d3",
          fontFamily: "monospace",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        <span style={{ color: "#ff4757" }}>● REC</span>
        <span style={{ color: "#ffffff" }}>//</span>
        <span>SCENE {String(shot.id).padStart(2, "0")} : {shot.tag.toUpperCase().replace(/_/g, " ")}</span>
      </div>

      {/* Dynamic Subtitle Overlay */}
      {activeSub && (
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "86%",
            backgroundColor: "rgba(6, 9, 16, 0.92)",
            border: "2px solid rgba(0, 210, 211, 0.6)",
            borderRadius: 16,
            padding: "14px 32px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 210, 211, 0.2)",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: "0.2px",
              lineHeight: 1.35,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
            }}
          >
            {activeSub.text}
          </span>
        </div>
      )}

      {/* Shot Voice Audio */}
      <Audio src={staticFile(`ifverse/${shot.wavFileName}`)} />
    </AbsoluteFill>
  );
};
