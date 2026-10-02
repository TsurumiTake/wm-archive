import type { DuoVideo } from "../types/content";

const cover = (number: string): DuoVideo["thumbnail"] => ({
  src: new URL(`../assets/images/duo/videos/video-${number}.jpg`, import.meta.url).href,
  alt: `视频片段 ${number} 封面`,
  fallbackLabel: `VIDEO ${number}`,
  tone: "teal",
  position: "center"
});

const description = "Bilibili 视频片段，点击封面前往原视频。";

export const duoVideos: DuoVideo[] = [
  {
    id: "video-001",
    title: "向出身于日本（Gyaru）文化的Minami学习日语",
    description,
    thumbnail: cover("001"),
    url: "https://www.bilibili.com/video/BV145PxzCEhz/",
    platform: "bilibili"
  },
  {
    id: "video-002",
    title: "我向Minami学习了辣妹的风格",
    description,
    thumbnail: cover("002"),
    url: "https://www.bilibili.com/video/BV1FiAWzoE8H/",
    platform: "bilibili"
  },
  {
    id: "video-003",
    title: "辣妹与巨济岛（上篇）",
    description,
    thumbnail: cover("003"),
    url: "https://www.bilibili.com/video/BV1eRGB6AEoo/",
    platform: "bilibili"
  },
  {
    id: "video-004",
    title: "辣妹与巨济岛（下篇）",
    description,
    thumbnail: cover("004"),
    url: "https://www.bilibili.com/video/BV1UCEJ6JE3f/",
    platform: "bilibili"
  },
  {
    id: "video-005",
    title: "我问过他们是不是真的会喊“呀吼～”",
    description,
    thumbnail: cover("005"),
    url: "https://www.bilibili.com/video/BV1Tsj66TED5/",
    platform: "bilibili"
  },
  {
    id: "video-006",
    title: "Minami的真实面貌",
    description,
    thumbnail: cover("006"),
    url: "https://www.bilibili.com/video/BV1pxTg6DEH2/",
    platform: "bilibili"
  },
  {
    id: "video-007",
    title: "寻找Minami的根源｜最终篇",
    description,
    thumbnail: cover("007"),
    url: "https://www.bilibili.com/video/BV1ALT46YEFB/",
    platform: "bilibili"
  },
  {
    id: "video-008",
    title: "体验不良少年的一天｜角色番外篇",
    description,
    thumbnail: cover("008"),
    url: "https://www.bilibili.com/video/BV1ofNJ6AEzp/",
    platform: "bilibili"
  }
];
