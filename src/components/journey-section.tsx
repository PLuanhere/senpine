"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "@/lib/content";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/i18n";
import { useMotion } from "@/lib/motion-context";

const STAGE_DURATION = 4000;

export function JourneySection() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [playback, setPlayback] = useState({ index: 0, direction: 1 });
  const current = playback.index;
  const section = useRef<HTMLElement>(null);
  const nextChangeAt = useRef(0);
  const { enabled, intro } = useMotion();
  const selectedStep = journey[current];

  useEffect(() => {
    if (!enabled || intro !== "done" || !section.current) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      nextChangeAt.current = Date.now() + STAGE_DURATION;
    }, { threshold: 0.1 });
    observer.observe(section.current.querySelector(".journey-stages") ?? section.current);
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (!visible || document.hidden || document.querySelector("dialog[open], .mobile-nav")) {
        nextChangeAt.current = now + STAGE_DURATION;
        return;
      }
      if (now < nextChangeAt.current) return;
      nextChangeAt.current = now + STAGE_DURATION;
      setPlayback(({ index, direction }) => {
        const nextDirection = index === journey.length - 1 ? -1 : index === 0 ? 1 : direction;
        return { index: index + nextDirection, direction: nextDirection };
      });
    }, 250);
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
                    src={step.image}
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
                    onClick={() => {
                      nextChangeAt.current = Date.now() + STAGE_DURATION;
                      setPlayback((previous) => ({ ...previous, index }));
                    }}
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
