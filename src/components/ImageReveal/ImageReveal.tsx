import type { ReactNode } from "react";
import { Reveal } from "../Reveal/Reveal";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ImageReveal({ children, className = "", delay = 0 }: ImageRevealProps) {
  return (
    <Reveal className={`image-reveal ${className}`.trim()} delay={delay}>
      <div className="image-reveal__inner">{children}</div>
    </Reveal>
  );
}
