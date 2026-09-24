"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const motionGroups = [
  {
    selector: "main .page-hero > .wrap",
    variant: "hero",
  },
  {
    selector: "main .story-detail-hero .detail-intro",
    variant: "detail",
  },
  {
    selector: "main .section-heading",
    variant: "heading",
  },
  {
    selector: "main .guide-step",
    variant: "chapter",
  },
  {
    selector: "main .guide-toc, main .result-count, main .form-intro, main .admin-login-card, main .admin-panel, .footer-top, .footer-bottom",
    variant: "rise",
  },
  {
    selector: "main .story-card, main .path-card, main .role-card, main .mission-card, main .listener-curated-card, main .listener-story-card:not(.listener-story-card-marquee), main .feedback-card:not(.feedback-card-marquee), main .heritage-photo-card, main .heritage-snapshot, main .guide-highlight-grid > a, main .language-result",
    variant: "pop",
  },
  {
    selector: "main .video-frame, main .guide-hero-art",
    variant: "left",
  },
  {
    selector: "main .experience-audio, main .experience-book, main .contribution-form",
    variant: "right",
  },
  {
    selector: "[data-reveal]",
    variant: "rise",
  },
  {
    selector: "main[class*='old'] section > h2, main[class*='old'] section > p, main[class*='old'] section > img, main[class*='old'] section article, main[class*='old'] section blockquote, main[class*='old'] #utama > div, main[class*='old'] #cerita-pendengar > div, main[class*='old'] #sukarelawan > div",
    variant: "rise",
  },
] as const;

const passageGroups = [
  { selector: "main .cultural-motif", mode: "motif" },
  { selector: "main .living-backdrop", mode: "backdrop" },
  { selector: "main .intro-grid, main .gallery-controls, main .listener-curated-grid, main .roles-section .section-heading, main .mission-section > .wrap > h2, main .guide-end > .wrap, main .heritage-end > .wrap, main .related-section > .wrap", mode: "out" },
  { selector: "main .home-documentation-grid, main .about-story-grid, main .heritage-story-grid, main .about-bottom-grid, main .feedback-form-side, main .language-layout, main .guide-faq-grid, main .form-layout, main .heritage-poster-grid, main .experience-section > .wrap", mode: "combo" },
] as const;

const entrances = {
  rise: { translate: "0 30px", scale: "1", rotate: "0deg" },
  pop: { translate: "0 26px", scale: ".9", rotate: "-2deg" },
  left: { translate: "-46px 12px", scale: ".96", rotate: "0deg" },
  right: { translate: "46px 12px", scale: ".96", rotate: "0deg" },
} as const;

type MotionVariant = typeof motionGroups[number]["variant"];
type PassageMode = typeof passageGroups[number]["mode"];

