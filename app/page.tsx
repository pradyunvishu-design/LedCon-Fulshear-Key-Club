"use client";

import { useEffect } from "react";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import OfficersSection from "@/components/officers-section";
import DivisionSection from "@/components/division-section";
import LinksSection from "@/components/links-section";
import ContactSection from "@/components/contact-section";
import ImpactSection from "@/components/impact-section";
import dynamic from "next/dynamic";

const CinematicIntro = dynamic(() => import("@/components/cinematic-intro"), { ssr: false });

export default function Home() {
  // Intersection Observer for fade-in animations
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CinematicIntro />
      <HeroSection />
      <AboutSection />
      <DivisionSection />
      <ImpactSection />
      <OfficersSection />
      <LinksSection />
      <ContactSection />
    </>
  );
}
