// Typed chapter metadata and subtitle loading for 16:9 Longform Video
import meta from "../../../public/pause_time/chapters_meta.json";
import words1 from "../../../public/pause_time/words_1_the-fantasy.json";
import words2 from "../../../public/pause_time/words_2_the-photon-prison.json";
import words3 from "../../../public/pause_time/words_3_the-concrete-air.json";
import words4 from "../../../public/pause_time/words_4_absolute-zero.json";
import words5 from "../../../public/pause_time/words_5_orbital-catastrophe.json";
import words6 from "../../../public/pause_time/words_6_gravitational-paradox.json";
import words7 from "../../../public/pause_time/words_7_quantum-entropy.json";
import words8 from "../../../public/pause_time/words_8_the-snapback.json";

export interface ChapterConfig {
  id: number;
  slug: string;
  title: string;
  duration: number;
  frames: number;
  audioFileName: string;
  subtitles: { text: string; start: number; end: number }[];
}

const WORDS_MAP: Record<number, any[]> = {
  1: words1,
  2: words2,
  3: words3,
  4: words4,
  5: words5,
  6: words6,
  7: words7,
  8: words8,
};

export const CHAPTERS: ChapterConfig[] = meta.chapters.map((ch: any) => ({
  id: ch.id,
  slug: ch.slug,
  title: ch.title,
  duration: ch.duration,
  frames: ch.frames,
  audioFileName: `chapter_${ch.id}_${ch.slug}.wav`,
  subtitles: WORDS_MAP[ch.id] || [],
}));

export const TOTAL_FRAMES = meta.total_frames;
export const TOTAL_DURATION = meta.total_duration;
