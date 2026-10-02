import type { CSSProperties } from "react";
import type { Moment } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { BookmarkButton } from "../BookmarkButton/BookmarkButton";
import { HoverImage } from "../HoverImage/HoverImage";
import { LanguageText } from "../ui/LanguageText";

interface MomentCardProps {
  moment: Moment;
  index?: number;
}

export function MomentCard({ moment, index = 0 }: MomentCardProps) {

  return (
    <article className="moment-card" style={{ "--card-index": index } as CSSProperties}>
      <div className="moment-card__visual">
        <span className="moment-card__layer moment-card__layer--mint" aria-hidden="true" />
        <span className="moment-card__layer moment-card__layer--blue" aria-hidden="true" />
        <span className="moment-card__layer moment-card__layer--cream" aria-hidden="true" />
        <HoverImage className="moment-card__photo-frame">
          <AssetImage image={moment.image} aspectRatio="4 / 5" />
        </HoverImage>
        <span className="moment-card__number"><LanguageText text={`MOMENT ${moment.number}`} /></span>
        <BookmarkButton momentId={moment.id} title="双人照片" />
        
      </div>

      <div className="moment-card__body">
        <p className="moment-card__meta english">WONI × MINAMI</p>
        <h3>WONI × MINAMI</h3>
        <p>双人照片记录</p>
      </div>
    </article>
  );
}
