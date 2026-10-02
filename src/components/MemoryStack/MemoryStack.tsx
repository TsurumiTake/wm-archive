import { useState, type CSSProperties } from "react";
import { moments } from "../../data/moments";
import { AssetImage } from "../AssetImage/AssetImage";
import { useLightbox } from "../Lightbox/Lightbox";
import { LanguageText } from "../ui/LanguageText";

const stackMoments = moments.slice(0, 5);

export function MemoryStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { openLightbox } = useLightbox();
  const active = stackMoments[activeIndex];

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % stackMoments.length);
  };

  return (
    <section className="memory-stack-section">
      <div className="shell memory-stack">
        <div className="memory-stack__copy">
          <p className="eyebrow">MEMORY STACK · 照片堆</p>
          <h2>翻开这一叠照片。</h2>
          <p>每一张都像被随手放在桌边。点一下，看看下面压着哪一页。</p>
          <div className="memory-stack__meta">
            <span><LanguageText text={`PHOTO ${active.number}`} /></span>
          </div>
          <div className="memory-stack__actions">
            <button className="button button--outline" type="button" onClick={showNext}>
              翻开下一张 <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div className="memory-stack__photos" aria-label="照片堆">
          {stackMoments.map((moment, index) => {
            const offset = (index - activeIndex + stackMoments.length) % stackMoments.length;
            const stackOffset = Math.min(offset, 3);
            return (
              <button
                key={moment.id}
                className={`memory-stack__card ${offset === 0 ? "is-active" : ""}`}
                type="button"
                style={{
                  "--stack-top": `${stackOffset * 12}px`,
                  "--stack-left": `${stackOffset * 20}px`,
                  "--stack-z": 10 - stackOffset,
                  "--stack-opacity": 1 - stackOffset * 0.15,
                  "--stack-rotate": `${(index - 2) * 1.3}deg`
                } as CSSProperties}
                onClick={() => {
                  if (offset === 0) openLightbox(moment.id);
                  else setActiveIndex(index);
                }}
                aria-label={offset === 0 ? "放大查看双人照片" : "翻到下一张双人照片"}
              >
                <AssetImage image={moment.image} aspectRatio="4 / 5" />
                <span><LanguageText text={`PHOTO ${moment.number}`} /></span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
