import type { ImageAsset } from "../types/content";

const heroOneUrl = new URL("../assets/images/hero/hero_1.png", import.meta.url).href;
const woniPortraitUrl = new URL("../assets/images/woni/woni-001-portrait.JPG", import.meta.url).href;
const minamiPortraitUrl = new URL("../assets/images/minami/minami-001-portrait.JPG", import.meta.url).href;
const woniDailyUrl = new URL("../assets/images/woni/woni-002-daily.jpg", import.meta.url).href;
const minamiDailyUrl = new URL("../assets/images/minami/minami-002-daily.jpg", import.meta.url).href;
const duoPhotoUrl = new URL("../assets/images/duo/photos/daily/daily-001.JPG", import.meta.url).href;

export const ARCHIVE_IMAGES = {
  hero: {
    src: heroOneUrl,
    alt: "花与爱丽丝首页主视觉照片",
    fallbackLabel: "首页主视觉",
    tone: "blue",
    position: "center"
  },
  woni: {
    src: woniPortraitUrl,
    alt: "WONI 单人照片",
    fallbackLabel: "WONI / PORTRAIT",
    tone: "blue",
    position: "center"
  },
  minami: {
    src: minamiPortraitUrl,
    alt: "MINAMI 单人照片",
    fallbackLabel: "MINAMI / PORTRAIT",
    tone: "green",
    position: "center"
  },
  woniDaily: {
    src: woniDailyUrl,
    alt: "WONI 日常照片",
    fallbackLabel: "WONI / DAILY",
    tone: "green",
    position: "center"
  },
  minamiDaily: {
    src: minamiDailyUrl,
    alt: "MINAMI 日常照片",
    fallbackLabel: "MINAMI / DAILY",
    tone: "blue",
    position: "center"
  },
  duo: {
    src: duoPhotoUrl,
    alt: "WONI 与 MINAMI 双人照片",
    fallbackLabel: "WONI × MINAMI",
    tone: "teal",
    position: "center"
  }
} satisfies Record<string, ImageAsset>;

export const IMAGE_EXTENSION_GUIDE = {
  recommendation: "正式图片优先使用 .webp 或 .avif",
  folders: ["hero", "woni", "minami", "duo", "duo/photos", "duo/videos"]
};