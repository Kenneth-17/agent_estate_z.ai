"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      window.scrollTo({ top: (target as HTMLElement).offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <div className="nav-mark">Z</div>
          <span>
            Agent Estate Z <span className="nav-brand-sub">&middot; Rental Passport</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#problem" onClick={(e) => handleAnchorClick(e, "#problem")}>
            Problem
          </a>
          <a href="#scenarios" onClick={(e) => handleAnchorClick(e, "#scenarios")}>
            Stories
          </a>
          <a href="#how" onClick={(e) => handleAnchorClick(e, "#how")}>
            How it works
          </a>
          <a href="#sources" onClick={(e) => handleAnchorClick(e, "#sources")}>
            Data
          </a>
          <a href="#preview" onClick={(e) => handleAnchorClick(e, "#preview")}>
            Preview
          </a>
        </div>
        <div className="nav-cta">
          <Link href="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link href="/login?new=1" className="btn-solid">
            Get started &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}
