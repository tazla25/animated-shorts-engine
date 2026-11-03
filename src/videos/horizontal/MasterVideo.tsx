import React from "react";
import { Series } from "remotion";
import { ChapterView } from "./ChapterView";
import { CHAPTERS } from "./data";

export const MasterVideo: React.FC = () => {
  return (
    <Series>
      {CHAPTERS.map((ch) => (
        <Series.Sequence key={ch.id} durationInFrames={ch.frames}>
          <ChapterView
            chapterId={ch.id}
            slug={ch.slug}
            title={ch.title}
            subtitles={ch.subtitles}
            audioFileName={ch.audioFileName}
          />
        </Series.Sequence>
      ))}
    </Series>
  );
};
