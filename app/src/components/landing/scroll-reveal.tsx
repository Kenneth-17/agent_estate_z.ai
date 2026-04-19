"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
}

export default function ScrollReveal({ children }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    container.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
