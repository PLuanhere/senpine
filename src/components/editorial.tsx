import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { currency, materials, products } from "@/lib/content";
import { MaterialArtwork } from "@/components/material-artwork";
import { ProductArtwork } from "@/components/product-artwork";
import { MotionRibbon } from "@/components/motion-ribbon";

export function PageHero({ eyebrow, title, description, image, imageAlt, imageLayout = "split", dark = false, ribbon, action }: { eyebrow: string; title: string; description: string; image?: string; imageAlt?: string; imageLayout?: "split" | "background"; dark?: boolean; ribbon?: string; action?: { href: string; label: string } }) {
  const words = title.split(" ");
  return <><section className={`page-hero ${dark ? "page-hero-dark" : ""} ${image && imageLayout === "background" ? "page-hero-background" : ""}`}><div className="page-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{words.map((word, index) => <span key={index}><span className="motion-word"><span>{word}</span></span>{index < words.length - 1 ? " " : ""}</span>)}</h1><p className="page-hero-description">{description}</p>{action && <Link className={`button page-hero-action ${dark ? "button-light" : "button-dark"}`} href={action.href}>{action.label}<ArrowUpRight size={21} /></Link>}</div>{image && <div className="page-hero-image"><Image src={image} alt={imageAlt ?? "Ảnh minh họa SenPine"} fill sizes={imageLayout === "background" ? "(max-width: 900px) 100vw, 72vw" : "(max-width: 900px) 100vw, 48vw"} loading="eager" /></div>}</section>{ribbon && <MotionRibbon variant={ribbon} />}</>;
}

export function PageSectionHeading({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description?: string }) {
  return <div className="page-section-heading"><p className="eyebrow">{index} / {eyebrow}</p><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function MaterialCard({ index }: { index: number }) {
  const material = materials[index];
  return <Link href={`/materials/${material.id}`} className="editorial-card"><MaterialArtwork index={index} /><div className="editorial-card-top"><span>{material.origin}</span><ArrowUpRight size={23} /></div><h3>{material.name}</h3><p>{material.description}</p><span className="editorial-card-price">{currency(material.price)} / mét · dự kiến</span></Link>;
}

export function ProductCard({ id }: { id: number }) {
  const product = products[id];
  return <Link href={`/products/${product.slug}`} className="editorial-card product-card"><ProductArtwork id={id} /><div className="editorial-card-top"><span>{product.category} · {product.color}</span><ArrowUpRight size={22} /></div><h3>{product.name}</h3><p>{product.english}</p><span className="editorial-card-price">{currency(product.price)} · giá dự kiến</span></Link>;
}

export function CtaBand({ eyebrow, title, text, href, action }: { eyebrow: string; title: string; text: string; href: string; action: string }) {
  return <section className="cta-band"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{text}</p></div><Link className="button button-light" href={href}>{action}<ArrowUpRight size={21} /></Link></section>;
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="text-link" href={href}>{children}<ArrowRight size={20} /></Link>;
}
