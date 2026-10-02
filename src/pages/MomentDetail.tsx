import { useEffect, useRef, type CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AssetImage } from "../components/AssetImage/AssetImage";
import { LanguageText } from "../components/ui/LanguageText";
import {
  MOMENT_CATEGORY_META,
  getMomentsByCategory,
  isMomentCategory,
  moments
} from "../data/moments";
import { usePageMeta } from "../hooks/usePageMeta";
import { NotFound } from "./NotFound";

export function MomentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const moment = moments.find((item) => item.id === id);
  const category = moment && isMomentCategory(moment.category) ? moment.category : null;
  const meta = category ? MOMENT_CATEGORY_META[category] : null;
  const categoryMoments = category ? getMomentsByCategory(category) : [];
  const activeIndex = moment ? categoryMoments.findIndex((item) => item.id === moment.id) : -1;
  const previous = activeIndex > 0 ? categoryMoments[activeIndex - 1] : null;
  const next = activeIndex >= 0 && activeIndex < categoryMoments.length - 1 ? categoryMoments[activeIndex + 1] : null;

  usePageMeta(meta ? `${meta.label}照片｜花与爱丽丝` : "没有找到这一页｜花与爱丽丝");

  useEffect(() => {
    if (!moment) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && previous) navigate(`/moments/${previous.id}`);
      if (event.key === "ArrowRight" && next) navigate(`/moments/${next.id}`);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moment, navigate, next, previous]);

  if (!moment || !meta || !category) return <NotFound />;

  const moveTo = (targetId: string | undefined) => {
    if (targetId) navigate(`/moments/${targetId}`);
  };

  return (
    <div className="page page--photo-detail">
      <header className="photo-detail__header shell">
        <Link className="photo-detail__back" to={`/moments/category/${category}`}>
          <span aria-hidden="true">←</span> 返回{meta.label}
        </Link>
        <span className="photo-detail__meta"><LanguageText text={`PHOTO ${moment.number} / ${String(moments.length).padStart(3, "0")}`} /></span>
      </header>

      <main
        className="photo-detail__stage shell"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (touchStartX.current === null || endX === undefined) return;
          const distance = endX - touchStartX.current;
          if (Math.abs(distance) > 52) moveTo(distance > 0 ? previous?.id : next?.id);
          touchStartX.current = null;
        }}
      >
        <button
          className="photo-detail__nav photo-detail__nav--previous"
          type="button"
          onClick={() => moveTo(previous?.id)}
          disabled={!previous}
          aria-label="上一张照片"
        >
          ←
        </button>

        <figure
          className="photo-detail__figure"
          style={{ viewTransitionName: `moment-photo-${moment.number}` } as CSSProperties}
        >
          <AssetImage image={moment.image} aspectRatio="16 / 10" objectFit="contain" eager />
        </figure>

        <button
          className="photo-detail__nav photo-detail__nav--next"
          type="button"
          onClick={() => moveTo(next?.id)}
          disabled={!next}
          aria-label="下一张照片"
        >
          →
        </button>
      </main>
    </div>
  );
}