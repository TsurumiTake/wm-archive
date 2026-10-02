import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent
} from "react";
import type { Moment } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { LanguageText } from "../ui/LanguageText";

interface DuoPhotoSliderProps {
  items: Moment[];
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  axis: "x" | "y" | null;
}

export function DuoPhotoSlider({ items }: DuoPhotoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    pointerId: -1,
    startX: 0,
    startY: 0,
    offsetX: 0,
    axis: null
  });

  const setTrackPosition = useCallback((offsetX = 0, animate = true) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const width = viewport.getBoundingClientRect().width;
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translate3d(${-activeIndex * width + offsetX}px, 0, 0)`;

    if (!animate) {
      window.requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    setTrackPosition(0, false);
    const onResize = () => setTrackPosition(0, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setTrackPosition]);

  if (!items.length) return null;

  const moveTo = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, items.length - 1)));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
      viewportRef.current.releasePointerCapture(event.pointerId);
    }

    const width = viewportRef.current?.getBoundingClientRect().width ?? 1;
    const threshold = Math.min(90, width * 0.12);
    const shouldMove = drag.axis === "x" && Math.abs(drag.offsetX) > threshold;

    if (shouldMove) {
      const next = Math.max(0, Math.min(activeIndex + (drag.offsetX < 0 ? 1 : -1), items.length - 1));
      if (next === activeIndex) {
        setTrackPosition(0);
      } else {
        setActiveIndex(next);
      }
    } else {
      setTrackPosition(0);
    }

    dragRef.current = {
      pointerId: -1,
      startX: 0,
      startY: 0,
      offsetX: 0,
      axis: null
    };
    setIsDragging(false);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(activeIndex + 1);
    }
  };

  const activeItem = items[activeIndex] ?? items[0];

  return (
    <div className="duo-photo-slider">
      <div
        className={`duo-photo-slider__viewport ${isDragging ? "is-dragging" : ""}`}
        ref={viewportRef}
        role="region"
        aria-label="WONI 与 MINAMI 双人照片，可拖拽或滑动浏览"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            offsetX: 0,
            axis: null
          };
          setIsDragging(true);
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (drag.pointerId !== event.pointerId) return;

          const deltaX = event.clientX - drag.startX;
          const deltaY = event.clientY - drag.startY;

          if (!drag.axis) {
            if (Math.hypot(deltaX, deltaY) < 6) return;
            drag.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
          }

          if (drag.axis !== "x") return;
          event.preventDefault();

          const atStart = activeIndex === 0 && deltaX > 0;
          const atEnd = activeIndex === items.length - 1 && deltaX < 0;
          drag.offsetX = atStart || atEnd ? deltaX * 0.35 : deltaX;
          setTrackPosition(drag.offsetX, false);
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="duo-photo-slider__track" ref={trackRef}>
          {items.map((item, index) => (
            <figure
              className={`duo-photo-slider__slide ${index === activeIndex ? "is-active" : ""}`}
              key={item.id}
              aria-hidden={index !== activeIndex}
            >
              <AssetImage image={item.image} aspectRatio="16 / 10" eager={index === 0} />
              <figcaption>
                <span className="english"><LanguageText text={`PHOTO ${item.number} / ${String(items.length).padStart(3, "0")}`} /></span>
                <strong>WONI × MINAMI</strong>
              </figcaption>
            </figure>
          ))}
        </div>
        <span className="duo-photo-slider__hint">拖拽 / 滑动浏览</span>
      </div>

      <div className="duo-photo-slider__footer" aria-live="polite">
        <p><LanguageText text={activeItem.alt} /></p>
        <span><LanguageText text={`${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`} /></span>
      </div>
    </div>
  );
}