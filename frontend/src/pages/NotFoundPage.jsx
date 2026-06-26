import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "480px", padding: "0 24px" }}>
        <div style={{ fontSize: "clamp(80px,15vw,140px)", fontWeight: 800, color: "var(--line)", lineHeight: 1, marginBottom: "24px", fontFamily: "var(--sans)", letterSpacing: "-0.04em" }}>404</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "var(--paper)", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Page not found</h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 36px" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="s-btn primary" to="/">Go home →</Link>
          <button className="s-btn ghost" onClick={() => window.history.back()}>← Go back</button>
        </div>
      </div>
    </div>
  );
}
