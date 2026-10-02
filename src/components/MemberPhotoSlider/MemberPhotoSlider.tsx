import { useRef, useState } from "react";
import type { ImageAsset } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { LanguageText } from "../ui/LanguageText";

interface MemberPhotoSliderProps {
  memberName: string;
  photos: ImageAsset[];
}

export function MemberPhotoSlider({ memberName, photos }: MemberPhotoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activePhoto = photos[activeIndex] ?? photos[0];

  if (!activePhoto) return null;

  const moveTo = (index: number) => {
    if (!photos.length) return;
    setActiveIndex((index + photos.length) % photos.length);
  };

  const moveBy = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + photos.length) % photos.length);
  };

  return (
    <div className="member-photo-slider" aria-label={`${memberName} 个人照片`}>
      <div
        className="member-photo-slider__stage"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (touchStartX.current === null || endX === undefined) return;
          const distance = endX - touchStartX.current;
          if (Math.abs(distance) > 48) moveBy(distance > 0 ? -1 : 1);
          touchStartX.current = null;
        }}
      >
        {photos.map((photo, index) => (
          <div
            className={`member-photo-slider__slide ${index === activeIndex ? "is-active" : ""}`}
            key={photo.src}
            aria-hidden={index !== activeIndex}
          >
            <AssetImage image={photo} aspectRatio="4 / 5" eager={index === 0} />
          </div>
        ))}
        <span className="member-photo-slider__wash" aria-hidden="true" />

        {photos.length > 1 && (
          <>
            <button
              className="member-photo-slider__arrow member-photo-slider__arrow--prev"
              type="button"
              onClick={() => moveBy(-1)}
              aria-label="查看上一张个人照片"
            >
              ←
            </button>
            <button
              className="member-photo-slider__arrow member-photo-slider__arrow--next"
              type="button"
              onClick={() => moveBy(1)}
              aria-label="查看下一张个人照片"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="member-photo-slider__footer">
        <div className="member-photo-slider__caption" aria-live="polite">
          <p><LanguageText text={activePhoto.alt} /></p>
          <span><LanguageText text={`PHOTO ${String(activeIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`} /></span>
        </div>

        {photos.length > 1 && (
          <div className="member-photo-slider__dots" role="tablist" aria-label={`选择 ${memberName} 的个人照片`}>
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`查看第 ${index + 1} 张照片`}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => moveTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}