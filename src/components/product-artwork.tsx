import Image from "next/image";
import { products } from "@/lib/content";

export function ProductArtwork({ id, className = "" }: { id: number; className?: string }) {
  return <div className={`product-image ${className}`}><Image src="/images/collection.webp" alt={`Hình concept ${products[id].name.toLowerCase()}`} width={1536} height={1024} sizes="(max-width: 700px) 270vw, 100vw" className="product-sprite" style={{ left: `${-(id % 3) * 100}%`, top: `${-Math.floor(id / 3) * 100}%` }} /></div>;
}
