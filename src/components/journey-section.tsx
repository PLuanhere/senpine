"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/lib/content";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/i18n";
import { useMotion } from "@/lib/motion-context";

export function JourneySection() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [current, setCurrent] = useState(0);
  const section = useRef<HTMLElement>(null);
  const pauseUntil = useRef(0);
  const { enabled, intro } = useMotion();
  const selectedStep = journey[current];

  useEffect(() => {
    if (!enabled || intro !== "done" || !section.current) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.25 });
    observer.observe(section.current);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden || Date.now() < pauseUntil.current || section.current?.querySelector(".journey-stage-button:hover, .journey-stage-button:focus-visible") || document.querySelector("dialog[open], .mobile-nav")) return;
      setCurrent((index) => (index + 1) % journey.length);
    }, 4800);
    return () => { observer.disconnect(); clearInterval(timer); };
  }, [enabled, intro]);

  return (
    <section ref={section} id="journey" className="journey section-space">
      <div className="section-top reveal">
        <p className="eyebrow">{t.journeySec.eyebrow}</p>
        <span className="section-aside">Nature → Fiber → Fabric → Fashion</span>
      </div>

      <div className="journey-layout">
        <div className="journey-intro">
          <h2>
            {lang === "vi" ? (
              <>
                Từ nguyên liệu<br />
                <em>đến tấm vải.</em>
              </>
            ) : (
              <>
                From Botanical Roots<br />
                <em>to Finished Fabric.</em>
              </>
            )}
          </h2>
          <p className="journey-lead-desc">
            {lang === "vi"
              ? "Bảy công đoạn dự kiến đưa lá dứa sau thu hoạch và cuống sen Đồng Tháp trở thành vật liệu dệt sinh học."
              : "Seven proposed stages turn post-harvest pineapple leaves and Mekong lotus stems into bio-based textiles."}
          </p>

          <figure className="journey-figure">
            <div className="journey-figure-image">
              {journey.map((step, index) => (
                <div key={step.step} className={`journey-figure-slide ${index === current ? "is-active" : ""}`} aria-hidden={index !== current}>
                  <Image
                    src={"/images/" + step.image + ".webp"}
                    alt={index === current ? lang === "vi" ? "Minh họa " + step.title.toLowerCase() : "Illustration of " + step.titleEn.toLowerCase() : ""}
                    fill
                    sizes="(max-width: 900px) 88vw, 42vw"
                    loading="eager"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <figcaption>
              <span key={`label-${selectedStep.step}`} className="journey-caption-change">{selectedStep.label}</span>
              <span key={`caption-${selectedStep.step}`} className="journey-caption-change">{selectedStep.step} / 07</span>
            </figcaption>
          </figure>

          <p className="journey-disclaimer">
            {lang === "vi"
              ? "Quy trình định hướng trong đề tài nghiên cứu; từng công đoạn cần được thử nghiệm và xác thực qua các đợt mẫu thực tế."
              : "This proposed research process requires pilot testing and verification at each stage."}
          </p>
        </div>

        <div className="journey-stages">
          <div className="journey-stages-heading">
            <span>{lang === "vi" ? "CÁC CÔNG ĐOẠN" : "THE PROCESS"}</span>
            <span key={selectedStep.step} className="journey-caption-change">{selectedStep.step} / 07</span>
          </div>
          <ol className="journey-stage-list">
            {journey.map((step, index) => {
              const isCurrent = index === current;

              return (
                <li key={step.step} className={isCurrent ? "is-active" : undefined}>
                  <button
                    type="button"
                    className="journey-stage-button"
                    id={`journey-stage-${step.step}`}
                    aria-controls={`journey-panel-${step.step}`}
                    aria-expanded={isCurrent}
                    onClick={() => { pauseUntil.current = Date.now() + 10000; setCurrent(index); }}
                  >
                    <span className="journey-stage-number">{step.step}</span>
                    <span className="journey-stage-title">{lang === "vi" ? step.title : step.titleEn}</span>
                    <span className="journey-stage-symbol" aria-hidden="true" />
                  </button>
                  <div
                    className="journey-stage-panel"
                    id={`journey-panel-${step.step}`}
                    role="region"
                    aria-labelledby={`journey-stage-${step.step}`}
                    aria-hidden={!isCurrent}
                    inert={!isCurrent}
                    onTransitionEnd={(event) => {
                      if (event.target === event.currentTarget && event.propertyName === "grid-template-rows") ScrollTrigger.refresh();
                    }}
                  >
                    <div className="journey-stage-panel-inner">
                      <div className="journey-stage-detail">
                        <p className="journey-stage-label">{step.label}</p>
                        <p>{lang === "vi" ? step.text : step.textEn}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
