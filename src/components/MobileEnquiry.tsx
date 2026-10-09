"use client";
import { useEffect, useState } from "react";
export function MobileEnquiry() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    const contact = document.querySelector('#contact');
    const footer = document.querySelector('footer');
    if (!hero || !contact || !footer) return;
    const inView = new Map<Element, boolean>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => inView.set(entry.target, entry.isIntersecting));
      setVisible(!inView.get(hero) && !inView.get(contact) && !inView.get(footer));
    });
    [hero, contact, footer].forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <aside className="mobile-enquiry" aria-label="Quick project enquiry" hidden={!visible}>
    <div><span>YOUR NEXT ADDRESS</span><strong>Let’s talk RADIAN.</strong></div>
    <a className="button button-light" href="#contact">Enquire now ↗</a>
  </aside>;
}
