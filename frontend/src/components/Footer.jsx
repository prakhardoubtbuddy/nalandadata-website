import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--ink-2)", padding: "clamp(44px,6vw,64px) 0 38px" }}>
      <div className="s-wrap">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "36px", justifyContent: "space-between" }}>
          <div>
            <Link to="/" style={{ display: "block", marginBottom: "12px" }}>
              <svg width="31" height="24" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="0"  y="27" width="48" height="10" fill="#C8A96E"/>
                <rect x="14" y="13" width="34" height="9"  fill="#C8A96E"/>
                <rect x="28" y="0"  width="20" height="8"  fill="#C8A96E"/>
              </svg>
            </Link>
            <div style={{ fontWeight: 800, fontSize: "19px" }}>Nalandadata</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.16em", color: "var(--muted)", textTransform: "uppercase", marginTop: "7px" }}>Verified reasoning data</div>
          </div>
          <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.9" }}>
            <a href="mailto:info@nalandadata.ai" style={{ color: "inherit", textDecoration: "none" }}>info@nalandadata.ai</a><br />
            <a href="tel:+918882687147" style={{ color: "inherit", textDecoration: "none" }}>+91 88826 87147</a><br />
            A27, 2nd Floor, Mohan Cooperative Industrial Estate, New Delhi 110044<br />
            <a href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>huggingface.co/Nalandadata</a>
          </div>
        </div>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "22px", marginTop: "34px", fontFamily: "var(--mono)", fontSize: "12.5px", letterSpacing: "0.04em" }}>
          <Link to="/benchmarks" style={{ color: "var(--muted)", textDecoration: "none" }}>Benchmarks</Link>
          <Link to="/datasets" style={{ color: "var(--muted)", textDecoration: "none" }}>Datasets</Link>
          <Link to="/solutions" style={{ color: "var(--muted)", textDecoration: "none" }}>Solutions</Link>
          <Link to="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
          <Link to="/about" style={{ color: "var(--muted)", textDecoration: "none" }}>About</Link>
          <Link to="/contact" style={{ color: "var(--muted)", textDecoration: "none" }}>Contact</Link>
          <a href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Hugging&nbsp;Face</a>
          <Link to="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy</Link>
        </nav>
        <div style={{ marginTop: "40px", paddingTop: "22px", borderTop: "1px solid var(--line-soft)", fontFamily: "var(--mono)", fontSize: "11px", color: "var(--muted-2)", letterSpacing: "0.04em", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <span>© {new Date().getFullYear()} Nalandadata</span>
          <span>Expert-authored · curriculum-grade · human-verified · reproducible</span>
        </div>
      </div>
    </footer>
  );
}
