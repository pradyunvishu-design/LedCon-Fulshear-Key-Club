"use client";

import { useEffect } from "react";
import AboutSection from "@/components/about-section";
import DivisionSection from "@/components/division-section";

export default function AboutPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <main className="flex-grow pt-8">
      <AboutSection />
      <DivisionSection />
    </main>
  );
}
