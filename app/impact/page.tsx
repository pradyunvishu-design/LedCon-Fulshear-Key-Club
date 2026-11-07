"use client";

import { useEffect } from "react";
import { recurringEvents } from "@/lib/club-events";
import Link from "next/link";
import ImpactSection from "@/components/impact-section";

export default function ImpactPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <main className="flex-grow pt-12 pb-24" style={{ minHeight: "100vh", position: "relative" }}>
      <ImpactSection />
      
      <div className="section-wrapper" style={{ marginTop: "4rem", paddingBottom: "4rem" }}>
        <h2 className="section-heading" style={{ textAlign: "center" }}>Ways to Serve</h2>
        <div style={{ display: "grid", gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
          {recurringEvents.map(event => <article key={event.title} className="glass-card" style={{ padding: "2rem" }}>
            <h3 style={{ color: "var(--gold)", marginBottom: "0.75rem" }}>{event.title}</h3>
            <p style={{ color: "var(--silver)" }}>{event.desc}</p>
          </article>)}
          <Link href="/calendar" className="btn-primary" style={{ justifySelf: "center" }}>See dates & sign-ups →</Link>
        </div>
      </div>
    </main>
  );
}
