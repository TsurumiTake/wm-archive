import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ImageAsset, MomentCategory } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { LanguageText } from "../ui/LanguageText";

interface MomentFolderStackProps {
  category: MomentCategory;
  title: string;
  english: string;
  cover: ImageAsset;
  count: number;
  to: string;
  tilt?: number;
}

export function MomentFolderStack({
  category,
  title,
  english,
  cover,
  count,
  to,
  tilt = 0
}: MomentFolderStackProps) {
  return (
    <Link
      className={`moment-folder-card moment-folder-card--${category}`}
      to={to}
      style={{ "--folder-tilt": `${tilt}deg` } as CSSProperties}
      aria-label={`进入${title}照片`}
    >
      <div className="moment-folder-card__stage">
        <span className="moment-folder-card__sheet moment-folder-card__sheet--mint" aria-hidden="true" />
        <span className="moment-folder-card__sheet moment-folder-card__sheet--blue" aria-hidden="true" />
        <span className="moment-folder-card__sheet moment-folder-card__sheet--cream" aria-hidden="true" />
        <div className="moment-folder-card__cover">
          <AssetImage image={cover} aspectRatio="4 / 5" hover />
        </div>
      </div>

      <div className="moment-folder-card__body">
        <p className="eyebrow">
          <LanguageText text={`${english} · ${String(count).padStart(2, "0")} PHOTOS`} />
        </p>
        <h3>{title}</h3>
        <span className="moment-folder-card__action">
          <LanguageText text="进入这一册" /> <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}