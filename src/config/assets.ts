import generated from "./assets.generated.json";
import sequenceData from "./sequence.generated.json";
export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
export type AssetKey = keyof typeof generated;
export const assets: Record<AssetKey, MediaAsset | null> = generated;
export type SequenceVariant = {
  base: string;
  count: number;
  width: number;
  bytes: number;
};
export type Sequence = {
  available: boolean;
  duration?: number;
  desktop: SequenceVariant | null;
  mobile: SequenceVariant | null;
  poster: string | null;
  previewVideo: string | null;
};
export const sequence: Sequence = sequenceData;
