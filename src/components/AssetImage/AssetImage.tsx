import { useEffect, useState, type CSSProperties } from "react";
import type { ImageAsset } from "../../types/content";

interface AssetImageProps {
  image: ImageAsset;
  className?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  eager?: boolean;
  hover?: boolean;
  showFallbackText?: boolean;
}

export function AssetImage({
  image,
  className = "",
  aspectRatio = "4 / 3",
  objectFit = "cover",
  eager = false,
  hover = false,
  showFallbackText = true
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image.src]);

  return (
    <div
      className={`asset-image asset-image--${image.tone} ${hover ? "asset-image--hover" : ""} ${className}`.trim()}
      style={
        {
          "--asset-ratio": aspectRatio,
          "--asset-position": image.position ?? "center"
        } as CSSProperties
      }
    >
      <div className="asset-image__fallback" aria-hidden="true">
        {showFallbackText && (
          <>
            <span className="asset-image__fallback-mark">W×M</span>
            <span className="asset-image__fallback-label">{image.fallbackLabel}</span>
          </>
        )}
      </div>
      {!failed && (
        <img
          className="asset-image__img"
          src={image.src}
          alt={image.alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          style={{ objectFit }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
