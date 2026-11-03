// Typed Metadata and Subtitles for Ifverse Short
import meta from "../../../public/ifverse/shots_meta.json";

export interface ShotInfo {
  id: number;
  tag: string;
  text: string;
  duration: number;
  frames: number;
  wav: string;
  wavFileName: string;
  words_data: { text: string; start: number; end: number }[];
}

export const SHOTS: ShotInfo[] = meta.shots.map((s: any) => ({
  id: s.id,
  tag: s.tag,
  text: s.text,
  duration: s.duration,
  frames: s.frames,
  wav: s.wav,
  wavFileName: `shot_${s.id}_${s.tag}.wav`,
  words_data: s.words_data || [],
}));

export const TOTAL_FRAMES = meta.total_frames;
export const TOTAL_DURATION = meta.total_duration;
