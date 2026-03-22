"use client";

import { useEffect } from "react";
import OfficersSection from "@/components/officers-section";

export default function OfficersPage() {
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
      <OfficersSection />
      
      {/* EXPANDED INFO SECTION */}
      <div className="section-wrapper" style={{ marginTop: "4rem" }}>
        <h3 style={{ fontSize: "1.8rem", color: "white", marginBottom: "1.5rem", textAlign: "center" }}>Officer Roles & Responsibilities</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(10,15,30,0.6)" }}>
            <h4 style={{ color: "var(--gold)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>President & Vice President</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>The President and VP oversee all club operations, coordinate with the district, run meetings, and ensure that our Key Club goals for the year are successfully executed. They are the primary liaisons between the club and school administration.</p>
          </div>
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid rgba(100,149,237,0.2)", background: "rgba(10,15,30,0.6)" }}>
            <h4 style={{ color: "rgba(100,149,237,1)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Secretary & Treasurer</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>The Secretary tracks all member service hours, attendance, and meeting minutes. The Treasurer manages the club budget, collects dues, and organizes fundraising events to keep our service mission fully funded.</p>
          </div>
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(10,15,30,0.6)" }}>
            <h4 style={{ color: "var(--gold)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Editor & Webmaster</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>The Editor runs the club's social media accounts, newsletter, and publications, taking photos at every event. The Webmaster maintains the official website, ensuring members have access to up-to-date resources and digital tools.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
