import React, { useRef, useEffect } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { STAGE_DRAWERS } from "./stage";
import { ACTOR_DRAWERS } from "./actors";

export interface SubtitleItem {
  text: string;
  start: number;
  end: number;
}

export interface ChapterViewProps {
  chapterId: number;
  slug: string;
  title: string;
  subtitles: SubtitleItem[];
  audioFileName: string;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapterId,
  slug,
  title,
  subtitles,
  audioFileName,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const curSec = frame / fps;
  const activeSub = subtitles.find(
    (s) => curSec >= s.start && curSec <= s.end
  );

  // Subtle cinematic camera drift
  const scale = interpolate(frame, [0, 900], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });
  const panX = interpolate(frame, [0, 900], [0, -25], {
    extrapolateRight: "clamp",
  });
  const panY = interpolate(frame, [0, 900], [0, -10], {
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Apply smooth camera pan & scale
    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);

    // 1. Draw procedural 2.5D stage
    const drawStage = STAGE_DRAWERS[chapterId] || STAGE_DRAWERS[1];
    drawStage(ctx, frame, width, height);

    // 2. Draw animated cartoon actor choreography
    const drawActor = ACTOR_DRAWERS[chapterId] || ACTOR_DRAWERS[1];
    drawActor(ctx, frame, width, height);

    ctx.restore();
  }, [frame, width, height, chapterId, scale, panX, panY]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 16:9 Canvas */}
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

      {/* Chapter Title Badge (Top-Left) */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          backgroundColor: "rgba(18, 24, 38, 0.88)",
          border: "2px solid rgba(255, 215, 0, 0.75)",
          borderRadius: 12,
          padding: "10px 24px",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.5px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <span style={{ color: "#ffd32a" }}>⏳</span>
        <span>{title}</span>
      </div>

      {/* Subtitles Overlay (Bottom Center) */}
      {activeSub && (
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "84%",
            backgroundColor: "rgba(10, 15, 25, 0.92)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 20,
            padding: "16px 36px",
            textAlign: "center",
            boxShadow: "0 12px 32px rgba(0,0,0,0.65)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.35,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.3px",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {activeSub.text}
          </p>
        </div>
      )}

      {/* Audio Voice Track */}
      <Audio src={staticFile(`pause_time/${audioFileName}`)} />
    </AbsoluteFill>
  );
};
