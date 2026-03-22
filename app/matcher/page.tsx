"use client";

export default function MatcherPage() {
  return (
    <main className="flex-grow pb-16" style={{ paddingTop: "7rem", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        .matcher-hero {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 2;
        }
        .matcher-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .matcher-title .highlight {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .quiz-shell {
          max-width: 700px;
          margin: 0 auto;
          background: rgba(10, 15, 30, 0.6);
          border-radius: 24px;
          border: 1px solid rgba(100, 149, 237, 0.2);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
          position: relative;
          z-index: 2;
        }
        .quiz-top {
          padding: 2.5rem 2.5rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .quiz-step {
          padding: 2.5rem;
        }
        .quiz-q {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }
        .quiz-q-sub {
          font-size: 0.9rem;
          color: var(--silver);
          opacity: 0.8;
          margin-bottom: 2rem;
        }
        .quiz-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .quiz-option {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .quiz-option:hover {
          background: rgba(201,168,76,0.1);
          border-color: rgba(201,168,76,0.5);
        }
        .quiz-checkbox {
          width: 18px; height: 18px;
          border-radius: 4px;
          border: 1.5px solid rgba(255,255,255,0.3);
        }
        .btn-matcher {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; padding: 1.2rem;
          background: linear-gradient(135deg, var(--gold), #d4b04a);
          color: #050d1a; font-weight: 800; font-size: 1rem;
          letter-spacing: 0.05em; border-radius: 12px; border: none;
          cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;
          text-transform: uppercase;
        }
        .btn-matcher:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(201,168,76,0.4);
        }
        @media(max-width: 600px) {
          .quiz-options-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Background elements */}
      <div style={{ position: "absolute", top: "20%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(26,58,143,0.15) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 2 }}>
        <div className="matcher-hero">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "var(--gold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", padding: "6px 14px", borderRadius: "99px", marginBottom: "1.5rem" }}>
            Volunteer Matcher
          </div>
          <h1 className="matcher-title">Find Your Perfect <br/><span className="highlight">Service Match.</span></h1>
          <p style={{ color: "var(--silver)", maxWidth: "520px", margin: "0 auto", lineHeight: "1.7", fontSize: "1.05rem", opacity: 0.8 }}>
            5 quick questions. Our algorithm scores every upcoming event against your answers and recommends your best-fit projects.
          </p>
        </div>

        <div className="quiz-shell">
          <div className="quiz-top">
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: "20%", height: "100%", background: "var(--gold)", borderRadius: "99px" }}></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--silver)" }}>
              <span>Step 1 of 5</span>
              <span style={{ color: "var(--gold)" }}>20%</span>
            </div>
          </div>
          
          <div className="quiz-step">
            <h2 className="quiz-q">What causes are you passionate about?</h2>
            <p className="quiz-q-sub">Select all that apply — you can choose multiple.</p>
            
            <div className="quiz-options-grid" style={{ marginBottom: "2rem" }}>
              <div className="quiz-option"><div className="quiz-checkbox"></div> Children & Youth</div>
              <div className="quiz-option"><div className="quiz-checkbox"></div> Environment</div>
              <div className="quiz-option"><div className="quiz-checkbox"></div> Elderly Care</div>
              <div className="quiz-option"><div className="quiz-checkbox"></div> Education & Tutoring</div>
              <div className="quiz-option"><div className="quiz-checkbox"></div> Hunger & Food</div>
              <div className="quiz-option"><div className="quiz-checkbox"></div> Health & Wellness</div>
            </div>

            <button className="btn-matcher">Continue →</button>
          </div>
        </div>
      </div>
    </main>
  );
}
