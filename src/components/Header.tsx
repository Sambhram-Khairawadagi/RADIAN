"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { assets } from "@/config/assets";
import { navigation } from "@/config/project";
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const links = Array.from(
          panel.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
        );
        const all = [toggle.current, ...links].filter(Boolean) as HTMLElement[];
        const index = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index === 0) {
          e.preventDefault();
          all.at(-1)?.focus();
        }
        if (!e.shiftKey && index === all.length - 1) {
          e.preventDefault();
          all[0]?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1050) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };
  return (
    <header
      className={`header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
    >
      <a className="brand" href="#top" aria-label="Radian by V Venturez — home">
        {assets.developerLogo ? (
          <Image
            src={assets.developerLogo.src}
            width={112}
            height={56}
            alt={assets.developerLogo.alt}
            className="brand-logo"
            priority
          />
        ) : (
          <span>V Venturez</span>
        )}
        <span className="brand-divider" />
        <span className="project-name">
          RADIAN<span>BOMMASANDRA · BENGALURU</span>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(([label, id]) => (
          <a href={`#${id}`} key={id}>
            {label}
          </a>
        ))}
      </nav>
      <a className="button nav-cta" href="#contact">
        Enquire now
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav
          ref={panel}
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {navigation.map(([label, id], i) => (
            <a href={`#${id}`} key={id} onClick={close}>
              <span>0{i + 1}</span>
              {label}
            </a>
          ))}
          <a href="#contact" className="button" onClick={close}>
            Enquire now
          </a>
        </nav>
      )}
    </header>
  );
}
