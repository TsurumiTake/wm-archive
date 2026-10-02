import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { MomentsAtmosphere } from "../components/effects/MomentsAtmosphere";
import { InfinitePhotoGallery } from "../components/InfinitePhotoGallery/InfinitePhotoGallery";
import { LanguageText } from "../components/ui/LanguageText";
import {
  MOMENT_CATEGORY_META,
  getMomentsByCategory,
  isMomentCategory
} from "../data/moments";
import { usePageMeta } from "../hooks/usePageMeta";
import { NotFound } from "./NotFound";

const RAIN_LAYERS = [
  { name: "far", count: 45, scrollSpeed: 0.25, minLength: 7, lengthRange: 9, baseWidth: 0.72, opacityBase: 0.12, opacityRange: 0.1 },
  { name: "mid", count: 45, scrollSpeed: 0.55, minLength: 10, lengthRange: 12, baseWidth: 1.15, opacityBase: 0.22, opacityRange: 0.14 },
  { name: "near", count: 30, scrollSpeed: 0.9, minLength: 14, lengthRange: 15, baseWidth: 1.75, opacityBase: 0.38, opacityRange: 0.16 }
] as const;

export function MomentCategoryPage() {
  const { category } = useParams();
  const validCategory = isMomentCategory(category) ? category : null;
  const meta = validCategory ? MOMENT_CATEGORY_META[validCategory] : null;
  const categoryMoments = validCategory ? getMomentsByCategory(validCategory) : [];

  usePageMeta(meta ? `${meta.label}｜瞬间｜花与爱丽丝` : "没有找到这一页｜花与爱丽丝");

  if (!meta || !validCategory) return <NotFound />;

  return (
    <div className="page page--moment-category">
      <header className="page-hero page-hero--moments moment-category-hero">
        <div className="shell page-hero__inner">
          <Link className="text-link moment-category__back" to="/moments">
            <span aria-hidden="true">←</span> 返回瞬间
          </Link>
          <p className="eyebrow english"><LanguageText text={`MOMENTS · ${meta.english}`} /></p>
          <h1>{meta.label}</h1>
        </div>
      </header>

      <section className="section section--paper moments-section">
        <MomentsAtmosphere opacity={0.65} />
        <div className="moment-category-atmosphere" aria-hidden="true">
          <span className="moment-category-atmosphere__glow moment-category-atmosphere__glow--blue" />
          <span className="moment-category-atmosphere__glow moment-category-atmosphere__glow--mint" />
          <span className="moment-category-atmosphere__glow moment-category-atmosphere__glow--warm" />
          <span className="moment-category-atmosphere__veil" />
        </div>
        <div className="moment-category-rain" aria-hidden="true">
          {RAIN_LAYERS.map((layer, layerIndex) => (
            <div
              className={`moment-category-rain__layer moment-category-rain__layer--${layer.name}`}
              data-speed={layer.scrollSpeed}
              key={layer.name}
            >
              {Array.from({ length: layer.count }, (_, index) => {
                const left = (index * 37 + layerIndex * 13 + 7) % 101;
                const top = (index * 53 + layerIndex * 17 + 3) % 100;
                const length = layer.minLength + ((index * 7 + layerIndex * 5) % layer.lengthRange);
                const width = layer.baseWidth + (index % 4) * 0.25;
                const opacity = layer.opacityBase + ((index * 11 + layerIndex * 3) % 10) / 10 * layer.opacityRange;
                const rotation = -4 + ((index * 11 + layerIndex * 3) % 9);
                const color = layer.name === "far"
                  ? "rgba(255, 255, 255, 0.9)"
                  : layer.name === "mid"
                    ? "rgba(139, 175, 192, 0.72)"
                    : "rgba(43, 153, 196, 0.58)";

                return (
                  <span
                    className="moment-category-rain__line"
                    key={`${layer.name}-${index}`}
                    style={{
                      "--rain-left": `${left}%`,
                      "--rain-top": `${top}%`,
                      "--rain-length": `${length}vh`,
                      "--rain-width": `${width}px`,
                      "--rain-opacity": `${opacity}`,
                      "--rain-rotate": `${rotation}deg`,
                      "--rain-color": color
                    } as CSSProperties}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="moment-category-foreground" aria-hidden="true">
          <span className="moment-category-foreground__line moment-category-foreground__line--one" />
          <span className="moment-category-foreground__line moment-category-foreground__line--two" />
          <span className="moment-category-foreground__soft" />
        </div>
        <div className="shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow english">PHOTO ALBUM</p>
              <h2>照片记录</h2>
            </div>
            <p className="moment-category__count">
              <LanguageText text={`共 ${String(categoryMoments.length).padStart(2, "0")} 张`} />
            </p>
          </div>

          <InfinitePhotoGallery items={categoryMoments} />
        </div>
      </section>
    </div>
  );
}