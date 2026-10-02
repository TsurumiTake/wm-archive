import {
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { Moment } from "../../types/content";
import { AssetImage } from "../AssetImage/AssetImage";
import { useLightbox } from "../Lightbox/Lightbox";
import { LanguageText } from "./LanguageText";

const ORIGINAL_SIZE = { width: 1522, height: 1238 };
const FRAME_HEIGHT = 12;
const LAYOUT = [
  { x: 71, y: 58, w: 400, h: 270 },
  { x: 211, y: 255, w: 540, h: 360 },
  { x: 631, y: 158, w: 400, h: 270 },
  { x: 1191, y: 245, w: 260, h: 195 },
  { x: 351, y: 687, w: 260, h: 290 },
  { x: 751, y: 824, w: 205, h: 154 },
  { x: 911, y: 540, w: 260, h: 350 },
  { x: 1051, y: 803, w: 400, h: 300 },
  { x: 71, y: 922, w: 350, h: 260 },
  { x: 550, y: 470, w: 280, h: 210 },
  { x: 1210, y: 635, w: 220, h: 300 },
  { x: 1085, y: 78, w: 250, h: 330 },
  { x: 540, y: 1020, w: 400, h: 200 }
];

interface GridItem {
  key: string;
  moment: Moment;
  base: (typeof LAYOUT)[number];
  copyX: number;
  copyY: number;
  primary: boolean;
}

interface RuntimeItem extends GridItem {
  element: HTMLDivElement;
  x: number;
  y: number;
  width: number;
  height: number;
  extraX: number;
  extraY: number;
  ease: number;
}

export function InfiniteMomentsGrid({ moments }: { moments: Moment[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeItems = useRef(new Map<string, RuntimeItem>());
  const controlsRef = useRef<{ moveBy: (x: number, y: number) => void; reset: () => void } | null>(null);
  const dragMoved = useRef(false);
  const { openLightbox } = useLightbox();

  const items = useMemo<GridItem[]>(() => {
    if (!moments.length) return [];
    return LAYOUT.map((base, baseIndex) =>
      [0, 1].flatMap((copyX) =>
        [0, 1].map((copyY) => ({
          key: `${baseIndex}-${copyX}-${copyY}`,
          moment: moments[baseIndex % moments.length],
          base,
          copyX,
          copyY,
          primary: copyX === 0 && copyY === 0
        }))
      )
    ).flat();
  }, [moments]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = {
      width: container.clientWidth,
      height: container.clientHeight,
      tileWidth: container.clientWidth,
      tileHeight: container.clientHeight,
      currentX: -container.clientWidth * 0.1,
      currentY: -container.clientHeight * 0.1,
      targetX: -container.clientWidth * 0.1,
      targetY: -container.clientHeight * 0.1,
      lastX: -container.clientWidth * 0.1,
      lastY: -container.clientHeight * 0.1,
      dragX: 0,
      dragY: 0,
      dragStartX: 0,
      dragStartY: 0,
      pointerX: 0.5,
      pointerY: 0.5,
      pointerCurrentX: 0.5,
      pointerCurrentY: 0.5,
      press: 0,
      pressTarget: 0,
      dragging: false,
      pointerId: -1
    };

    controlsRef.current = {
      moveBy: (x, y) => {
        state.targetX += x;
        state.targetY += y;
      },
      reset: () => {
        state.currentX = state.targetX = state.lastX = -state.width * 0.1;
        state.currentY = state.targetY = state.lastY = -state.height * 0.1;
        runtimeItems.current.forEach((item) => {
          item.extraX = 0;
          item.extraY = 0;
        });
      }
    };

    let frame = 0;

    const resize = () => {
      state.width = container.clientWidth;
      state.height = container.clientHeight;
      const tileWidth = state.width < 700 ? 760 : state.width;
      state.tileWidth = tileWidth;
      state.tileHeight = Math.max(state.height, tileWidth * (ORIGINAL_SIZE.height / ORIGINAL_SIZE.width));
      const scaleX = state.tileWidth / ORIGINAL_SIZE.width;
      const scaleY = state.tileHeight / ORIGINAL_SIZE.height;

      runtimeItems.current.forEach((item) => {
        item.width = item.base.w * scaleX;
        item.height = item.base.h * scaleY;
        item.x = item.base.x * scaleX + item.copyX * state.tileWidth;
        item.y = item.base.y * scaleY + item.copyY * state.tileHeight;
        item.element.style.width = `${item.width}px`;
        item.element.style.height = `${item.height + FRAME_HEIGHT}px`;
      });

      state.currentX = state.targetX = state.lastX = -state.width * 0.1;
      state.currentY = state.targetY = state.lastY = -state.height * 0.1;
    };

    const render = () => {
      const ease = reducedMotion ? 1 : 0.065;
      state.currentX += (state.targetX - state.currentX) * ease;
      state.currentY += (state.targetY - state.currentY) * ease;
      state.pointerCurrentX += (state.pointerX - state.pointerCurrentX) * (reducedMotion ? 1 : 0.045);
      state.pointerCurrentY += (state.pointerY - state.pointerCurrentY) * (reducedMotion ? 1 : 0.045);
      state.press += (state.pressTarget - state.press) * (reducedMotion ? 1 : 0.06);

      const deltaX = state.currentX - state.lastX;
      const deltaY = state.currentY - state.lastY;
      const directionX = deltaX >= 0 ? "right" : "left";
      const directionY = deltaY >= 0 ? "down" : "up";

      runtimeItems.current.forEach((item) => {
        const parallaxX = reducedMotion ? 0 : (state.pointerCurrentX - 0.5) * item.width * 0.5;
        const parallaxY = reducedMotion ? 0 : (state.pointerCurrentY - 0.5) * item.height * 0.5;
        const motionX = reducedMotion ? 0 : deltaX * 3.6 * item.ease;
        const motionY = reducedMotion ? 0 : deltaY * 3.6 * item.ease;
        let positionX = item.x + state.currentX + item.extraX + parallaxX + motionX;
        let positionY = item.y + state.currentY + item.extraY + parallaxY + motionY;

        if (directionX === "right" && positionX > state.width) item.extraX -= state.tileWidth * 2;
        if (directionX === "left" && positionX + item.width < 0) item.extraX += state.tileWidth * 2;
        if (directionY === "down" && positionY > state.height) item.extraY -= state.tileHeight * 2;
        if (directionY === "up" && positionY + item.height + FRAME_HEIGHT < 0) item.extraY += state.tileHeight * 2;

        positionX = item.x + state.currentX + item.extraX + parallaxX + motionX;
        positionY = item.y + state.currentY + item.extraY + parallaxY + motionY;
        item.element.style.transform = `translate3d(${positionX}px, ${positionY}px, 0)`;
        item.element.style.setProperty("--grid-press", `${state.press}`);
      });

      state.lastX = state.currentX;
      state.lastY = state.currentY;
      frame = window.requestAnimationFrame(render);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = reducedMotion ? 0.15 : 0.38;
      state.targetX -= event.deltaX * factor;
      state.targetY -= event.deltaY * factor;
    };

    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as Element).closest("button, a")) {
        dragMoved.current = false;
        return;
      }
      if (event.button !== 0 && event.pointerType === "mouse") return;
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.dragX = state.targetX;
      state.dragY = state.targetY;
      state.dragStartX = event.clientX;
      state.dragStartY = event.clientY;
      dragMoved.current = false;
      state.pressTarget = 1;
      container.setPointerCapture(event.pointerId);
      container.classList.add("is-dragging");
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      state.pointerX = (event.clientX - rect.left) / rect.width;
      state.pointerY = (event.clientY - rect.top) / rect.height;
      if (!state.dragging) return;
      const deltaX = event.clientX - state.dragStartX;
      const deltaY = event.clientY - state.dragStartY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 6) dragMoved.current = true;
      state.targetX = state.dragX + deltaX;
      state.targetY = state.dragY + deltaY;
    };

    const onPointerUp = () => {
      state.dragging = false;
      state.pressTarget = 0;
      if (state.pointerId >= 0 && container.hasPointerCapture(state.pointerId)) {
        container.releasePointerCapture(state.pointerId);
      }
      container.classList.remove("is-dragging");
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    resize();
    window.requestAnimationFrame(() => container.classList.add("is-ready"));
    frame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      controlsRef.current = null;
      window.cancelAnimationFrame(frame);
    };
  }, [items]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = 80;
    if (event.key === "ArrowLeft") controlsRef.current?.moveBy(step, 0);
    else if (event.key === "ArrowRight") controlsRef.current?.moveBy(-step, 0);
    else if (event.key === "ArrowUp") controlsRef.current?.moveBy(0, step);
    else if (event.key === "ArrowDown") controlsRef.current?.moveBy(0, -step);
    else return;
    event.preventDefault();
  };

  if (!items.length) return null;

  return (
    <section className="infinite-moments-section" aria-label="无限照片网格">
      <div className="infinite-moments__toolbar shell">
        <div>
          <p className="eyebrow"><LanguageText text="INFINITE LAYERS · 无限照片档案" /></p>
          <h2>一层一层地翻阅。</h2>
        </div>
        <div className="infinite-moments__actions">
          <span>拖拽 / 滚轮 / 滑动 / 方向键</span>
          <button type="button" onClick={() => controlsRef.current?.reset()}>回到中间</button>
        </div>
      </div>

      <div
        className="infinite-moments__viewport"
        ref={containerRef}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label="可拖拽的无限照片网格，使用方向键移动"
      >
        <div className="infinite-moments__space">
          {items.map((item) => (
            <div
              className="infinite-grid-item"
              key={item.key}
              ref={(element) => {
                if (!element) {
                  runtimeItems.current.delete(item.key);
                  return;
                }
                runtimeItems.current.set(item.key, {
                  ...item,
                  element,
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0,
                  extraX: 0,
                  extraY: 0,
                  ease: 0.45 + (Number(item.key.split("-")[0]) % 5) * 0.12
                });
              }}
              aria-hidden={!item.primary}
            >
              <div className="infinite-grid-item__wrapper">
                <button
                  className="infinite-grid-item__image"
                  type="button"
                  tabIndex={item.primary ? 0 : -1}
                  onClick={() => {
                    if (!dragMoved.current) openLightbox(item.moment.id);
                  }}
                  aria-label={`查看照片：${item.moment.alt}`}
                  data-cursor="view"
                >
                  <AssetImage image={item.moment.image} aspectRatio={`${item.base.w} / ${item.base.h}`} showFallbackText={false} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
