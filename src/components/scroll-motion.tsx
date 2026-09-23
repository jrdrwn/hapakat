"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });

    function register() {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight * .95 && bounds.bottom > 0) element.classList.add("is-visible");
        else observer.observe(element);
      });
    }

    register();
    document.documentElement.classList.add("motion-ready");
    const mutations = new MutationObserver(register);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
