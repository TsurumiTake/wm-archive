import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent
} from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Moment } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";

interface InfinitePhotoGalleryProps {
  items: Moment[];
}

const INITIAL_CYCLES = 3;
const MAX_CYCLES = 15;
const VERTICAL_STEP = 420;

const PHOTO_PATTERNS = [
  { offset: 0, aspectRatio: "4 / 5", speed: 0.44, xSpeed: -0.16, rotation: -1.1 },
  { offset: 160, aspectRatio: "3 / 4", speed: -0.34, xSpeed: 0.19, rotation: 1.4 },
  { offset: 72, aspectRatio: "16 / 10", speed: 0.58, xSpeed: 0.12, rotation: 0.7 },
  { offset: 230, aspectRatio: "5 / 4", speed: -0.48, xSpeed: -0.2, rotation: -1.6 },
  { offset: 26, aspectRatio: "1 / 1", speed: 0.38, xSpeed: 0.17, rotation: 1.1 },
  { offset: 184, aspectRatio: "4 / 5", speed: -0.54, xSpeed: -0.23, rotation: -0.6 }
] as const;

export function InfinitePhotoGallery({ items }: InfinitePhotoGalleryProps) {
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<HTMLElement, number>());
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const galleryItems = useMemo(() => {
    const result: Array<{ key: string; moment: Moment; patternIndex: number; sequenceIndex: number }> = [];
    for (let cycle = 0; cycle < cycles; cycle += 1) {
      items.forEach((moment, itemIndex) => {
        const sequenceIndex = result.length;
        result.push({
          key: `${cycle}-${moment.id}`,
          moment,
          patternIndex: (itemIndex + cycle) % PHOTO_PATTERNS.length,
          sequenceIndex
        });
      });
    }
    return result;
  }, [cycles, items]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setCycles((current) => current >= MAX_CYCLES ? current : Math.min(current + 2, MAX_CYCLES));
      },
      { rootMargin: "1100px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = Array.from(itemRefs.current.keys());
    if (!elements.length) return;

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => revealObserver.observe(element));

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;

      itemRefs.current.forEach((speed, element) => {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = (center - viewportHeight / 2) / viewportHeight;
        const parallax = element.querySelector<HTMLElement>(".infinite-gallery__parallax");
        const xSpeed = Number(element.dataset.xSpeed ?? 0);
        if (parallax) {
          parallax.style.transform = `translate3d(${progress * xSpeed * 110}px, ${progress * speed * 280}px, 0)`;
        }
      });

      const section = galleryRef.current?.closest<HTMLElement>(".moments-section");
      const atmosphere = section?.querySelector<HTMLElement>(".moment-category-atmosphere");
      const foreground = section?.querySelector<HTMLElement>(".moment-category-foreground");
      if (atmosphere) atmosphere.style.setProperty("--atmosphere-y", `${window.scrollY * -0.055}px`);
      if (foreground) foreground.style.setProperty("--foreground-y", `${window.scrollY * 0.15}px`);

      section?.querySelectorAll<HTMLElement>(".moment-category-rain__layer").forEach((layer) => {
        const speed = Number(layer.dataset.speed ?? 0);
        layer.style.setProperty("--rain-scroll-y", `${window.scrollY * speed}px`);
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      revealObserver.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [galleryItems.length, reducedMotion]);

  if (!items.length) return null;

  const openMoment = (event: ReactMouseEvent<HTMLAnchorElement>, moment: Moment) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();

    const transitionName = `moment-photo-${moment.number}`;
    const frame = event.currentTarget.querySelector<HTMLElement>(".infinite-gallery__frame");
    if (frame) frame.style.viewTransitionName = transitionName;

    const goToDetail = () => navigate(`/moments/${moment.id}`);
    const startViewTransition = (document as Document & {
      startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> };
    }).startViewTransition;

    if (!reducedMotion && startViewTransition) {
      const transition = startViewTransition.call(document, goToDetail);
      transition.finished.finally(() => {
        if (frame) frame.style.viewTransitionName = "";
      });
    } else {
      goToDetail();
    }
  };

  return (
    <div
      className="infinite-photo-gallery"
      ref={galleryRef}
      style={{ height: `${galleryItems.length * VERTICAL_STEP + 520}px` }}
      aria-label="散落式照片画廊"
    >
      {galleryItems.map(({ key, moment, patternIndex, sequenceIndex }) => {
        const pattern = PHOTO_PATTERNS[patternIndex];
        return (
          <div
            className={`infinite-gallery__item infinite-gallery__item--${patternIndex}`}
            key={key}
            ref={(element) => {
              if (!element) return;
              element.dataset.speed = String(pattern.speed);
              element.dataset.xSpeed = String(pattern.xSpeed);
              itemRefs.current.set(element, pattern.speed);
              return () => { itemRefs.current.delete(element); };
            }}
            style={{
              "--item-top": `${sequenceIndex * VERTICAL_STEP + pattern.offset}px`,
              "--item-rotation": `${pattern.rotation}deg`
            } as CSSProperties}
          >
            <Link
              className="infinite-gallery__link"
              to={`/moments/${moment.id}`}
              onClick={(event) => openMoment(event, moment)}
              aria-label="打开这张照片"
            >
              <span className="infinite-gallery__parallax">
                <span className="infinite-gallery__frame">
                  <AssetImage image={moment.image} aspectRatio={pattern.aspectRatio} eager={sequenceIndex < 3} />
                </span>
              </span>
            </Link>
          </div>
        );
      })}
      <div className="infinite-gallery__sentinel" ref={sentinelRef} aria-hidden="true" />
    </div>
  );
}