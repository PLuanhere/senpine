"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Moon,
  MoveRight,
  ScanLine,
  Search,
  Sun,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { currency, materials, navigation, navigationEn, products } from "@/lib/content";
import { JourneySection } from "@/components/journey-section";
import { useCart, useSaved } from "@/lib/store";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/i18n";
import { useMotion } from "@/lib/motion-context";
import { MotionRibbon } from "@/components/motion-ribbon";
import { ProductArtwork } from "@/components/product-artwork";
import { detailsImages, materialImages } from "@/lib/imagery";
import { MaterialQuickView } from "@/components/material-quick-view";
import { ProductQuickView } from "@/components/product-quick-view";
import { SearchDialogContent } from "@/components/search-dialog-content";
import { SavedDialogContent } from "@/components/saved-dialog-content";

type Overlay =
  | { kind: "search" }
  | { kind: "saved" }
  | { kind: "product"; id: number }
  | { kind: "material"; id: string }
  | { kind: "trace" }
  | { kind: "business"; intent: "sample" | "quote" }
  | null;

function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <span className="brand-mark" aria-hidden="true">✳</span>
      SenPine
      <span className="brand-period">.</span>
    </span>
  );
}

function ProductImage({ id, large = false }: { id: number; large?: boolean }) {
  return <ProductArtwork id={id} className={large ? "product-image-large" : ""} />;
}

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim().replace(/\s+/g, " ");
}

const heroScenes = [
  { image: detailsImages.harvest.src, vi: "TỪ VÙNG NGUYÊN LIỆU", en: "FROM THE SOURCE" },
  { image: detailsImages.drying.src, vi: "TỪNG SỢI TỰ NHIÊN", en: "NATURAL FIBERS" },
  { image: detailsImages.fashionExhibition.src, vi: "ĐẾN THIẾT KẾ", en: "INTO DESIGN" },
];

