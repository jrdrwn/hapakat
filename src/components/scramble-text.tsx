"use client";

import { useCallback, useEffect, useRef } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "0123456789";

function randomCharacter(character: string) {
  if (/[0-9]/.test(character)) return digits[Math.floor(Math.random() * digits.length)];
  if (/[A-Z]/.test(character)) return letters[Math.floor(Math.random() * letters.length)];
  if (/[a-z]/.test(character)) return letters[Math.floor(Math.random() * letters.length)].toLowerCase();
  return character;
}

export function ScrambleText({ text, block = false, delay = 0, onEnter = true }: { text: string; block?: boolean; delay?: number; onEnter?: boolean }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const timerRef = useRef(0);

  const scramble = useCallback((mode: "enter" | "interactive") => {
    const root = rootRef.current;
    const visual = visualRef.current;
    if (!root || !visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.clearTimeout(timerRef.current);
    cancelAnimationFrame(frameRef.current);
    const characters = Array.from(text);
    const positions = characters.map((character, index) => /[a-z0-9]/i.test(character) ? index : -1).filter((index) => index >= 0);
    for (let index = positions.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [positions[index], positions[other]] = [positions[other], positions[index]];
    }
    const activePositions = positions.slice(0, Math.max(1, Math.ceil(positions.length * (mode === "enter" ? .45 : .32))));
    const revealOrder = new Map(activePositions.map((position, index) => [position, index]));
    const duration = mode === "enter" ? Math.min(600, 360 + characters.length * 8) : 180;
    let started = 0;
    let lastFrame = 0;

    root.classList.add("is-scrambling");
    function tick(now: number) {
      if (!started) started = now;
      const progress = Math.min(1, (now - started) / duration);
      if (now - lastFrame >= 32 || progress === 1) {
        const revealed = Math.floor(progress * activePositions.length);
        visual!.textContent = characters.map((character, index) =>
          !revealOrder.has(index) || revealOrder.get(index)! < revealed ? character : randomCharacter(character)
        ).join("");
        lastFrame = now;
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else {
        visual!.textContent = text;
        root!.classList.remove("is-scrambling");
      }
    }
    frameRef.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (!onEnter) return () => {
      window.clearTimeout(timerRef.current);
      cancelAnimationFrame(frameRef.current);
    };
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        timerRef.current = window.setTimeout(() => scramble("enter"), delay);
      } else if (!entry.isIntersecting) {
        window.clearTimeout(timerRef.current);
      }
      visible = entry.isIntersecting;
    }, { threshold: .35 });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timerRef.current);
      cancelAnimationFrame(frameRef.current);
    };
  }, [delay, onEnter, scramble]);

  return <span
    ref={rootRef}
    className={block ? "scramble-text scramble-text-block" : "scramble-text"}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") scramble("interactive"); }}
    onPointerDown={() => scramble("interactive")}
  >
    <span className="scramble-text-ghost" aria-hidden="true">{text}</span>
    <span className="scramble-text-visual" ref={visualRef} aria-hidden="true">{text}</span>
    <span className="scramble-text-accessible">{text}</span>
  </span>;
}
