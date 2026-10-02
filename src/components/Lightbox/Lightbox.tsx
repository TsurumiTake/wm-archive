import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { moments } from "../../data/moments";
import { AssetImage } from "../AssetImage/AssetImage";
import { LanguageText } from "../ui/LanguageText";

interface LightboxContextValue {
  openLightbox: (momentId: string) => void;
  closeLightbox: () => void;
  isOpen: boolean;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const openLightbox = useCallback((momentId: string) => {
    const index = moments.findIndex((moment) => moment.id === momentId);
    setActiveIndex(index >= 0 ? index : 0);
  }, []);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => (current === null ? null : (current - 1 + moments.length) % moments.length));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? null : (current + 1) % moments.length));
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, goNext, goPrevious]);

  const value = useMemo(() => ({ openLightbox, closeLightbox, isOpen: activeIndex !== null }), [activeIndex, closeLightbox, openLightbox]);
  const activeMoment = activeIndex === null ? null : moments[activeIndex];

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {activeMoment && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="查看双人照片"
          onClick={closeLightbox}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const endX = event.changedTouches[0]?.clientX;
            if (touchStartX.current === null || endX === undefined) return;
            const distance = endX - touchStartX.current;
            if (Math.abs(distance) > 52) {
              if (distance > 0) goPrevious();
              else goNext();
            }
            touchStartX.current = null;
          }}
        >
          <div className="lightbox__topbar">
            <span className="english">W×M PHOTO ARCHIVE</span>
            <button ref={closeButtonRef} type="button" onClick={closeLightbox} aria-label="关闭图片预览">×</button>
          </div>
          <button className="lightbox__nav lightbox__nav--prev" type="button" onClick={(event) => { event.stopPropagation(); goPrevious(); }} aria-label="上一张图片">←</button>
          <div className="lightbox__stage" onClick={(event) => event.stopPropagation()}>
            <AssetImage image={activeMoment.image} aspectRatio="16 / 10" objectFit="contain" eager />
          </div>
          <button className="lightbox__nav lightbox__nav--next" type="button" onClick={(event) => { event.stopPropagation(); goNext(); }} aria-label="下一张图片">→</button>
          <div className="lightbox__caption" onClick={(event) => event.stopPropagation()}>
            <div>
              <LanguageText text={`PHOTO ${activeMoment.number}`} />
            </div>
            <p><LanguageText text={activeMoment.alt} /></p>
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) throw new Error("useLightbox must be used inside LightboxProvider");
  return context;
}
