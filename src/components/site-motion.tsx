"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/lib/motion-context";
import { useLanguage } from "@/lib/language-context";

type Scene = "botanical" | "narrative" | "weave" | "runway" | "atelier" | "scan" | "blueprint" | "leaf" | "orbit" | "connect" | "keepsake" | "cart" | "form";

function sceneFor(path: string): Scene {
  if (path === "/") return "botanical";
  if (path.startsWith("/products/")) return "atelier";
  if (path.startsWith("/business/request-")) return "form";
  const scenes: Record<string, Scene> = { story: "narrative", materials: "weave", collection: "runway", trace: "scan", careers: "blueprint", business: "blueprint", sustainability: "leaf", about: "orbit", contact: "connect", saved: "keepsake", experience: "cart" };
  return scenes[path.split("/")[1]] || "botanical";
}

function BotanicalIntro() {
  const { finishIntro, reduced } = useMotion();
  const { lang } = useLanguage();
  const skip = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(finishIntro, reduced ? 1600 : 3100);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishIntro();
      // The skip button is the only focusable control in the intro.
      if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [finishIntro, reduced]);

  return (
    <div className="botanical-intro" role="dialog" aria-modal="true" aria-labelledby="intro-name">
      <div className="intro-grain" aria-hidden="true" />
      <span className="intro-corner intro-corner-top" aria-hidden="true">VIETNAM · BOTANICAL TEXTILES</span>
      <div className="intro-center">
        <svg className="intro-flower" viewBox="0 0 320 280" fill="none" aria-hidden="true">
          <g className="intro-threads" stroke="currentColor" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} pathLength="1" style={{ animationDelay: `${i * 0.06}s` }} d={`M ${22 + i * 46} 276 C ${38 + i * 36} 224, ${128 + i * 9} 226, 160 186`} />)}
          </g>
          <g className="intro-petals" stroke="currentColor" strokeWidth="1.4">
            <path pathLength="1" d="M160 186 C104 148 124 70 160 24 C196 70 216 148 160 186Z" />
            <path pathLength="1" d="M160 186 C87 171 64 112 69 66 C118 78 156 125 160 186Z" />
            <path pathLength="1" d="M160 186 C233 171 256 112 251 66 C202 78 164 125 160 186Z" />
            <path pathLength="1" d="M160 186 C84 208 38 168 22 122 C80 112 136 139 160 186Z" />
            <path pathLength="1" d="M160 186 C236 208 282 168 298 122 C240 112 184 139 160 186Z" />
            <path pathLength="1" d="M106 198 Q160 225 214 198 M160 62 L160 185" />
          </g>
          <circle className="intro-seed" cx="160" cy="186" r="4" fill="currentColor" />
        </svg>
        <h2 id="intro-name" className="intro-name">SenPine<span>.</span></h2>
        <p className="intro-tagline">{lang === "vi" ? "Từ tự nhiên. Dệt nên tương lai." : "From nature. Weaving the future."}</p>
        <div className="intro-rule" aria-hidden="true"><span /></div>
      </div>
      <span className="intro-corner intro-corner-bottom" aria-hidden="true">LOTUS × PINEAPPLE</span>
      <button ref={skip} className="intro-skip" onClick={finishIntro}>{lang === "vi" ? "Bỏ qua intro" : "Skip intro"}<ArrowUp size={15} /></button>
    </div>
  );
}

const revealSelector = [
  ".page-section-heading > *", ".editorial-card", ".editorial-prose > *", ".fact-grid > article",
  ".story-timeline > article", ".about-timeline > article", ".compare-table > div", ".business-choice > a",
  ".material-detail-body > div:first-child > *", ".product-story > div > *", ".about-statement > div:last-child > p",
  ".sustainability-split > div:first-child > p", ".form-page > div:first-child > *", ".contact-links > a",
  ".business-form > *", ".trace-lookup > *", ".trace-definition > div", ".checkout-section-head > *",
  ".checkout-items > article", ".checkout-summary > *", ".saved-heading > *", ".empty-editorial > *",
  ".cta-band > div > *", ".cta-band > .button", ".collection-filter", ".page-section > .page-note",
  ".form-complete > *", ".checkout-success > *", ".inline-status", ".field-error",
  ".detail-facts > div", ".detail-actions > *", ".document-figure",
].join(", ");

