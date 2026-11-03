import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { MasterVideo } from "./videos/horizontal/MasterVideo";
import { ChapterView } from "./videos/horizontal/ChapterView";
import { CHAPTERS, TOTAL_FRAMES } from "./videos/horizontal/data";

export const Root: React.FC = () => {
  return (
    <>
      {/* 16:9 Longform Master Video (8-10+ mins, 1920x1080) */}
      <Composition
        id="WhatIfPauseTime_Master"
        component={MasterVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Chapter Compositions for Parallel Cloud Rendering */}
      {CHAPTERS.map((ch) => (
        <Composition
          key={ch.id}
          id={`Chapter_${ch.id}_${ch.slug.replace(/-/g, "_")}`}
          component={ChapterView}
          durationInFrames={ch.frames}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            chapterId: ch.id,
            slug: ch.slug,
            title: ch.title,
            subtitles: ch.subtitles,
            audioFileName: ch.audioFileName,
          }}
        />
      ))}

      {/* Legacy 9:16 vertical test */}
      <Composition
        id="BridgeShort"
        component={BridgeShort}
        durationInFrames={BRIDGE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
