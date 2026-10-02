import type { DuoVideo } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { LanguageText } from "../ui/LanguageText";

export function VideoCard({ video }: { video: DuoVideo }) {
  return (
    <article className="video-card">
      <a href={video.url} target="_blank" rel="noreferrer">
        <AssetImage image={video.thumbnail} aspectRatio="16 / 9" hover />
        <div className="video-card__body">
          <span className="english"><LanguageText text={video.platform} /></span>
          <h3><LanguageText text={video.title} /></h3>
          <p><LanguageText text={video.description} /></p>
          <span className="text-link">打开视频 <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  );
}
