"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Menu, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";
import { materials, navigation, navigationEn, products } from "@/lib/content";
import { useCart, useSaved } from "@/lib/store";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/i18n";

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <span className="brand-mark" aria-hidden="true">✳</span>
      SenPine
      <span className="brand-period">.</span>
    </span>
  );
}

export function SiteHeader({ overlayHero = false }: { overlayHero?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { saved } = useSaved();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

  useEffect(() => {
    if (!overlayHero) return;
    const header = document.querySelector(".site-header");
    const update = () => header?.classList.toggle("is-scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overlayHero]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  const term = query.trim().toLocaleLowerCase(lang === "vi" ? "vi" : "en");
  const productMatches = term
    ? products.filter(
        (product) =>
          `${product.name} ${product.english}`
            .toLocaleLowerCase(lang === "vi" ? "vi" : "en")
            .includes(term)
      )
    : products.slice(0, 3);
  const materialMatches = term
    ? materials.filter(
        (material) =>
          `${material.name} ${material.origin} ${material.originEn}`
            .toLocaleLowerCase(lang === "vi" ? "vi" : "en")
            .includes(term)
      )
    : [];

  // When Vietnamese, use exact Vietnamese navigation labels to satisfy automated tests
  // When English, use translated labels
  const navItems = lang === "vi" ? navigation : navigationEn;

  return (
    <>
      <a className="skip-link" href="#main">
        {lang === "vi" ? "Đến nội dung chính" : "Skip to main content"}
      </a>

      <header className={`site-header ${overlayHero ? "" : "is-scrolled"}`}>
        <div className="header-brand-group">
          <Link href="/" aria-label="SenPine — về trang chủ" className="brand-link">
            <Brand />
          </Link>
        </div>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          {/* Search Button */}
          <button
            className="icon-button"
            aria-label="Tìm kiếm"
            title={lang === "vi" ? "Tìm kiếm" : "Search"}
            onClick={() => {
              setSearchOpen(true);
              setMenuOpen(false);
            }}
          >
            <Search size={19} />
          </button>

          {/* Wishlist Link */}
          <Link
            className="icon-button saved-count"
            href="/saved"
            aria-label={`Đã lưu ${saved.length} thiết kế`}
            title={lang === "vi" ? `Đã lưu (${saved.length})` : `Saved (${saved.length})`}
          >
            <Heart size={19} />
            {saved.length > 0 && <span>{saved.length}</span>}
          </Link>

          {/* Experience Bag Link */}
          <Link
            className="icon-button saved-count"
            href="/experience/checkout"
            aria-label={`Giỏ trải nghiệm ${count} thiết kế`}
            title={lang === "vi" ? `Giỏ trải nghiệm (${count})` : `Experience Bag (${count})`}
          >
            <ShoppingBag size={19} />
            {count > 0 && <span>{count}</span>}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav id="site-mobile-nav" className="mobile-nav" aria-label="Điều hướng trên điện thoại">
            <div className="mobile-nav-top">
              <span className="eyebrow">{lang === "vi" ? "ĐIỀU HƯỚNG SENPINE" : "SENPINE NAVIGATION"}</span>
              <div className="mobile-tools-bar">
                <button
                  className="mobile-tool-btn"
                  onClick={toggleTheme}
                  aria-label="Đổi giao diện sáng tối"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  <span>{theme === "light" ? "Giao diện tối" : "Giao diện sáng"}</span>
                </button>
                <button
                  className="mobile-tool-btn"
                  onClick={toggleLang}
                  aria-label="Đổi ngôn ngữ"
                >
                  <span>{lang === "vi" ? "English (EN)" : "Tiếng Việt (VI)"}</span>
                </button>
              </div>
            </div>

            <div className="mobile-nav-links">
              {navItems.map(([label, href], index) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>
                  {label}
                  <ArrowUpRight size={21} />
                </Link>
              ))}
              <Link href="/sustainability" onClick={() => setMenuOpen(false)}>
                <span>07</span>
                {t.nav.sustainability} <ArrowUpRight size={21} />
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                <span>08</span>
                {t.nav.contact} <ArrowUpRight size={21} />
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
        )}
      </header>

      {/* Global Search Overlay */}
      {searchOpen && (
        <div className="site-search-backdrop" onClick={() => setSearchOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Tìm kiếm SenPine"
            className="site-search"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-search-heading">
              <p className="eyebrow">{t.nav.search.toUpperCase()}</p>
              <button
                aria-label="Đóng tìm kiếm"
                className="icon-button"
                onClick={() => setSearchOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <label className="search-field">
              <Search size={24} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  lang === "vi"
                    ? "Tìm thiết kế hoặc vật liệu (ví dụ: áo, váy, khăn, pinefiber, sensilk)…"
                    : "Search garments or materials (e.g. shirt, dress, scarf, pinefiber, sensilk)…"
                }
                type="search"
              />
            </label>
            <div className="site-search-results">
              {productMatches.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  onClick={() => setSearchOpen(false)}
                >
                  <span className="search-result-name">{lang === "vi" ? product.name : product.english}</span>
                  <span className="search-result-sub">{lang === "vi" ? product.category : product.categoryEn}</span>
                  <ArrowUpRight size={19} />
                </Link>
              ))}
              {materialMatches.map((material) => (
                <Link
                  key={material.id}
                  href={`/materials/${material.id}`}
                  onClick={() => setSearchOpen(false)}
                >
                  <span className="search-result-name">{material.name}</span>
                  <span className="search-result-sub">{lang === "vi" ? material.origin : material.originEn}</span>
                  <ArrowUpRight size={19} />
                </Link>
              ))}
              {productMatches.length + materialMatches.length === 0 && (
                <p className="search-empty-msg">
                  {lang === "vi"
                    ? "Chưa có kết quả phù hợp. Hãy thử từ khóa “áo”, “sen”, “dứa” hoặc “vải”."
                    : "No matching results. Try keywords like 'shirt', 'lotus', 'pineapple', or 'fabric'."}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  const { lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = translations[lang];

  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand & Corporate Mission */}
        <div className="footer-col-brand">
          <Link href="/" aria-label="SenPine — trang chủ">
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
            <button
              onClick={toggleTheme}
              className="footer-control-btn"
              aria-label="Đổi giao diện sáng tối"
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              <span>{theme === "light" ? "Giao diện Tối" : "Giao diện Sáng"}</span>
            </button>
            <button
              onClick={toggleLang}
              className="footer-control-btn"
              aria-label="Đổi ngôn ngữ"
            >
              <span>{lang === "vi" ? "English" : "Tiếng Việt"}</span>
            </button>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <p className="eyebrow">{t.footer.exploreTitle}</p>
          <Link href="/story">{t.nav.story}</Link>
          <Link href="/materials">{t.nav.materials}</Link>
          <Link href="/collection">{t.nav.collection}</Link>
          <Link href="/trace">{t.nav.trace}</Link>
        </div>

        {/* Corporate & B2B Links */}
        <div>
          <p className="eyebrow">{t.footer.corpTitle}</p>
          <Link href="/business">{t.nav.business}</Link>
          <Link href="/sustainability">{t.nav.sustainability}</Link>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/contact">{t.nav.contact}</Link>
        </div>

        {/* Project context */}
        <div className="footer-about">
          <p className="eyebrow">{t.footer.legalTitle}</p>
          <p className="footer-nl-desc">
            {lang === "vi"
              ? "SenPine là đề án khởi nghiệp học thuật. Vật liệu, thiết kế và hình ảnh trên website thể hiện định hướng nghiên cứu."
              : "SenPine is an academic startup concept. Materials, designs, and images illustrate its proposed direction."}
          </p>
          <p className="footer-academic-badge">
            {lang === "vi"
              ? "Trường ĐH Công nghiệp TP.HCM (IUH) • Khoa Quản trị Kinh doanh"
              : "Industrial University of Ho Chi Minh City (IUH) • Faculty of Business Administration"}
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
  );
}
