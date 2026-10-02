import { ARCHIVE_IMAGES } from "../lib/media";
import type { Member } from "../types/content";

export const members: Member[] = [
  {
    id: "woni",
    name: "woni",
    displayName: "WONI",
    localName: "정원희",
    group: "RESCENE",
    role: "成员档案",
    introduction:
      "RESCENE 的队长，来自韩国巨济。舞台上的她负责带领成员向前，而离开镜头之后，又常常展现出更自然、坦率的一面。她曾说，希望成为能够帮助成员、让成员在疲惫时可以依靠的人。对 WONI 来说，音乐之外，那些与成员一起度过的日常，也构成了属于她的另一种舞台。",
    keywords: ["坦率", "温柔", "陪伴"],
    portrait: ARCHIVE_IMAGES.woni,
    gallery: [ARCHIVE_IMAGES.woni, ARCHIVE_IMAGES.woniDaily],
    accent: "blue"
  },
  {
    id: "minami",
    name: "minami",
    displayName: "MINAMI",
    localName: "미나미",
    group: "RESCENE",
    role: "成员档案",
    introduction:
      "来自日本的 RESCENE 成员，也是团队中的全能型成员。她曾参加 MBC《My Teenage Girl》，后来来到韩国继续追逐成为歌手的梦想。她拥有明亮而富有表现力的一面，也擅长用不同的方式诠释自己。2026 年，她与 WONI 一起出现在个人内容中，以独特的幽默感和鲜明的个性被更多人认识；而她也希望人们在记住那些有趣的角色之外，能够先看见作为歌手的 MINAMI。",
    keywords: ["明亮", "自由", "表现力"],
    portrait: ARCHIVE_IMAGES.minami,
    gallery: [ARCHIVE_IMAGES.minami, ARCHIVE_IMAGES.minamiDaily],
    accent: "green"
  }
];

export function getMember(id: Member["id"]) {
  return members.find((member) => member.id === id);
}