export function ScrollMotion() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const railProgressRef = useRef<HTMLSpanElement>(null);
  const [chapter, setChapter] = useState({ current: 1, total: 1, label: "Jelajah Hapakat" });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let previousScrollY = window.scrollY;
    let scrollDirection = 1;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    function updateProgress() {
      if (Math.abs(window.scrollY - previousScrollY) > 2) scrollDirection = window.scrollY > previousScrollY ? 1 : -1;
      previousScrollY = window.scrollY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        const progress = distance > 0 ? Math.min(1, window.scrollY / distance) : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        if (railProgressRef.current) railProgressRef.current.style.transform = `scaleY(${progress})`;
        if (sections.length) {
          const marker = window.innerHeight * .48;
          let active = 0;
          sections.forEach((section, index) => {
            if (section.getBoundingClientRect().top <= marker) active = index;
          });
          const label = sections[active].querySelector("h1, h2, .section-kicker")?.textContent?.replace(/\s+/g, " ").trim() || "Jelajah Hapakat";
          setChapter((previous) => previous.current === active + 1 && previous.total === sections.length && previous.label === label
            ? previous
            : { current: active + 1, total: sections.length, label });
        } else {
          const label = document.querySelector("main h1")?.textContent?.replace(/\s+/g, " ").trim() || "Jelajah Hapakat";
          setChapter((previous) => previous.current === 1 && previous.total === 1 && previous.label === label
            ? previous
            : { current: 1, total: 1, label });
        }
      });
    }
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("resize", updateProgress);
      };
    }

    const registered = new WeakSet<HTMLElement>();
    const passageRegistered = new WeakSet<HTMLElement>();
    const revealed = new WeakSet<HTMLElement>();
    const variants = new WeakMap<HTMLElement, MotionVariant>();
    const passageModes = new WeakMap<HTMLElement, PassageMode>();
    const passageStates = new WeakMap<HTMLElement, "visible" | "exited">();
    const running = new WeakMap<Element, Animation>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        if (revealed.has(element)) continue;
        revealed.add(element);
        observer.unobserve(element);
        const variant = variants.get(element) || "rise";
        const targets = variant === "heading"
          ? Array.from(element.querySelectorAll<HTMLElement>(".section-kicker, h2, :scope > p, :scope > a"))
          : variant === "hero"
            ? element.matches(".guide-hero-grid")
              ? Array.from(element.querySelectorAll<HTMLElement>(".guide-hero-copy > .section-kicker, .guide-hero-copy > h1, .guide-hero-copy > p, .guide-hero-copy > a"))
              : Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.matches(".section-kicker, h1, p, a"))
            : variant === "detail"
              ? Array.from(element.querySelectorAll<HTMLElement>(".section-kicker, h1, .detail-subtitle, .detail-intro-side > p, .detail-meta"))
            : variant === "chapter"
              ? Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.matches(".guide-step-number, h2, p, ol, .guide-tip, .guide-inline-link, .guide-link-row"))
          : [element];
        targets.forEach((target, index) => {
          const targetVariant = variant === "hero" || variant === "detail"
            ? target.matches(".section-kicker, .guide-step-number") ? "left" : target.matches("h1") ? "rise" : "right"
            : variant === "chapter"
              ? index % 2 === 0 ? "left" : "rise"
              : variant === "heading"
            ? target.matches(".section-kicker") ? "left" : target.matches("h2") ? "rise" : "right"
            : variant;
          const siblings = target.parentElement ? Array.from(target.parentElement.children) : [];
          const siblingIndex = Math.max(0, siblings.indexOf(target));
          const delay = variant === "heading" ? index * 85 : variant === "hero" || variant === "detail" ? index * 105 : variant === "chapter" ? index * 65 : (siblingIndex % 4) * 65;
          running.get(target)?.cancel();
          const animation = target.animate(
            [{ opacity: 0, ...entrances[targetVariant] }, { opacity: 1, translate: "0 0", scale: "1", rotate: "0deg" }],
            { duration: 650, delay, easing: "cubic-bezier(.18,.8,.22,1)", fill: "backwards" },
          );
          running.set(target, animation);
          animations.add(animation);
          animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
        });
      }
    }, { threshold: 0, rootMargin: "-5% 0px -10% 0px" });

    const passageObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const mode = passageModes.get(element);
        const state = passageStates.get(element);
        if (!mode || (entry.isIntersecting && state === "visible") || (!entry.isIntersecting && state !== "visible")) continue;
        const motif = mode === "motif";
        const backdrop = mode === "backdrop";
        const side = element.classList.contains("cultural-motif-left") ? -1 : 1;
        const motifOpacity = window.matchMedia("(max-width: 700px)").matches
          ? element.classList.contains("cultural-motif-light") ? .34 : .23
          : element.classList.contains("cultural-motif-light") ? .48 : .34;

        if (entry.isIntersecting) {
          passageStates.set(element, "visible");
          if (mode === "out" && !state) continue;
        } else {
          passageStates.set(element, "exited");
        }

        const current = getComputedStyle(element);
        const from = state
          ? { opacity: current.opacity, translate: current.translate === "none" ? "0 0" : current.translate, scale: current.scale === "none" ? "1" : current.scale, rotate: current.rotate === "none" ? "0deg" : current.rotate }
          : motif
            ? { opacity: "0", translate: `${side * 52}px 18px`, scale: ".72", rotate: `${side * 28}deg` }
            : backdrop
              ? { opacity: "0", translate: "54px 15px", scale: "1.08", rotate: "4deg" }
            : { opacity: "0", translate: "0 28px", scale: ".98", rotate: "0deg" };
        running.get(element)?.cancel();
        const to = entry.isIntersecting
          ? { opacity: motif ? motifOpacity : backdrop ? element.classList.contains("living-backdrop-home") ? .55 : element.classList.contains("living-backdrop-light") ? .56 : .8 : 1, translate: "0 0", scale: "1", rotate: "0deg" }
          : motif
            ? { opacity: 0, translate: `${side * 32}px ${scrollDirection * -32}px`, scale: ".78", rotate: `${side * 24}deg` }
            : backdrop
              ? { opacity: 0, translate: `-36px ${scrollDirection * -24}px`, scale: "1.05", rotate: "-3deg" }
            : { opacity: .62, translate: `0 ${scrollDirection * -24}px`, scale: ".985", rotate: "0deg" };
        const animation = element.animate([from, to], {
          duration: motif || backdrop ? entry.isIntersecting ? 900 : 520 : entry.isIntersecting ? 560 : 380,
          easing: "cubic-bezier(.2,.78,.24,1)",
          fill: "forwards",
        });
        running.set(element, animation);
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
        if (motif || backdrop) {
          element.querySelectorAll<SVGPathElement>(motif ? ".cultural-motif-line" : ".living-backdrop-line").forEach((path, index) => {
            const strokeDashoffset = state ? getComputedStyle(path).strokeDashoffset : "100";
            running.get(path)?.cancel();
            const lineAnimation = path.animate(
              [{ strokeDashoffset }, { strokeDashoffset: entry.isIntersecting ? "0" : "100" }],
              { duration: entry.isIntersecting ? 950 : 480, delay: entry.isIntersecting ? index * 80 : 0, easing: "cubic-bezier(.2,.78,.24,1)", fill: "forwards" },
            );
            running.set(path, lineAnimation);
            animations.add(lineAnimation);
            lineAnimation.finished.then(() => animations.delete(lineAnimation)).catch(() => animations.delete(lineAnimation));
          });
        }
      }
    }, { threshold: 0, rootMargin: "-18% 0px -18% 0px" });

    function register() {
      for (const { selector, mode } of passageGroups) {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          if (passageRegistered.has(element)) return;
          passageRegistered.add(element);
          passageModes.set(element, mode);
          passageObserver.observe(element);
        });
      }
      for (const { selector, variant } of motionGroups) {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          if (registered.has(element) || passageRegistered.has(element)) return;
          registered.add(element);
          variants.set(element, variant);
          observer.observe(element);
        });
      }
    }

    let mutationFrame = 0;
    register();
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(mutationFrame);
      mutationFrame = requestAnimationFrame(register);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(mutationFrame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      mutations.disconnect();
      observer.disconnect();
      passageObserver.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return <>
    <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
    <div className="story-rail" aria-hidden="true" title={chapter.label}>
      <span className="story-rail-sigil">✦</span>
      <span className="story-rail-count">{String(chapter.current).padStart(2, "0")} / {String(chapter.total).padStart(2, "0")}</span>
      <span className="story-rail-track"><span className="story-rail-fill" ref={railProgressRef} /></span>
      <span className="story-rail-label">ALUR CERITA</span>
    </div>
  </>;
}
