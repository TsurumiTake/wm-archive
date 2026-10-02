import { useState } from "react";
import { MomentFolderGrid } from "../components/MomentFolderStack/MomentFolderGrid";
import { VideoCard } from "../components/VideoCard/VideoCard";
import { LanguageText } from "../components/ui/LanguageText";
import { duoVideos } from "../data/videos";
import { usePageMeta } from "../hooks/usePageMeta";

type OccurrenceView = "moments" | "clips";

export function Moments() {
  const [view, setView] = useState<OccurrenceView>("moments");

  usePageMeta("发生｜花与爱丽丝", "浏览 WONI × MINAMI 的双人瞬间与影像片段。");

  return (
    <div className="page page--moments">
      <header className="page-hero page-hero--moments">
        <div className="shell page-hero__inner">
          <p className="eyebrow english">OCCURRENCES</p>
          <h1>发生</h1>
          <p className="page-hero__lead">
            <LanguageText text="一些被镜头留下的瞬间，以及可以继续打开观看的影像片段。" />
          </p>
        </div>
      </header>

      <section className="section section--paper moments-section">
        <div className="shell">
          <div className="archive-tabs occurrence-tabs" role="tablist" aria-label="发生分类">
            <button type="button" role="tab" aria-selected={view === "moments"} className={view === "moments" ? "is-active" : ""} onClick={() => setView("moments")}>
              <LanguageText text="瞬间" />
            </button>
            <button type="button" role="tab" aria-selected={view === "clips"} className={view === "clips" ? "is-active" : ""} onClick={() => setView("clips")}>
              <LanguageText text="片段" />
            </button>
          </div>

          {view === "moments" ? (
            <>
              <div className="section-heading-row moment-folder-heading">
                <div>
                  <p className="eyebrow english">MOMENTS</p>
                  <h2>瞬间</h2>
                </div>
                <p><LanguageText text="选一本慢慢翻，进入对应的照片记录。" /></p>
              </div>

              <MomentFolderGrid />
            </>
          ) : duoVideos.length > 0 ? (
            <div className="video-grid">
              {duoVideos.map((video) => <VideoCard key={video.id} video={video} />)}
            </div>
          ) : (
            <div className="empty-state occurrence-empty">
              <span className="english">CLIPS</span>
              <h2>还没有加入影像片段。</h2>
              <p>以后可以在这里放入双人视频封面和外部链接。</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}