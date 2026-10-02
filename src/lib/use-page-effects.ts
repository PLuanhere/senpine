"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/lib/motion-context";

type Scene = "careers" | "career-detail" | "contact";
type Plan = [string, gsap.TweenVars];

const plans: Record<Scene, Plan[]> = {
  careers: [
    [".cr-section-heading", { y: 80, clipPath: "inset(0 0 100% 0)", duration: 1.25 }],
    [".cr-filters, .cr-results-heading, .cr-positions > .cr-plan-note", { y: 25 }],
    [".cr-job-card", { x: -70, clipPath: "inset(0 12% 0 0)", duration: 1.2 }],
    [".cr-life-image", { scale: .86, clipPath: "inset(22% 15% 22% 15%)", rotation: -3, duration: 1.6 }],
    [".cr-life-copy > *", { x: 52 }],
    [".cr-benefits article", { y: 95, rotationX: 40, duration: 1.3 }],
    [".cr-process-steps li", { y: 65, scale: .9, duration: 1.1 }],
    [".cr-faq > div:first-child", { x: -48 }],
    [".cr-questions details", { clipPath: "inset(0 12% 0 0)" }],
    [".cr-bottom-cta > *", { y: 45 }],
  ],
  "career-detail": [
    [".cr-role-summary, .cr-candidate-checklist", {}],
    [".cr-detail-content > section > :is(.eyebrow, h2, p, ul)", { y: 18 }],
    [".cr-document-tip", { x: -20 }],
    [".cr-application-form", {}],
    [".cr-other-roles > :is(p, h2)", { y: 25 }],
    [".cr-other-roles > div > a", { clipPath: "inset(0 0 20% 0)" }],
  ],
  contact: [
    [".ct-section-heading, .ct-next-heading", { y: 75, clipPath: "inset(0 0 100% 0)", duration: 1.3 }],
    [".ct-channel-card", { x: -65, rotation: -4, clipPath: "inset(0 32% 0 0)", duration: 1.25 }],
    [".ct-contact-info-note", { y: 46 }],
    [".ct-topic-card", { y: 75, rotationX: 50, duration: 1.3 }],
    [".ct-message-intro > :is(p, h2)", { x: -48 }],
    [".ct-guidance", { y: 32 }],
    [".ct-channel-note", { x: -35 }],
    [".ct-form-shell", { y: 45, clipPath: "inset(0 0 100% 0)", duration: 1.5 }],
    [".ct-next-steps li", { x: 48 }],
    [".ct-faq-intro", { y: 46 }],
    [".ct-faq-list details", { x: 55, duration: 1.1 }],
    [".ct-project-mark", { scale: .65, rotation: -20, duration: 1.5 }],
    [".ct-project-copy > *", { y: 20 }],
    [".ct-review > :not(.ct-review-title)", {}],
  ],
};

