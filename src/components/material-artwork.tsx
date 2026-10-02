import Image from "next/image";

export function MaterialArtwork({ index, className = "" }: { index: number; className?: string }) {
  return <div className={`material-artwork ${className}`}><Image src="/images/materials.webp" alt={["Minh họa vải lá dứa", "Minh họa vải pha lá dứa và tơ sen", "Minh họa vải tơ sen"][index]} width={1536} height={1024} sizes="(max-width: 700px) 270vw, 100vw" style={{ left: `${-index * 100}%` }} /></div>;
}
