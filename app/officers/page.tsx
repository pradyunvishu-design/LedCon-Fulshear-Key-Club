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
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>The President and VP lead the club day-to-day — running meetings, coordinating with the district, and making sure our goals for the year actually get done. They&apos;re the main point of contact between the club, the school, and the Texas-Oklahoma District.</p>
          </div>
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid rgba(100,149,237,0.2)", background: "rgba(10,15,30,0.6)" }}>
            <h4 style={{ color: "rgba(100,149,237,1)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Secretary & Treasurer</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>The Secretary keeps track of member hours, meeting attendance, and minutes — so if you have a question about your hours balance, they&apos;re your go-to. The Treasurer handles the club budget, collects dues, and makes sure we have what we need to keep running events all year.</p>
          </div>
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(10,15,30,0.6)" }}>
            <h4 style={{ color: "var(--gold)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>Editor & Webmaster</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>The Editor captures every event through photos and keeps our social media and newsletter up to date. The Webmaster built and maintains this site — making sure members always have access to the latest resources, sign-ups, and club info.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