/** Owns scroll reveals, pointer decoration and cleanup for each route. */
export function usePageEffects(root: RefObject<HTMLElement | null>, scene: Scene) {
  const { enabled, intro } = useMotion();
  // These pages autoplay in the same full-motion state as the former enable button.
  const moving = enabled && intro === "done";

  useEffect(() => {
    const element = root.current;
    if (!element || !moving) return;
    gsap.registerPlugin(ScrollTrigger);
    const reveals = new Map<HTMLElement, gsap.core.Tween>();
    const seen = new WeakSet<HTMLElement>();
    const visible = new Set<HTMLElement>();
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let layoutFrame = 0;
    let pointerFrame = 0;
    let pointerTarget: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let disposed = false;
    const refresh = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const viewport = new IntersectionObserver((entries) => entries.forEach((entry) => {
      (entry.target as HTMLElement).dataset.motionVisible = String(entry.isIntersecting);
    }), { rootMargin: "80px", threshold: .02 });

    let contextCounterCleanup: () => void = () => {};
    const context = gsap.context(() => {
      if (scene === "careers") {
        gsap.from(".cr-hero-copy > *", { opacity: 0, y: 26, stagger: .11, duration: .95, ease: "power3.out", clearProps: "opacity,transform" });
        gsap.from(".cr-hero-photo", { clipPath: "inset(0 0 100% 0)", duration: 1.35, ease: "power3.inOut", clearProps: "clipPath" });
        gsap.from(".cr-photo-note > *", { opacity: 0, y: 15, stagger: .12, delay: .4, duration: .8, clearProps: "opacity,transform" });
        gsap.fromTo(".cr-hero-photo img", { scale: 1.1, yPercent: -4 }, { scale: 1.035, yPercent: 4, ease: "none", scrollTrigger: { trigger: ".cr-hero", start: "top top", end: "bottom top", scrub: .8 } });
        gsap.fromTo(".cr-life-image img", { scale: 1.09, yPercent: -3 }, { scale: 1.035, yPercent: 3, ease: "none", scrollTrigger: { trigger: ".cr-life", start: "top bottom", end: "bottom top", scrub: 1 } });
        const number = element.querySelector<HTMLElement>(".cr-count");
        if (number) {
          const final = number.textContent || "07";
          const counter = { value: 0 };
          gsap.to(counter, { value: Number(final), duration: 1.15, ease: "power2.out", onUpdate: () => { const next = String(Math.round(counter.value)).padStart(2, "0"); if (number.textContent !== next) number.textContent = next; }, scrollTrigger: { trigger: number, start: "top 94%", once: true } });
          contextCounterCleanup = () => { number.textContent = final; };
        }
      } else if (scene === "contact") {
        gsap.from(".ct-hero-copy > *", { opacity: 0, y: 30, stagger: .11, duration: 1, ease: "power3.out", clearProps: "opacity,transform" });
        gsap.from(".ct-picture-inner", { y: 50, rotation: 4, scale: .95, opacity: 0, duration: 1.35, ease: "power3.out", clearProps: "opacity,transform" });
        gsap.from(".ct-note-inner", { y: 65, rotation: -14, opacity: 0, delay: .25, duration: 1.35, ease: "power3.out", clearProps: "opacity,transform" });
        gsap.to(".ct-hero-image", { scale: 1.12, yPercent: 4, ease: "none", scrollTrigger: { trigger: ".ct-hero", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.to(".ct-floating-note", { y: -65, x: -22, rotation: -7, ease: "none", scrollTrigger: { trigger: ".ct-hero", start: "top top", end: "bottom top", scrub: .9 } });
        gsap.fromTo(".ct-threads path", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, stagger: .09, ease: "power2.out", clearProps: "strokeDasharray,strokeDashoffset" });
      } else {
        gsap.from(".cr-detail-hero > *", { opacity: 0, y: 20, stagger: .08, duration: .8, clearProps: "opacity,transform" });
      }
      element.querySelectorAll<HTMLElement>(".cr-process-steps, .ct-next-steps").forEach((steps) => {
        gsap.fromTo(steps, { "--motion-progress": 0 }, { "--motion-progress": 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 85%", end: "bottom 60%", scrub: .65 } });
      });
    }, root);

    context.add("scanEffects", () => {
      for (const [node, tween] of reveals) {
        if (!element.contains(node)) { tween.scrollTrigger?.kill(); tween.kill(); reveals.delete(node); }
      }
      for (const node of visible) { if (!element.contains(node)) { viewport.unobserve(node); visible.delete(node); } }
      plans[scene].forEach(([selector, variant]) => {
        element.querySelectorAll<HTMLElement>(selector).forEach((node, index) => {
          if (seen.has(node)) return;
          seen.add(node);
          // Newly mounted reviews must not hide an element already focused by the form.
          if (node.contains(document.activeElement)) return;
          const card = node.matches(".cr-job-card, .cr-benefits article, .cr-process-steps li, .ct-channel-card, .ct-topic-card, .ct-next-steps li");
          node.setAttribute("data-reveal-state", "pending");
          const tween = gsap.from(node, {
            opacity: 0, ...variant, duration: variant.duration ?? 1.1, delay: card ? (index % 4) * .12 : 0,
            ease: "power3.out", clearProps: "opacity,transform,clipPath,filter",
            onComplete: () => node.setAttribute("data-reveal-state", "shown"),
            scrollTrigger: { trigger: node, start: "top 78%", toggleActions: "restart none restart reset", onEnter: () => node.setAttribute("data-reveal-state", "entering"), onLeaveBack: () => node.setAttribute("data-reveal-state", "pending") },
          });
          reveals.set(node, tween);
        });
      });
      element.querySelectorAll<HTMLElement>("section, .cr-benefits article, .cr-process-steps li, .ct-channel-card, .ct-next-steps li").forEach((node) => {
        if (visible.has(node)) return;
        visible.add(node);
        viewport.observe(node);
      });
    });
    context.scanEffects();

    const mutation = new MutationObserver((records) => {
      if (records.every((record) => (record.target as Element).matches?.(".cr-count"))) return;
      context.scanEffects(); refresh();
    });
    mutation.observe(element, { childList: true, subtree: true });
    const resize = new ResizeObserver(refresh);
    resize.observe(element);
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      reveals.forEach((tween, node) => { if (node.contains(event.target as Element)) { tween.scrollTrigger?.kill(); tween.delay(0).progress(1); node.setAttribute("data-reveal-state", "shown"); } });
    };
    const clearPointer = () => {
      cancelAnimationFrame(pointerFrame);
      pointerTarget?.style.removeProperty("--pointer-x");
      pointerTarget?.style.removeProperty("--pointer-y");
      pointerTarget?.style.removeProperty("--pointer-dx");
      pointerTarget?.style.removeProperty("--pointer-dy");
      pointerTarget?.removeAttribute("data-pointer-active");
      pointerTarget = null;
    };
    const pointer = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>(".cr-hero-visual, .ct-hero-visual, .cr-job-card, .cr-benefits article, .cr-other-roles a, .ct-channel-card, .ct-topic-card, .ct-project-mark");
      if (target !== pointerTarget) clearPointer();
      if (!target) return;
      pointerTarget = target;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        if (!pointerTarget) return;
        const box = pointerTarget.getBoundingClientRect();
        if (!box.width || !box.height) return;
        const x = Math.max(0, Math.min(1, (pointerX - box.left) / box.width));
        const y = Math.max(0, Math.min(1, (pointerY - box.top) / box.height));
        pointerTarget.style.setProperty("--pointer-x", `${x * 100}%`);
        pointerTarget.style.setProperty("--pointer-y", `${y * 100}%`);
        pointerTarget.style.setProperty("--pointer-dx", `${(x - .5) * 12}px`);
        pointerTarget.style.setProperty("--pointer-dy", `${(y - .5) * 10}px`);
        pointerTarget.dataset.pointerActive = "true";
      });
    };
    const visibility = () => { element.setAttribute("data-motion-paused", String(document.hidden)); if (document.hidden) clearPointer(); };
    element.addEventListener("focusin", focus);
    element.addEventListener("pointermove", pointer, { passive: true });
    element.addEventListener("pointerleave", clearPointer);
    element.addEventListener("toggle", refresh, true);
    element.addEventListener("load", refresh, true);
    finePointer.addEventListener("change", clearPointer);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    return () => {
      disposed = true;
      mutation.disconnect(); resize.disconnect(); viewport.disconnect();
      cancelAnimationFrame(layoutFrame); clearPointer();
      element.removeEventListener("focusin", focus);
      element.removeEventListener("pointermove", pointer);
      element.removeEventListener("pointerleave", clearPointer);
      element.removeEventListener("toggle", refresh, true);
      element.removeEventListener("load", refresh, true);
      finePointer.removeEventListener("change", clearPointer);
      document.removeEventListener("visibilitychange", visibility);
      visible.forEach((node) => delete node.dataset.motionVisible);
      element.removeAttribute("data-motion-paused");
      context.revert(); contextCounterCleanup();
      reveals.forEach((_, node) => node.removeAttribute("data-reveal-state"));
    };
  }, [root, scene, moving]);

  return moving;
}
