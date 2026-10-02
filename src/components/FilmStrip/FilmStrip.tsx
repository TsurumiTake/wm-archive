import { useRef, useState } from "react";
import type { Moment } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { useLightbox } from "../Lightbox/Lightbox";
import { LanguageText } from "../ui/LanguageText";

export function FilmStrip({ items }: { items: Moment[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const framesRef = useRef<HTMLDivElement>(null);
  const { openLightbox } = useLightbox();
  const active = items[activeIndex] ?? items[0];

  if (!active) return null;

  return (
    <section className="film-strip" aria-label="胶片条">
      <div className="film-strip__header shell">
        <div>
          <p className="eyebrow">FILM STRIP · 胶片条</p>
          <h2>沿着这一卷慢慢看。</h2>
        </div>
        <div className="film-strip__counter">
          <strong><LanguageText text={active.number} /></strong>
          <span><LanguageText text={`/ ${String(items.length).padStart(3, "0")}`} /></span>
        </div>
      </div>

      <div className="film-strip__stage shell">
        <div className="film-strip__preview">
          <button type="button" onClick={() => openLightbox(active.id)} aria-label="放大查看双人照片">
            <AssetImage image={active.image} aspectRatio="16 / 10" />
            <span><LanguageText text={`VIEW PHOTO ${active.number}`} /></span>
          </button>
          <div className="film-strip__caption">
            <strong>WONI × MINAMI</strong>
            <p><LanguageText text={`PHOTO ${active.number} / ${String(items.length).padStart(3, "0")}`} /></p>
          </div>
        </div>

        <div className="film-strip__rail">
          <button
            className="film-strip__arrow"
            type="button"
            aria-label="向左浏览胶片"
            onClick={() => framesRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
          >
            ←
          </button>
          <div className="film-strip__frames" ref={framesRef}>
            {items.map((moment, index) => (
              <button
                key={moment.id}
                className={`film-strip__frame ${index === activeIndex ? "is-active" : ""}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`选择 PHOTO ${moment.number}`}
                aria-pressed={index === activeIndex}
              >
                <AssetImage image={moment.image} aspectRatio="4 / 3" />
                <span><LanguageText text={moment.number} /></span>
              </button>
            ))}
          </div>
          <button
            className="film-strip__arrow"
            type="button"
            aria-label="向右浏览胶片"
            onClick={() => framesRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
