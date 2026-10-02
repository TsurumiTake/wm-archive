export type MomentCategory = "daily" | "stage" | "behind";

export type ImageTone = "blue" | "green" | "teal" | "deep";

export interface ImageAsset {
  src: string;
  alt: string;
  fallbackLabel: string;
  tone: ImageTone;
  position?: string;
}

export interface SourceCredit {
  source: string;
  credit: string;
  url?: string;
  note?: string;
}

export interface Member {
  id: "woni" | "minami";
  name: string;
  displayName: string;
  localName: string;
  group: string;
  role: string;
  introduction: string;
  keywords: string[];
  portrait: ImageAsset;
  gallery: ImageAsset[];
  accent: "blue" | "green";
}

export interface Moment {
  id: string;
  number: string;
  category: MomentCategory;
  image: ImageAsset;
  alt: string;
}

export interface NavItem {
  label: string;
  path: string;
}



export interface LetterMessage {
  id: string;
  message: string;
  nickname?: string;
}
export interface DuoVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: ImageAsset;
  url: string;
  platform: string;
}