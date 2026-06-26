import { Link } from "react-router-dom";

export default function ResearchPage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      <section className="s-band" style={{ borderTop: "none" }}>
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / Research
          </nav>
          <p className="s-eyebrow">Research</p>
          <div className="s-sec-head">
            <h2>The experiments behind the claims.</h2>
            <p className="lead">
              Each case study shows what verified, curriculum-grade data does to a real model — the method, the held-out
              numbers, and a public mirror of the model and a data sample on Hugging Face. Everything here is reproducible.
            </p>
          </div>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-casecards">
            <Link className="s-cc" to="/research/drishtitable">
              <div className="res">84.9% TEDS</div>
              <div className="ti">DrishtiTable</div>
              <div className="dm">Table structure recognition</div>
              <div className="ds2">A fine-tuned 8B research model tops every frontier cloud model on table extraction; the released 7B is right behind at 83.2%.</div>
              <div className="go">Read the case study →</div>
            </Link>
            <Link className="s-cc" to="/research/nalandabench">
              <div className="res">+6.3 pts</div>
              <div className="ti">NalandaBench</div>
              <div className="dm">STEM reasoning · RLVR (GRPO)</div>
              <div className="ds2">Plain fine-tuning lost 16 points on the same data; verified-reward RL turned it into a 6.3-point gain.</div>
              <div className="go">Read the case study →</div>
            </Link>
            <Link className="s-cc" to="/research/nalanda-image-vl">
              <div className="res">+12.3 pts</div>
              <div className="ti">Nalanda Image VL</div>
              <div className="dm">Multimodal science · vision-language</div>
              <div className="ds2">Fine-tuning a vision model on diagram data lifted held-out accuracy by 12.3 points.</div>
              <div className="go">Read the case study →</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproduce it</p>
            <h2>The models and dataset samples are public.</h2>
            <p className="lead">Download the released checkpoints and held-out sets, run them on your own inputs, and check the numbers for yourself.</p>
          </div>
          <a className="s-demo-bar" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer">
            <span className="db-k">Hugging Face</span>
            <span className="db-t">Browse our published models &amp; dataset samples →</span>
          </a>
        </div>
      </section>
    </div>
  );
}
