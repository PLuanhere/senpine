import Image from "next/image";
import { productImages } from "@/lib/imagery";

export function ProductArtwork({ id, className = "" }: { id: number; className?: string }) {
  const image = productImages[id];
  return <div className={`product-image ${className}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 88vw, (max-width: 1200px) 45vw, 640px" className="product-reference" /></div>;
}
