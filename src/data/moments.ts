import type { ImageAsset, Moment, MomentCategory } from "../types/content";

const PHOTO_MODULES = import.meta.glob(
  "../assets/images/duo/photos/{daily,stage,behind}/*",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

export const MOMENT_CATEGORY_ORDER: ReadonlyArray<MomentCategory> = [
  "daily",
  "stage",
  "behind"
];

export const MOMENT_CATEGORY_META: Record<
  MomentCategory,
  { label: string; english: string; tone: ImageAsset["tone"] }
> = {
  daily: {
    label: "日常",
    english: "DAILY",
    tone: "green"
  },
  stage: {
    label: "舞台",
    english: "STAGE",
    tone: "blue"
  },
  behind: {
    label: "幕后",
    english: "BEHIND",
    tone: "deep"
  }
};

function categoryFromPath(path: string): MomentCategory | null {
  if (path.includes("/daily/")) return "daily";
  if (path.includes("/stage/")) return "stage";
  if (path.includes("/behind/")) return "behind";
  return null;
}

const categoryRank = new Map(MOMENT_CATEGORY_ORDER.map((category, index) => [category, index]));

export const moments: Moment[] = Object.entries(PHOTO_MODULES)
  .flatMap(([path, src]) => {
    const category = categoryFromPath(path);
    return category ? [{ path, src, category }] : [];
  })
  .sort((a, b) => {
    const categoryDifference = (categoryRank.get(a.category) ?? 0) - (categoryRank.get(b.category) ?? 0);
    return categoryDifference || a.path.localeCompare(b.path, undefined, { numeric: true });
  })
  .map(({ path, src, category }, index) => {
    const meta = MOMENT_CATEGORY_META[category];
    const number = String(index + 1).padStart(3, "0");

    return {
      id: path.split("/").slice(-2).join("-"),
      number,
      category,
      image: {
        src,
        alt: `WONI × MINAMI ${meta.label}双人照片`,
        fallbackLabel: `${meta.english} PHOTO ${number}`,
        tone: meta.tone,
        position: "center"
      },
      alt: `WONI × MINAMI ${meta.label}双人照片`
    };
  });

export function isMomentCategory(value: string | undefined): value is MomentCategory {
  return value === "daily" || value === "stage" || value === "behind";
}

export function getMomentsByCategory(category: MomentCategory) {
  return moments.filter((moment) => moment.category === category);
}


