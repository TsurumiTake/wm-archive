import { MomentFolderStack } from "../MomentFolderStack/MomentFolderStack";
import { Reveal } from "../Reveal/Reveal";
import {
  MOMENT_CATEGORY_META,
  MOMENT_CATEGORY_ORDER,
  getMomentsByCategory
} from "../../data/moments";

export function MomentFolderGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`moment-folder-grid ${className}`.trim()}>
      {MOMENT_CATEGORY_ORDER.map((category, index) => {
        const meta = MOMENT_CATEGORY_META[category];
        const categoryMoments = getMomentsByCategory(category);
        const cover = categoryMoments[0]?.image;
        if (!cover) return null;

        return (
          <Reveal key={category} delay={index * 90}>
            <MomentFolderStack
              category={category}
              title={meta.label}
              english={meta.english}
              cover={cover}
              count={categoryMoments.length}
              to={`/moments/category/${category}`}
              tilt={index === 0 ? -0.45 : index === 1 ? 0.35 : -0.2}
            />
          </Reveal>
        );
      })}
    </div>
  );
}