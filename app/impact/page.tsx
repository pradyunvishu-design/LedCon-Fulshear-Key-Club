"use client";

import { useEffect } from "react";
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
      
      {/* EXPANDED INFO SECTION */}
      <div className="section-wrapper" style={{ marginTop: "4rem" }}>
        <h3 style={{ fontSize: "1.8rem", color: "white", marginBottom: "2rem", textAlign: "center" }}>Where We Serve</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ padding: "2rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", borderLeft: "4px solid var(--gold)" }}>
            <h4 style={{ color: "white", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Child Health & Wellness</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1rem" }}>We regularly partner with local children's hospitals and pediatric centers. Activities include making cards, packing care kits, and setting up toy drives during the holidays.</p>
            <span style={{ fontSize: "0.8rem", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>520+ Hours</span>
          </div>

          <div style={{ padding: "2rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", borderLeft: "4px solid rgba(100,149,237,1)" }}>
            <h4 style={{ color: "white", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Environmental Preservation</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1rem" }}>Through community clean-ups, park revitalizations, and recycling drives, we ensure our local environment remains beautiful and sustainable for future generations.</p>
            <span style={{ fontSize: "0.8rem", color: "rgba(100,149,237,1)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>410+ Hours</span>
          </div>

          <div style={{ padding: "2rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", borderLeft: "4px solid var(--gold)" }}>
            <h4 style={{ color: "white", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Food Security & Assistance</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1rem" }}>By volunteering at the Houston Food Bank and local pantries, we help pack and distribute meals to families facing food insecurity in the greater Fulshear area.</p>
            <span style={{ fontSize: "0.8rem", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>917+ Hours</span>
          </div>

        </div>
      </div>
    </main>
  );
}