function HeroScenes({ lang }: { lang: "vi" | "en" }) {
  const [active, setActive] = useState(0);
  const { enabled, intro } = useMotion();

  useEffect(() => {
    if (!enabled || intro !== "done") return;
    const timeout = window.setInterval(() => {
      if (!document.hidden && !document.querySelector("dialog[open], .mobile-nav")) setActive((current) => (current + 1) % heroScenes.length);
    }, 6500);
    return () => window.clearInterval(timeout);
  }, [active, enabled, intro]);

  return (
    <>
      <div className="hero-scenes" aria-hidden="true">
        {heroScenes.map((scene, index) => (
          <div key={scene.image} className={`hero-scene ${active === index ? "is-active" : ""}`}>
            <Image
              className="hero-photo"
              src={scene.image}
              alt=""
              fill
              sizes="100vw"
              preload={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="hero-scene-controls" role="group" aria-label={lang === "vi" ? "Chọn ảnh đầu trang" : "Choose hero scene"}>
        <span className="hero-scene-caption">{lang === "vi" ? heroScenes[active].vi : heroScenes[active].en}</span>
        <div className="hero-scene-buttons">
          {heroScenes.map((scene, index) => (
            <button
              key={scene.image}
              type="button"
              className={active === index ? "is-active" : ""}
              aria-label={lang === "vi" ? `Ảnh ${index + 1}: ${scene.vi}` : `Scene ${index + 1}: ${scene.en}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const railProgress = useRef<HTMLSpanElement>(null);
  const railPauseUntil = useRef(0);
  const railCycleWidth = useRef(0);
  const [railCopies, setRailCopies] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const { saved, toggle: toggleSaved } = useSaved();
  const { cart } = useCart();
  const [query, setQuery] = useState("");
  const [traceCode, setTraceCode] = useState("SP-PF-001");
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];
  const { enabled: motionEnabled, intro, reduced: reducedMotion } = useMotion();

  const cartCount = Object.values(cart).reduce((total, q) => total + q, 0);

  const open = (next: Overlay) => {
    setMenuOpen(false);
    setSubmitted(false);
    if (next?.kind === "search") setQuery("");
    setOverlay(next);
  };

  useEffect(() => {
    const header = root.current?.querySelector(".site-header");
    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 40);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const scrollCollection = (direction: -1 | 1) => {
    const element = rail.current;
    if (!element) return;

    railPauseUntil.current = Date.now() + 4500;
    const card = element.querySelector<HTMLElement>(".product-item");
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : element.clientWidth * 0.8;
    const cycle = railCycleWidth.current;
    if (cycle > 0) {
      const position = element.scrollLeft % cycle;
      element.scrollLeft = direction < 0 && position < step ? position + cycle : position;
    }
    element.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  useEffect(() => {
    if (!motionEnabled || intro !== "done") return;
    const element = rail.current;
    if (!element) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.35 },
    );
    observer.observe(element);

    const resizeObserver = new ResizeObserver(() => {
      const first = element.querySelector<HTMLElement>('[data-rail-copy="0"]');
      const repeated = element.querySelector<HTMLElement>('[data-rail-copy="1"]');
      if (!first || !repeated) return;
      railCycleWidth.current = repeated.offsetLeft - first.offsetLeft;
      if (railCycleWidth.current > 0) {
        setRailCopies(Math.max(3, Math.ceil(element.clientWidth / railCycleWidth.current) + 2));
      }
    });
    resizeObserver.observe(element);
    const firstCard = element.querySelector(".product-item");
    if (firstCard) resizeObserver.observe(firstCard);

    let frame = 0;
    let previousTime = 0;
    let position = element.scrollLeft;
    let appliedPosition = element.scrollLeft;
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const cycle = railCycleWidth.current;
      const keyboardFocus = element.contains(document.activeElement) && document.activeElement?.matches(":focus-visible");
      if (!isVisible || keyboardFocus || document.hidden || Date.now() < railPauseUntil.current || document.querySelector("dialog[open], .mobile-nav")) {
        position = element.scrollLeft;
        appliedPosition = element.scrollLeft;
      } else if (cycle > 0) {
        if (Math.abs(element.scrollLeft - appliedPosition) > 1) position = element.scrollLeft;
        // Keep fractional pixels between frames; wrap into an identical copy without a visual jump.
        position = (position + elapsed * 0.04) % cycle;
        element.scrollLeft = position;
        appliedPosition = element.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      railCycleWidth.current = 0;
    };
  }, [motionEnabled, intro, activeCategory]);

  useEffect(() => {
    if (rail.current) rail.current.scrollLeft = 0;
    if (rail.current && railProgress.current) {
      const ratio = rail.current.clientWidth / Math.max(1, rail.current.scrollWidth);
      railProgress.current.style.transform = `scaleX(${Math.min(1, ratio)})`;
    }
  }, [activeCategory]);

  useEffect(() => {
    if (!motionEnabled || intro !== "done") return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 0px)", () => {
      const context = gsap.context(() => {
        gsap.from(".hero-copy > *", {
          y: reducedMotion ? 0 : 58,
          opacity: 0,
          duration: reducedMotion ? 0.6 : 1.35,
          stagger: 0.18,
          ease: "power2.out",
          clearProps: "all",
        });
        if (!reducedMotion) gsap.to(".hero-scenes", {
          yPercent: 9,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });

        // Play a complete entrance on entering the viewport, even if scrolling stops.
        const revealOnScroll = (selector: string, from: gsap.TweenVars, end = "top 56%") => {
          root.current?.querySelectorAll<HTMLElement>(selector).forEach((element) => {
            gsap.from(element, {
              ...(reducedMotion ? { opacity: 0 } : from),
              duration: reducedMotion ? 0.6 : 1.2,
              ease: "power3.out",
              clearProps: "transform,opacity,clipPath",
              scrollTrigger: {
                trigger: element,
                start: "top 94%",
                end,
                once: true,
              },
            });
          });
        };

        revealOnScroll(".origins .section-top, .origin-intro > *", { y: 36, opacity: 0 }, "top 66%");
        revealOnScroll(".origin-panel.lotus", { clipPath: "inset(0 100% 0 0)" }, "top 48%");
        revealOnScroll(".origin-panel.pineapple", { clipPath: "inset(0 0 0 100%)" }, "top 48%");

        revealOnScroll(".journey .section-top, .journey-intro > h2, .journey-lead-desc", { y: 38, opacity: 0 }, "top 65%");
        revealOnScroll(".journey-figure", { opacity: 0, scale: 0.88, rotation: -3 }, "top 50%");
        revealOnScroll(".journey-disclaimer", { opacity: 0, x: -32 }, "top 68%");
        gsap.to(".journey-stages-heading", {
          "--rule-progress": 1,
          ease: "none",
          scrollTrigger: { trigger: ".journey-stages-heading", start: "top 94%", end: "top 55%", scrub: 0.45, once: true },
        });
        revealOnScroll(".journey-stage-list li", { x: 38, opacity: 0 }, "top 70%");

        revealOnScroll(".materials .section-top, .material-heading > *", { y: 30, opacity: 0 }, "top 67%");
        root.current?.querySelectorAll<HTMLElement>(".material-item").forEach((element, index) => {
          gsap.from(element, {
            y: reducedMotion ? 0 : 90,
            rotation: reducedMotion ? 0 : index % 2 === 0 ? -3 : 3,
            opacity: 0,
            duration: reducedMotion ? 0.6 : 1.3,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });

        revealOnScroll(".collection .section-top, .collection-heading > :not(h2)", { y: 28, opacity: 0 }, "top 67%");
        revealOnScroll(".collection-heading h2", { clipPath: "inset(0 100% 0 0)" }, "top 50%");
        revealOnScroll(".collection-filter-pills", { x: -40, opacity: 0 }, "top 66%");
        revealOnScroll(".product-rail", { x: 80, opacity: 0 }, "top 52%");
        revealOnScroll(".collection-bottom", { y: 26, opacity: 0 }, "top 70%");

        revealOnScroll(".trace-copy > *", { x: -45, opacity: 0 }, "top 66%");
        revealOnScroll(".passport-wrap", { x: 80, rotationY: -12, opacity: 0 }, "top 48%");
        ScrollTrigger.create({
          trigger: ".trace",
          start: "top 85%",
          end: "bottom top",
          onEnter: () => root.current?.querySelector(".trace")?.classList.add("is-in-view"),
          onEnterBack: () => root.current?.querySelector(".trace")?.classList.add("is-in-view"),
          onLeave: () => root.current?.querySelector(".trace")?.classList.remove("is-in-view"),
          onLeaveBack: () => root.current?.querySelector(".trace")?.classList.remove("is-in-view"),
        });

        revealOnScroll(".business .section-top, .business-layout > div:first-child > *", { x: -45, opacity: 0 }, "top 66%");
        revealOnScroll(".business-visual", { scale: 0.84, rotation: 4, opacity: 0 }, "top 48%");
        if (!reducedMotion) gsap.to(".business-visual > img", {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".business", start: "top bottom", end: "bottom top", scrub: true },
        });
        revealOnScroll(".footer-main > *", { y: 44, opacity: 0 }, "top 63%");
      }, root);
      return () => context.revert();
    });

    return () => {
      mm.revert();
    };
  }, [motionEnabled, intro, reducedMotion]);

  useEffect(() => {
    const modal = dialog.current;
    if (!overlay || !modal) return;
    if (!modal.open) modal.showModal();
    if (overlay.kind === "search") modal.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [overlay]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const selectedProduct = overlay?.kind === "product" ? products[overlay.id] : null;
  const selectedMaterial = overlay?.kind === "material" ? materials.find((item) => item.id === overlay.id) : null;
  const tracedMaterial = materials.find((item) => item.code === traceCode);

  const displayedProducts =
    activeCategory === "All"
      ? products
      : activeCategory === "Trang phục"
        ? products.filter((p) => p.category === "Trang phục")
        : products.filter((p) => p.category === "Phụ kiện");

  const navItems = lang === "vi" ? navigation : navigationEn;

  return (
    <div ref={root}>
      <Link href="#main" className="skip-link">
        {lang === "vi" ? "Đến nội dung chính" : "Skip to main content"}
      </Link>

      <header className="site-header">
        <div className="header-brand-group">
          <Link href="#" aria-label="SenPine — về đầu trang">
            <Brand />
          </Link>
        </div>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map(([name, href]) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          {/* Desktop Language toggle pill */}
          <button
            className="lang-toggle-pill desktop-only-tool"
            onClick={toggleLang}
            aria-label={lang === "vi" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese"}
            title={lang === "vi" ? "English" : "Tiếng Việt"}
          >
            <span className={lang === "vi" ? "active-lang" : ""}>VI</span>
            <span className="lang-sep">/</span>
            <span className={lang === "en" ? "active-lang" : ""}>EN</span>
          </button>

          {/* Desktop Theme toggle button */}
          <button
            className="icon-button theme-toggle-btn desktop-only-tool"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Giao diện tối" : "Giao diện sáng"}
            title={theme === "light" ? (lang === "vi" ? "Giao diện tối" : "Dark theme") : (lang === "vi" ? "Giao diện sáng" : "Light theme")}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} className="theme-sun-icon" />}
          </button>

          <button
            className="icon-button"
            onClick={() => open({ kind: "search" })}
            aria-label={lang === "vi" ? "Tìm sản phẩm" : "Search products"}
            title={lang === "vi" ? "Tìm kiếm" : "Search"}
          >
            <Search size={19} strokeWidth={1.5} />
          </button>

          <button
            className="icon-button saved-count"
            onClick={() => open({ kind: "saved" })}
            aria-label={
              lang === "vi"
                ? `Sản phẩm đã lưu (${saved.length})`
                : `Saved designs (${saved.length})`
            }
            title={lang === "vi" ? `Đã lưu (${saved.length})` : `Saved (${saved.length})`}
          >
            <Heart size={19} strokeWidth={1.5} />
            {saved.length > 0 && <span>{saved.length}</span>}
          </button>

          <Link
            className="icon-button saved-count"
            href="/experience/checkout"
            aria-label={`Giỏ trải nghiệm (${cartCount})`}
            title={lang === "vi" ? `Giỏ trải nghiệm (${cartCount})` : `Experience Bag (${cartCount})`}
          >
            <span className="sr-only">Giỏ trải nghiệm</span>
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>

          <button
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer - positioned outside header so backdrop-filter does not clip it */}
      {menuOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Điều hướng trên điện thoại"
          >
            <div className="mobile-nav-top">
              <span className="eyebrow">{lang === "vi" ? "ĐIỀU HƯỚNG SENPINE" : "SENPINE NAVIGATION"}</span>
              <div className="mobile-tools-bar">
                <button className="mobile-tool-btn" onClick={toggleTheme} aria-label="Đổi giao diện sáng tối">
                  {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                  <span>{theme === "light" ? "Giao diện tối" : "Giao diện sáng"}</span>
                </button>
                <button className="mobile-tool-btn" onClick={toggleLang} aria-label="Đổi ngôn ngữ">
                  <span>{lang === "vi" ? "English (EN)" : "Tiếng Việt (VI)"}</span>
                </button>
              </div>
            </div>

            <div className="mobile-nav-links">
              {navItems.map(([name, href], i) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                  <span>0{i + 1}</span>
                  {name}
                  <ArrowUpRight size={22} />
                </Link>
              ))}
              <Link href="/sustainability" onClick={() => setMenuOpen(false)}>
                <span>07</span>
                {t.nav.sustainability} <ArrowUpRight size={22} />
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                <span>08</span>
                {t.nav.contact} <ArrowUpRight size={22} />
              </Link>
            </div>

            <div className="mobile-nav-footer">
              <p className="mobile-corp-note">
                {lang === "vi"
                  ? "SenPine • Đề án vật liệu từ lá dứa và tơ sen"
                  : "SenPine • Lotus and pineapple textile concept"}
              </p>
            </div>
          </nav>
        </>
      )}

      <main id="main">
        {/* Cinematic Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <HeroScenes lang={lang} />
          <div className="hero-shade" />

          <div className="hero-copy">
            <p className="eyebrow">
              <span className="little-line" /> {lang === "vi" ? "TỪ THỰC VẬT. TỪ VIỆT NAM." : "PLANT-BASED. MADE IN VIETNAM."}
            </p>
            <h1 id="hero-title">
              {lang === "vi" ? (
                <>
                  Từ tự nhiên.<br />
                  Dệt nên <em>tương lai.</em>
                </>
              ) : (
                <>
                  From Nature.<br />
                  Weaving <em>the Future.</em>
                </>
              )}
            </h1>
            <p className="hero-description">
              {lang === "vi" ? (
                <>
                  Một hành trình mới của lá dứa và tơ sen.<br />
                  Giải pháp vật liệu tuần hoàn cho ngành thời trang bền vững Việt Nam.
                </>
              ) : (
                <>
                  A regenerative frontier for post-harvest pineapple leaves and artisanal lotus stems.<br />
                  Next-generation circular bio-textile solutions for responsible global fashion.
                </>
              )}
            </p>
            <div className="hero-actions">
              <Link className="button button-light" href="#journey">
                {lang === "vi" ? "Theo dấu một sợi vải" : "Explore Fiber Journey"} <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link light" href="/collection">
                {lang === "vi" ? "Khám phá bộ sưu tập" : "View Collection"} <MoveRight size={20} />
              </Link>
            </div>
          </div>
          <div className="hero-scroll-note" aria-hidden="true">
            <span className="hero-scroll-rule" />
            {lang === "vi" ? "CUỘN ĐỂ KHÁM PHÁ" : "SCROLL TO EXPLORE"}
          </div>
        </section>

        <MotionRibbon variant="materials" />

        {/* Origin Section: Lotus x Pineapple */}
        <section id="origins" className="origins section-space">
          <div className="section-top reveal">
            <p className="eyebrow">{t.origin.eyebrow}</p>
            <span className="section-aside">
              {lang === "vi" ? "Hai nguyên liệu. Một hướng đi." : "Two Indigenous Botanicals. One Direction."}
            </span>
          </div>

          <div className="origin-intro reveal">
            <h2>
              {lang === "vi" ? (
                <>
                  Mọi điều tốt đẹp<br />
                  bắt đầu từ <em>gốc rễ.</em>
                </>
              ) : (
                <>
                  Every enduring thing<br />
                  starts from <em>the roots.</em>
                </>
              )}
            </h2>
            <p>{t.origin.description}</p>
          </div>

          <div className="origin-grid">
            <Link className="origin-panel lotus reveal" href="/materials/sensilk">
              <Image
                src={detailsImages.lotusSorting.src}
                alt={detailsImages.lotusSorting.alt}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <div className="origin-overlay" />
              <span className="origin-caption">THE LOTUS / NELUMBO NUCIFERA</span>
              <div className="origin-title">
                <div>
                  <span>01 — {t.origin.lotusSubtitle.toUpperCase()}</span>
                  <h3>{t.origin.lotusTitle}</h3>
                  <p>{t.origin.lotusDesc}</p>
                </div>
                <span className="round-arrow">
                  <ArrowUpRight size={23} />
                </span>
              </div>
            </Link>

            <Link className="origin-panel pineapple reveal" href="/materials/pinefiber">
              <Image
                src={detailsImages.harvest.src}
                alt={detailsImages.harvest.alt}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <div className="origin-overlay" />
              <span className="origin-caption">THE PINEAPPLE / ANANAS COMOSUS</span>
              <div className="origin-title">
                <div>
                  <span>02 — {t.origin.pineSubtitle.toUpperCase()}</span>
                  <h3>{t.origin.pineTitle}</h3>
                  <p>{t.origin.pineDesc}</p>
                </div>
                <span className="round-arrow">
                  <ArrowUpRight size={23} />
                </span>
              </div>
            </Link>
          </div>
        </section>

        <JourneySection />

        {/* Material Lab */}
        <section id="materials" className="materials section-space">
          <div className="section-top reveal">
            <p className="eyebrow">{t.materialsSec.eyebrow}</p>
            <span className="section-aside">
              {lang === "vi" ? "Chạm vào một khả năng mới." : "Tactile botanical intelligence."}
            </span>
          </div>
          <div className="material-heading reveal">
            <h2>
              {lang === "vi" ? (
                <>
                  Tự nhiên, dưới<br />
                  <em>nhiều sắc thái.</em>
                </>
              ) : (
                <>
                  Nature Expressed in<br />
                  <em>Nuanced Textures.</em>
                </>
              )}
            </h2>
            <div>
              <p>
                {lang === "vi"
                  ? "Ba hướng phát triển vật liệu sinh học. Mỗi bề mặt là một giải pháp dệt may riêng."
                  : "Three strategic bio-fabric lines. Each texture represents a distinct market solution."}
              </p>
              <Link className="text-link" href="/materials">
                {lang === "vi" ? "Xem các hướng vật liệu" : "Explore materials"} <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>

          <div className="material-grid">
            {materials.map((material, index) => (
              <article key={material.id} className="material-item reveal">
                <button
                  className="material-photo"
                  onClick={() => open({ kind: "material", id: material.id })}
                  aria-label={`Khám phá ${material.name}`}
                >
                  <Image
                    src={materialImages[index].src}
                    alt={materialImages[index].alt}
                    fill
                    sizes="(max-width: 700px) 88vw, 33vw"
                  />
                  <span className="material-photo-label">{lang === "vi" ? material.origin : material.originEn}</span>
                  <span className="material-index" aria-hidden="true">0{index + 1} / 03</span>
                  <span className="material-open">
                    <ArrowUpRight size={21} />
                  </span>
                </button>
                <div className="material-title">
                  <h3>{material.name}</h3>
                  <span className="material-origin-tag">{lang === "vi" ? material.origin : material.originEn}</span>
                </div>
                <p>{lang === "vi" ? material.description : material.descriptionEn}</p>
                <div className="material-bottom">
                  <div className="material-price-wrap">
                    <span className="material-price-label">{t.common.plannedPrice}</span>
                    <span className="material-price-val">
                      {currency(material.price, lang)}
                      <small style={{ fontSize: "var(--type-caption)", fontWeight: "normal", color: "var(--text-muted)" }}>
                        {lang === "vi" ? " / mét" : " / meter"}
                      </small>
                    </span>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => open({ kind: "material", id: material.id })}
                    aria-label={`Thông tin ${material.name}`}
                  >
                    <MoveRight size={22} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Collection Showroom */}
        <section id="collection" className="collection section-space">
          <div className="section-top reveal">
            <p className="eyebrow">{t.showroom.eyebrow}</p>
            <span className="section-aside">
              {lang === "vi" ? "Ít hơn, nhưng có ý nghĩa hơn." : "Fewer, better things."}
            </span>
          </div>

          <div className="collection-heading reveal">
            <h2>
              {lang === "vi" ? (
                <>
                  Gần gũi. <em>Mỗi ngày.</em>
                </>
              ) : (
                <>
                  Effortless. <em>Every Day.</em>
                </>
              )}
            </h2>
            <div className="rail-controls">
              <button
                className="round-control"
                onClick={() => scrollCollection(-1)}
                aria-label="Xem sản phẩm phía trước"
              >
                <ChevronLeft size={21} />
              </button>
              <button
                className="round-control"
                onClick={() => scrollCollection(1)}
                aria-label="Xem thêm sản phẩm"
              >
                <ChevronRight size={21} />
              </button>
            </div>
          </div>

          <div className="collection-filter-pills">
            <button
              className={`filter-pill ${activeCategory === "All" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("All")}
            >
              {t.showroom.filterAll}
            </button>
            <button
              className={`filter-pill ${activeCategory === "Trang phục" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("Trang phục")}
            >
              {t.showroom.filterApparel}
            </button>
            <button
              className={`filter-pill ${activeCategory === "Phụ kiện" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("Phụ kiện")}
            >
              {t.showroom.filterAccessories}
            </button>
          </div>

          <div
            className="product-rail"
            ref={rail}
            aria-label={`Bộ sưu tập ${displayedProducts.length} sản phẩm concept`}
            tabIndex={0}
            onScroll={(event) => {
              const element = event.currentTarget;
              const cycle = railCycleWidth.current || element.scrollWidth;
              const ratio = (element.scrollLeft % cycle + element.clientWidth) / (cycle + element.clientWidth);
              if (railProgress.current) railProgress.current.style.transform = `scaleX(${Math.min(1, ratio)})`;
            }}
            onPointerDown={() => { railPauseUntil.current = Date.now() + 4500; }}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) railPauseUntil.current = Date.now() + 4500;
            }}
            onWheel={(event) => {
              if (Math.abs(event.deltaX) > 0) railPauseUntil.current = Date.now() + 4500;
            }}
            onKeyDown={() => { railPauseUntil.current = Date.now() + 4500; }}
          >
            {Array.from({ length: railCopies }, (_, copy) => displayedProducts.map((product) => (
              <article
                key={`${copy}-${product.id}`}
                className="product-item"
                data-rail-copy={copy}
                aria-hidden={copy > 0 || undefined}
                onPointerDown={copy > 0 ? (event) => event.preventDefault() : undefined}
              >
                <div className="product-photo-wrap">
                  <button
                    className="product-open"
                    tabIndex={copy > 0 ? -1 : undefined}
                    onClick={() => open({ kind: "product", id: product.id })}
                    aria-label={`Xem ${product.name}`}
                  >
                    <ProductImage id={product.id} />
                  </button>

                  <button
                    className={`save-product ${saved.includes(product.id) ? "is-saved" : ""}`}
                    tabIndex={copy > 0 ? -1 : undefined}
                    onClick={() => toggleSaved(product.id)}
                    aria-pressed={saved.includes(product.id)}
                    aria-label={`${saved.includes(product.id) ? "Bỏ lưu" : "Lưu"} ${product.name}`}
                  >
                    <Heart size={18} strokeWidth={1.5} fill={saved.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="product-info">
                  <div className="product-category-row">
                    <span className="product-category-tag">
                      {lang === "vi" ? product.category : product.categoryEn} • {lang === "vi" ? product.color : product.colorEn}
                    </span>
                    <span className="product-sku-tag">SP-0{product.id + 1}</span>
                  </div>

                  <button
                    className="product-name"
                    tabIndex={copy > 0 ? -1 : undefined}
                    onClick={() => open({ kind: "product", id: product.id })}
                  >
                    <h3>{lang === "vi" ? product.name : product.english}</h3>
                  </button>

                  <p className="product-material">{lang === "vi" ? product.materialUsed : product.materialUsedEn}</p>

                  <div className="product-bottom-row">
                    <div className="product-price-box">
                      <span className="product-price">
                        {currency(product.price, lang)}
                      </span>
                      <span className="product-price-badge">
                        {lang === "vi" ? "Giá kế hoạch" : "Planned price"}
                      </span>
                    </div>
                    <button
                      className="product-view-btn"
                      tabIndex={copy > 0 ? -1 : undefined}
                      onClick={() => open({ kind: "product", id: product.id })}
                      aria-label={`Chi tiết ${product.name}`}
                    >
                      <span>{lang === "vi" ? "Chi tiết" : "Details"}</span>
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            )))}
          </div>

          <div className="collection-bottom">
            <span className="collection-footnote">
              {lang === "vi"
                ? "Hình tham khảo trong đề án · Thiết kế và giá dự kiến."
                : "Project reference images · Proposed designs and prices."}
            </span>
            <span className="collection-progress" aria-hidden="true"><span ref={railProgress} /></span>
            <span className="collection-scroll-hint">
              {lang === "vi" ? "KÉO NGANG ĐỂ KHÁM PHÁ" : "SCROLL HORIZONTALLY"} <MoveRight size={16} />
            </span>
          </div>
        </section>

        {/* Traceability: Digital Product Passport */}
        <section id="trace" className="trace section-space">
          <div className="trace-copy reveal">
            <p className="eyebrow">{t.traceSec.eyebrow}</p>
            <h2>
              {lang === "vi" ? (
                <>
                  Không chỉ là vải.<br />
                  Là một câu chuyện<br />
                  <em>có thể theo dấu.</em>
                </>
              ) : (
                <>
                  More Than Fabric.<br />
                  A Fully Traceable<br />
                  <em>Lineage.</em>
                </>
              )}
            </h2>
            <p>{t.traceSec.subtitle}</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button className="button button-light" onClick={() => open({ kind: "trace" })}>
                {t.traceSec.openSamplePassport} <ArrowUpRight size={18} />
              </button>
              <Link href="/trace" className="button button-outline">
                {lang === "vi" ? "Trang Truy Xuất Số" : "Digital Traceability Portal"} <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          <div className="passport-wrap reveal">
            <div className="passport">
              <div className="passport-top">
                <Brand small />
                <span style={{ fontSize: "var(--type-caption)", letterSpacing: "0.14em", fontWeight: "bold", color: "var(--gold)" }}>
                  DIGITAL PRODUCT PASSPORT
                </span>
              </div>
              <div className="passport-material" style={{ margin: "20px 0" }}>
                <span style={{ fontSize: "var(--type-caption)", letterSpacing: "0.12em", color: "var(--sage)", fontWeight: "bold" }}>
                  BOTANICAL HERITAGE
                </span>
                <h3 style={{ fontSize: "var(--type-card-title)", margin: "6px 0" }}>SenPine Blend</h3>
                <p style={{ fontSize: "var(--type-body)", color: "var(--text-muted)" }}>
                  {lang === "vi" ? "95% Sợi lá dứa Cần Thơ + 5% Tơ sen Đồng Tháp" : "95% Pineapple Fiber + 5% Lotus Silk"}
                </p>
              </div>
              <div className="passport-lines" style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "16px 0" }}>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0, fontSize: "var(--type-label)" }}>
                  <span style={{ color: "var(--text-muted)" }}>MÃ HỒ SƠ</span>
                  <strong>SP-SB-001</strong>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0, fontSize: "var(--type-label)" }}>
                  <span style={{ color: "var(--text-muted)" }}>ĐỊA ĐIỂM DỰ KIẾN</span>
                  <strong>KCN Sông Hậu, Cần Thơ</strong>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: 0, fontSize: "var(--type-label)" }}>
                  <span style={{ color: "var(--text-muted)" }}>TRẠNG THÁI</span>
                  <strong>Hồ sơ minh họa</strong>
                </p>
              </div>
              <div className="passport-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                <ScanLine size={42} strokeWidth={1} style={{ color: "var(--gold)" }} />
                <p style={{ margin: 0, fontSize: "var(--type-caption)", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Mỗi thước vải,<br />một khởi đầu xanh.
                </p>
                <span className="demo-stamp">DEMO TRACE</span>
              </div>
            </div>
            <span className="passport-orbit" aria-hidden="true" />
          </div>
        </section>

        {/* Careers */}
        <section id="business" className="business section-space">
          <div className="section-top reveal">
            <p className="eyebrow">{lang === "vi" ? "07 / TUYỂN DỤNG" : "07 / CAREERS"}</p>
            <span className="section-aside">
              {lang === "vi" ? "Con người làm nên giá trị" : "People create value"}
            </span>
          </div>

          <div className="business-layout reveal">
            <div>
              <h2>
                {lang === "vi" ? (
                  <>
                    Chuyên môn của bạn.<br />
                    <em>Một hành trình có ý nghĩa.</em>
                  </>
                ) : (
                  <>
                    Your expertise.<br />
                    <em>A meaningful journey.</em>
                  </>
                )}
              </h2>
              <p>
                {lang === "vi"
                  ? "Từ nghiên cứu và sản xuất đến thiết kế, kinh doanh và vận hành. Khám phá các vai trò trong kế hoạch phát triển đội ngũ SenPine và tìm nơi bạn có thể đóng góp."
                  : "From research and production to design, sales and operations. Explore the roles in SenPine's team development plan and find where you can contribute."}
              </p>
              <div className="business-actions">
                <Link href="/careers" className="button button-dark">
                  {lang === "vi" ? "Khám phá cơ hội nghề nghiệp" : "Explore career opportunities"} <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <div className="business-visual" aria-hidden="true">
              <Image src={detailsImages.rawFiber.src} alt={detailsImages.rawFiber.alt} fill sizes="(max-width: 900px) 88vw, 38vw" />
              <span className="business-visual-top">SENPINE / PEOPLE & PURPOSE</span>
              <div className="business-visual-bottom">
                <span>01 / RESEARCH<br />02 / CREATE<br />03 / GROW TOGETHER</span>
                <span className="business-visual-mark">✳</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-col-brand">
            <Link href="#" aria-label="SenPine — về đầu trang">
              <Brand />
            </Link>
            <p className="footer-mission-text">
              {lang === "vi" ? (
                <>
                  Từ tự nhiên.<br />
                  Dệt nên tương lai.<br />
                  <span className="footer-sub-text">
                    Đề án nghiên cứu vật liệu dệt từ lá dứa và tơ sen.
                  </span>
                </>
              ) : (
                <>
                  From Nature.<br />
                  Weaving the Future.<br />
                  <span className="footer-sub-text">
                    A textile concept using pineapple leaves and lotus stems.
                  </span>
                </>
              )}
            </p>
            <div className="footer-theme-controls">
              <button onClick={toggleTheme} className="footer-control-btn" aria-label="Đổi giao diện sáng tối">
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                <span>{theme === "light" ? "Giao diện Tối" : "Giao diện Sáng"}</span>
              </button>
              <button onClick={toggleLang} className="footer-control-btn" aria-label="Đổi ngôn ngữ">
                <span>{lang === "vi" ? "English" : "Tiếng Việt"}</span>
              </button>
            </div>
          </div>

          <div>
            <p className="eyebrow">{t.footer.exploreTitle}</p>
            <Link href="/story">{t.nav.story}</Link>
            <Link href="/materials">{t.nav.materials}</Link>
            <Link href="/collection">{t.nav.collection}</Link>
            <Link href="/trace">{t.nav.trace}</Link>
          </div>

          <div>
            <p className="eyebrow">{t.footer.corpTitle}</p>
            <Link href="/careers">{t.nav.business}</Link>
            <Link href="/sustainability">{t.nav.sustainability}</Link>
            <Link href="/about">{t.nav.about}</Link>
            <Link href="/contact">{t.nav.contact}</Link>
            <button onClick={() => open({ kind: "business", intent: "quote" })} style={{ fontSize: "var(--type-control)", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
              {lang === "vi" ? "Trao đổi ý tưởng" : "Propose Concept"} <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="footer-about">
            <p className="eyebrow">{t.footer.legalTitle}</p>
            <p style={{ fontSize: "var(--type-body)", color: "var(--text-muted)", lineHeight: 1.8 }}>
              {lang === "vi"
                ? "SenPine là đề án khởi nghiệp về vật liệu dệt từ lá dứa và tơ sen tại Việt Nam. Website thể hiện định hướng thương hiệu và trải nghiệm sản phẩm."
                : "SenPine is an academic startup project exploring plant-based textiles from pineapple and lotus in Vietnam."}
            </p>
            <p style={{ fontSize: "var(--type-caption)", color: "var(--text-muted)", marginTop: "12px" }}>
              Trường ĐH Công nghiệp TP.HCM (IUH) • Khoa Quản trị Kinh doanh
            </p>
          </div>
        </div>

        <div className="footer-disclaimer-bar">
          <p className="footer-disclaimer-text">{t.footer.disclaimer}</p>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.copyright}</span>
          <Link href="#main" className="back-to-top-link">
            {lang === "vi" ? "Về trang chủ ↑" : "Back to top ↑"}
          </Link>
        </div>
      </footer>

      {/* Global Modals for Interactive Moments */}
      {overlay && (
        <dialog
          ref={dialog}
          className={`modal modal-${overlay.kind}`}
          onCancel={() => setOverlay(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOverlay(null);
          }}
          aria-labelledby="modal-title"
        >
          <button
            className="modal-close icon-button"
            onClick={() => setOverlay(null)}
            aria-label={lang === "vi" ? "Đóng cửa sổ" : "Close window"}
          >
            <X size={22} />
          </button>

          {/* Search Modal */}
          {overlay.kind === "search" && (
            <SearchDialogContent
              lang={lang}
              onSelectProduct={(id) => open({ kind: "product", id })}
              onSelectMaterial={(id) => open({ kind: "material", id })}
              onClose={() => setOverlay(null)}
            />
          )}

          {/* Saved Items Modal */}
          {overlay.kind === "saved" && (
            <SavedDialogContent
              lang={lang}
              saved={saved}
              onToggleSaved={toggleSaved}
              onSelectProduct={(id) => open({ kind: "product", id })}
              onExploreCollection={() => {
                setOverlay(null);
                requestAnimationFrame(() =>
                  document
                    .getElementById("collection")
                    ?.scrollIntoView({
                      behavior: reducedMotion ? "auto" : "smooth",
                      block: "start",
                    })
                );
              }}
              onClose={() => setOverlay(null)}
            />
          )}

          {/* Product Quick View Dialog */}
          {selectedProduct && (
            <ProductQuickView
              product={selectedProduct}
              lang={lang}
              isSaved={saved.includes(selectedProduct.id)}
              onToggleSave={toggleSaved}
              onNavigate={() => setOverlay(null)}
            />
          )}

          {/* Material Dossier Quick Dialog */}
          {selectedMaterial && (
            <MaterialQuickView
              material={selectedMaterial}
              lang={lang}
              onRequestSample={() => open({ kind: "business", intent: "sample" })}
              onNavigate={() => setOverlay(null)}
            />
          )}

          {/* Trace Sample Modal */}
          {overlay.kind === "trace" && (
            <div className="modal-content">
              <p className="eyebrow">MATERIAL PASSPORT / DEMO</p>
              <h2 id="modal-title">Theo dấu <em>nguyên liệu.</em></h2>
              <label className="form-label">
                Chọn hồ sơ minh họa
                <select value={traceCode} onChange={(event) => setTraceCode(event.target.value)}>
                  {materials.map((material) => (
                    <option key={material.code} value={material.code}>
                      {material.code} — {material.name}
                    </option>
                  ))}
                </select>
              </label>
              {tracedMaterial && (
                <div className="trace-result">
                  <span className="demo-label">HỒ SƠ DEMO · KHÔNG PHẢI LÔ THỰC TẾ</span>
                  <h3>{tracedMaterial.name}</h3>
                  <p>{tracedMaterial.detail}</p>
                  <ol>
                    <li>
                      <span>01</span>Nguyên liệu nông nghiệp Việt Nam (Lá dứa & cuống sen)
                      <small>Khai thác phụ phẩm sau thu hoạch</small>
                    </li>
                    <li>
                      <span>02</span>Dự kiến xử lý xơ cơ học → Kéo sợi → Dệt
                      <small>Quy trình đề xuất, chưa vận hành thực tế</small>
                    </li>
                    <li>
                      <span>03</span>Hoàn thiện sinh học → Kiểm tra độ bền kéo → Đóng gói
                      <small>Mã truy xuất nguồn gốc số SP-SB-001</small>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* B2B Proposal Modal */}
          {overlay.kind === "business" && (
            <div className="modal-content">
              <p className="eyebrow">FOR BUSINESS / TRẢI NGHIỆM MẪU</p>
              <h2 id="modal-title">
                {overlay.intent === "sample" ? (
                  <>
                    Bắt đầu từ <em>một mẫu vải.</em>
                  </>
                ) : (
                  <>
                    Cùng dệt nên <em>ý tưởng mới.</em>
                  </>
                )}
              </h2>
              {submitted ? (
                <div className="form-success" role="status">
                  <Check size={38} strokeWidth={1} style={{ color: "var(--sage)" }} />
                  <h3>Đã hoàn tất trải nghiệm.</h3>
                  <p>
                    Thông tin chỉ được kiểm tra trong phiên demo này, chưa được lưu hoặc gửi đi. Chưa có yêu cầu mẫu vải hay hợp tác thực tế được tạo.
                  </p>
                  <button className="button button-dark" onClick={() => setOverlay(null)}>
                    Tiếp tục khám phá <ArrowUpRight size={18} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <p className="modal-note">
                    Biểu mẫu minh họa, chưa gửi thông tin đến SenPine. Các mẫu vải và giá là kế hoạch phát triển.
                  </p>
                  <div className="form-row">
                    <label className="form-label">
                      Họ tên
                      <input name="name" autoComplete="name" required maxLength={100} placeholder="Tên của bạn" />
                    </label>
                    <label className="form-label">
                      Email
                      <input type="email" name="email" autoComplete="email" required maxLength={150} placeholder="you@brand.com" />
                    </label>
                  </div>
                  <label className="form-label">
                    Thương hiệu / tổ chức
                    <input name="company" autoComplete="organization" required maxLength={150} placeholder="Tên thương hiệu hoặc tổ chức" />
                  </label>
                  <label className="form-label">
                    Vật liệu quan tâm
                    <select name="material">
                      <option>Cả ba dòng vật liệu (Sample Kit)</option>
                      {materials.map((material) => (
                        <option key={material.id}>{material.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="form-label">
                    Ý tưởng ứng dụng
                    <textarea name="message" rows={3} maxLength={1000} placeholder="Bạn đang hình dung một thiết kế như thế nào?" />
                  </label>
                  <button className="button button-dark" type="submit">
                    Hoàn tất trải nghiệm demo <ArrowUpRight size={18} />
                  </button>
                </form>
              )}
            </div>
          )}
        </dialog>
      )}
    </div>
  );
}
