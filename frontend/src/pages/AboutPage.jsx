import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "40px" }}>
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / About
          </nav>
          <p className="s-eyebrow">About</p>
          <div className="s-sec-head">
            <h2>India's leading academic publisher, now building AI training data.</h2>
            <p className="lead">
              Nalandadata is the AI data initiative of S Chand Group — India's largest education content company,
              with 85+ years of publishing, 11,000+ expert-authored titles, and curriculum coverage from
              pre-primary to postgraduate across 12 languages.
            </p>
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-statband">
            <div><div className="sv">85+</div><div className="sl">Years of publishing</div></div>
            <div><div className="sv">15+</div><div className="sl">Subjects covered</div></div>
            <div><div className="sv">12</div><div className="sl">Languages</div></div>
            <div><div className="sv">Pre-primary → Masters</div><div className="sl">Grade coverage</div></div>
          </div>
        </div>
      </section>

      {/* About content */}
      <section className="s-band">
        <div className="s-wrap">
          <div style={{ maxWidth: "70ch", display: "flex", flexDirection: "column", gap: "18px" }}>
            <p style={{ color: "#CFC8BB", margin: 0 }}>
              <b style={{ color: "var(--paper)" }}>Nalandadata.ai</b> is the digital initiative of S Chand Group, a leading Indian education content
              company delivering content, solutions, and services across the education lifecycle through three
              business segments — Early Learning, K-12, and Higher Education. We have a strong foothold in
              CBSE/ICSE affiliated schools, with increasing presence in state board affiliated schools across India.
            </p>
            <p style={{ color: "#CFC8BB", margin: 0 }}>
              We develop and nurture relationships with customers by creating quality content and educational
              innovations. In recent years, we have increased our focus on investing and improving our digital
              offerings across every business segment.
            </p>
            <p style={{ color: "#CFC8BB", margin: 0 }}>
              Over the last decade, we have coupled our print content with digital and interactive methods of
              learning, providing flexibility in the delivery of content to students. Our aim is to lead the
              transition to digital in the knowledge industry. In the K-12 segment, we operate through
              Destination Success, Mystudygear, Intellitab, Ignitor, and Testcoach Prime.
            </p>
            <p style={{ color: "#CFC8BB", margin: 0 }}>
              In the higher education segment, our digital efforts are focused on test preparation — an area
              seeing rapid growth as examinations shift to online formats, driving demand for online content
              and assessment solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Business segments */}
      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Business segments</p>
            <h2>Three segments. One archive.</h2>
          </div>
          <div className="s-segs">
            <div className="s-seg">
              <div className="se">Early Learning</div>
              <h3>Foundational literacy &amp; numeracy</h3>
              <p>Curriculum content that builds core literacy and numeracy skills for young learners, from pre-primary through early grades.</p>
            </div>
            <div className="s-seg">
              <div className="se">K-12</div>
              <h3>CBSE, ICSE &amp; state boards</h3>
              <p>Deep curriculum coverage across every major Indian board — from textbooks and workbooks to digital classrooms and assessments.</p>
            </div>
            <div className="s-seg">
              <div className="se">Higher Education</div>
              <h3>Test prep &amp; competitive exams</h3>
              <p>Test preparation, competitive exam content, and assessment solutions, covering JEE, NEET, UPSC, and professional certifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this matters for AI */}
      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Why it matters for AI</p>
            <h2>The archive behind the data.</h2>
            <p className="lead">
              85+ years of expert-authored, curriculum-verified content is the foundation that makes
              Nalandadata different from every synthetic or scraped alternative.
            </p>
          </div>
          <div className="s-verify">
            <div className="s-vcard">
              <div className="vk">Rights-cleared</div>
              <h3>100% owned IP</h3>
              <p>Every dataset ships with full copyright lineage — publisher, title, edition, annotation log, and commercial rights. Zero scraping.</p>
            </div>
            <div className="s-vcard">
              <div className="vk">Expert-authored</div>
              <h3>2,000+ subject-matter experts</h3>
              <p>Difficulty levels graded by domain specialists, not algorithmic scoring. The reasoning moves are in the data because the experts put them there.</p>
            </div>
            <div className="s-vcard">
              <div className="vk">Reproducible</div>
              <h3>Public models &amp; samples</h3>
              <p>Every result we publish is backed by a public model and dataset sample on Hugging Face so you can verify it yourself.</p>
              <a className="vl" href="https://huggingface.co/Nalandadata" target="_blank" rel="noopener noreferrer">Browse on Hugging Face →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="s-band alt">
        <div className="s-wrap" style={{ textAlign: "center" }}>
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Get in touch</p>
          <h2>Work with the data behind the models.</h2>
          <p className="lead" style={{ margin: "18px auto 28px", maxWidth: "52ch" }}>
            Whether you're licensing a dataset, submitting a model to the benchmark, or scoping a custom corpus — talk to the people who built it.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="s-btn primary" to="/contact">Talk to a researcher →</Link>
            <Link className="s-btn ghost" to="/research">See the research →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
