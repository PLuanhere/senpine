import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { DocumentImage } from "@/lib/imagery";

export function DocumentFigure({ image, caption }: { image: DocumentImage; caption: string }) {
  return (
    <figure className="document-figure">
      <a className="document-figure-image" href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Xem ảnh đầy đủ: ${caption}`}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 900px) 88vw, 1280px" />
      </a>
      <figcaption>
        <span>{caption}<small>Hình tham khảo trong đề án SenPine</small></span>
        <a className="text-link" href={image.src} target="_blank" rel="noopener noreferrer">Xem ảnh đầy đủ <ArrowUpRight size={17} /></a>
      </figcaption>
    </figure>
  );
}
