import Image from "next/image";
import { assets, type AssetKey } from "@/config/assets";
export function Media({
  name,
  className = "",
  priority = false,
  sizes = "(max-width: 760px) 100vw, 60vw",
}: {
  name: AssetKey;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const asset = assets[name];
  if (!asset)
    return (
      <div className={`media-fallback ${className}`}>
        <span>RADIAN</span>
        <p>Project imagery will be available soon.</p>
      </div>
    );
  return (
    <div className={`media ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
export function Impression({ className = "" }: { className?: string }) {
  return (
    <p className={`impression ${className}`}>
      Artist&apos;s impression. Final finishes and layouts may vary.
    </p>
  );
}
