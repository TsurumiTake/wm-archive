import type { NavItem } from "../types/content";

export const siteConfig = {
  name: "花与爱丽丝",
  fullName: "花与爱丽丝｜WONI × MINAMI",
  description: "一个记录 WONI 与 MINAMI 青春瞬间的视觉相册。",
  group: "RESCENE",
  pair: "WONI × MINAMI",
  shortPair: "W×M",
  defaultUrl: "https://hana-alice.vercel.app",
  archiveNote:
    "花与爱丽丝是一个个人视觉相册项目。",
  navigation: [
    { label: "首页", path: "/" },
    { label: "她们", path: "/#who-are-they" },
    { label: "发生", path: "/moments" },
    { label: "留言", path: "/letter" }
  ] satisfies NavItem[]
};