const breathingSelector = [
  ".origin-panel > img", ".material-photo > img", ".product-image", ".material-artwork",
  ".page-hero-image > img", ".story-photo > img", ".sustainability-image > img",
  ".story-collage-main > img", ".story-origin-photo > img", ".story-stage-image > img",
  ".journey-figure-slide > img", ".journey-stage-number", ".business-visual > img",
  ".business-visual-mark", ".passport", ".brand-mark", ".round-arrow > svg", ".empty-editorial > svg",
].join(", ");

export function SiteMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { enabled, intro, reduced } = useMotion();
  const { lang } = useLanguage();
  const content = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const scene = sceneFor(pathname);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "enabled";
    return () => { delete document.documentElement.dataset.motion; };
  }, [reduced]);

  useEffect(() => {
    const root = content.current;
    if (!root || !enabled || intro !== "done") return;
    const observed = new Set<HTMLElement>();
    let sequence = 0;
    const clear = (element: HTMLElement) => {
      delete element.dataset.breathing;
      delete element.dataset.breathVisible;
      element.style.removeProperty("--breath-duration");
      element.style.removeProperty("--breath-delay");
    };
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        (entry.target as HTMLElement).dataset.breathVisible = String(entry.isIntersecting);
      });
    }, { rootMargin: "48px 0px", threshold: 0.02 });
    const scan = () => {
      for (const element of observed) {
        if (!root.contains(element)) { visibility.unobserve(element); clear(element); observed.delete(element); }
      }
      root.querySelectorAll<HTMLElement>(breathingSelector).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.dataset.breathing = "true";
        element.dataset.breathVisible = "false";
        // Offset each rhythm so the page never expands and contracts in unison.
        element.style.setProperty("--breath-duration", `${6.4 + (sequence % 5) * 0.6}s`);
        element.style.setProperty("--breath-delay", `${-(sequence % 7) * 0.8}s`);
        sequence += 1;
        visibility.observe(element);
      });
    };
    const updatePageVisibility = () => { root.dataset.breathingState = document.hidden ? "paused" : "running"; };
    const changes = new MutationObserver(scan);
    scan();
    updatePageVisibility();
    changes.observe(root, { childList: true, subtree: true });
    document.addEventListener("visibilitychange", updatePageVisibility);
    return () => {
      changes.disconnect();
      visibility.disconnect();
      observed.forEach(clear);
      delete root.dataset.breathingState;
      document.removeEventListener("visibilitychange", updatePageVisibility);
    };
  }, [pathname, enabled, intro]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0})`;
      });
    };
    const resize = new ResizeObserver(update);
    resize.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener("scroll", update); };
  }, [pathname]);

  useEffect(() => {
    if (!enabled || intro !== "done" || pathname === "/") return;
    gsap.registerPlugin(ScrollTrigger);
    let context: gsap.Context | undefined;
    let observer: MutationObserver | undefined;
    let scan = () => {};
    const animations = new Map<HTMLElement, gsap.core.Tween>();
    const seen = new WeakSet<HTMLElement>();
    const frame = requestAnimationFrame(() => {
      const main = content.current?.querySelector("main");
      if (!main) return;
      const narrow = window.matchMedia("(max-width: 700px)").matches;
      const variants: Partial<Record<Scene, gsap.TweenVars>> = {
        narrative: { x: -32, y: 14 }, weave: { y: 28, clipPath: "inset(0 0 14% 0)" },
        runway: { y: 52, rotation: narrow ? 0 : 1.2 }, atelier: { y: 24, scale: 0.97 },
        scan: { y: 15, clipPath: "inset(0 100% 0 0)" }, blueprint: { x: 28, y: 16 },
        leaf: { y: 36, rotation: narrow ? 0 : -1.5 }, orbit: { y: 30, scale: 0.95 },
        connect: { y: 24 }, keepsake: { y: 25, scale: 0.96 }, cart: { x: 22 }, form: { y: 22 },
      };
      const from = reduced ? {} : variants[scene] || { y: 52 };
      context = gsap.context(() => {
        const copy = main.querySelectorAll(".page-hero-copy > *, .detail-copy > :not(.detail-facts):not(.detail-actions), .trace-detail-head > *");
        gsap.from(copy, { y: reduced ? 0 : 44, opacity: 0, duration: reduced ? 0.6 : 1.1, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity" });
        const words = main.querySelectorAll(".motion-word > span");
        if (words.length && !reduced) gsap.from(words, { yPercent: 115, rotation: scene === "runway" ? 3 : 0, duration: 1.3, stagger: 0.045, delay: 0.18, ease: "power4.out", clearProps: "transform" });
        const artwork = main.querySelector(".page-hero-image, .detail-artwork, .trace-detail-banner");
        if (artwork) {
          const mask = scene === "weave" ? "inset(0 100% 0 0)" : scene === "leaf" || scene === "orbit" ? "inset(12% 12% 12% 12% round 45%)" : "inset(0 0 100% 0)";
          gsap.from(artwork, { ...(reduced ? {} : { clipPath: mask }), opacity: 0, duration: reduced ? 0.7 : 1.6, ease: "power3.inOut", clearProps: "clipPath,opacity" });
        }
        const images = main.querySelectorAll(".page-hero-image > img, .story-photo > img, .sustainability-image > img");
        if (!reduced) images.forEach((image) => {
          gsap.fromTo(image, { scale: 1.15, yPercent: -4 }, { scale: 1.04, yPercent: 4, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        });
        main.querySelectorAll(".story-timeline, .about-timeline").forEach((timeline) => {
          gsap.fromTo(timeline, { "--timeline-progress": 0 }, { "--timeline-progress": 1, ease: "none", scrollTrigger: { trigger: timeline, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
        });
        scan = () => {
          // React can replace cards, form success messages, and saved items without a route change.
          for (const [element, tween] of animations) {
            if (!element.isConnected) { tween.scrollTrigger?.kill(); tween.kill(); animations.delete(element); }
          }
          main.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
            if (seen.has(element)) return;
            seen.add(element);
            const parentCard = element.parentElement?.closest(".editorial-card, .fact-grid > article, .story-timeline > article");
            if (parentCard) return;
            // Controls fade in without moving their hit areas during an interaction.
            const stableControl = element.matches(".collection-filter, .business-form > *, .trace-lookup > *, .checkout-summary > form, .detail-actions > *");
            const tween = gsap.from(element, {
              ...(stableControl ? {} : from), opacity: 0, duration: stableControl || reduced ? 0.55 : 1.1, delay: element.matches(".editorial-card, .fact-grid > article") ? (index % 3) * 0.12 : 0,
              ease: "power3.out", clearProps: "transform,opacity,clipPath",
              scrollTrigger: { trigger: element, start: "top 95%", once: true },
            });
            animations.set(element, tween);
          });
        };
        scan();
        gsap.from(content.current?.querySelectorAll(".footer-main > *") || [], { y: reduced ? 0 : 44, opacity: 0, duration: 1, stagger: 0.12, clearProps: "transform,opacity", scrollTrigger: { trigger: content.current?.querySelector(".footer"), start: "top 94%", once: true } });
      }, content);
      // Record animations created by later observer callbacks in the same cleanup context.
      context.add("rescan", () => {
        scan();
        ScrollTrigger.refresh();
      });
      observer = new MutationObserver(() => context?.rescan());
      observer.observe(main, { childList: true, subtree: true });
    });
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (const [element, tween] of animations) {
        if (element.contains(event.target)) { tween.delay(0).progress(1); }
      }
    };
    document.addEventListener("focusin", onFocus);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); context?.revert(); document.removeEventListener("focusin", onFocus); };
  }, [pathname, scene, enabled, intro, reduced, lang]);

  return (
    <>
      <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>
      <div ref={content} className="motion-content" data-scene={scene} inert={intro === "playing"}>
        {children}
      </div>
      {intro === "playing" && <BotanicalIntro />}
      {intro === "done" && <div key={`arrival:${pathname}`} className={`route-arrival route-arrival-${scene}`} aria-hidden="true"><Sparkles size={30} /></div>}
    </>
  );
}
