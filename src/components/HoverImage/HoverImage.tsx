import type { ReactNode } from "react";

export function HoverImage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`hover-image ${className}`.trim()}>{children}</div>;
}
