import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "view" | "link">("default");
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const canUse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canUse || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => setPosition({ x: event.clientX, y: event.clientY });
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element;
      const interactive = target.closest("button, a, input, textarea, [data-cursor]");
      if (!interactive) {
        setMode("default");
        return;
      }
      const isView = interactive.matches(".film-strip__preview button, .infinite-grid-item__image");
      setMode(isView ? "view" : "link");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={`custom-cursor custom-cursor--${mode}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      aria-hidden="true"
    >
      <span>{mode === "view" ? "VIEW" : "✦"}</span>
    </div>
  );
}
