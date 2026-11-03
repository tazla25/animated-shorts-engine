import React from "react";
import { Series } from "remotion";
import { SHOTS } from "./data";
import { ShotScene } from "./ShotScene";

export const IfverseVideo: React.FC = () => {
  return (
    <Series>
      {SHOTS.map((shot) => (
        <Series.Sequence key={shot.id} durationInFrames={shot.frames}>
          <ShotScene shot={shot} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
