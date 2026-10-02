import Image from "next/image";
import { materialImages } from "@/lib/imagery";

export function MaterialArtwork({ index, className = "" }: { index: number; className?: string }) {
  const image = materialImages[index];
  return <div className={`material-artwork ${className}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 88vw, (max-width: 1200px) 45vw, 640px" /></div>;
}
