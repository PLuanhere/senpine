import { SiteFooter, SiteHeader } from "@/components/site-shell";

export default function InteriorLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}
