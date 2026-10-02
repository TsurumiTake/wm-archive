import type { ReactNode } from "react";
import { Reveal } from "../Reveal/Reveal";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  return (
    <Reveal className={`fade-in ${className}`.trim()} delay={delay}>
      {children}
    </Reveal>
  );
}
