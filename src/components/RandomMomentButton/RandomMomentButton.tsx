import { useState } from "react";
import { moments as allMoments } from "../../data/moments";
import type { Moment } from "../../types/content";
import { LanguageText } from "../ui/LanguageText";
import { useLightbox } from "../Lightbox/Lightbox";

interface RandomMomentButtonProps {
  label?: string;
  className?: string;
  onNavigate?: () => void;
  tabIndex?: number;
  items?: Moment[];
}

export function RandomMomentButton({
  label = "随机看看",
  className = "",
  onNavigate,
  tabIndex = 0,
  items = allMoments
}: RandomMomentButtonProps) {
  const { openLightbox } = useLightbox();
  const [isChoosing, setIsChoosing] = useState(false);
  const [previewNumber, setPreviewNumber] = useState("");

  const openRandomMoment = () => {
    if (!items.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const moment = items[Math.floor(Math.random() * items.length)];
    onNavigate?.();

    if (reducedMotion) {
      openLightbox(moment.id);
      return;
    }

    const sequence = items.slice(0, 5).map((item) => item.number);
    sequence.forEach((number, index) => {
      window.setTimeout(() => setPreviewNumber(number), index * 75);
    });

    setIsChoosing(true);
    window.setTimeout(() => {
      setIsChoosing(false);
      openLightbox(moment.id);
    }, 520);
  };

  return (
    <button
      className={`random-moment-button ${isChoosing ? "is-choosing" : ""} ${className}`.trim()}
      type="button"
      tabIndex={tabIndex}
      onClick={openRandomMoment}
    >
      <span className="random-moment-button__spark" aria-hidden="true">✦</span>
      <LanguageText text={isChoosing ? `翻到 ${previewNumber}` : label} />
    </button>
  );
}