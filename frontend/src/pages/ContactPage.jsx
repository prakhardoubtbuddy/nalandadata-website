import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "@/lib/api";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
];

const companyTypes = [
  { value: "ai_lab", label: "AI Lab" },
  { value: "startup", label: "Startup" },
  { value: "research_institute", label: "Research Institute" },
  { value: "edtech", label: "EdTech" },
  { value: "enterprise", label: "Enterprise" },
  { value: "other", label: "Other" },
];

const useCaseOptions = [
  { value: "pretraining", label: "Pretraining" },
  { value: "finetuning", label: "Fine-tuning" },
  { value: "rlhf", label: "RLHF / DPO" },
  { value: "evaluation", label: "Evaluation" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
];

const datasetOptions = [
  { value: "stem-reasoning", label: "STEM Reasoning & Problem Solving" },
  { value: "language-literacy", label: "Language, Literacy & Comprehension" },
  { value: "social-sciences", label: "Social Sciences, Civics & General Knowledge" },
  { value: "higher-education", label: "Higher Education & Professional Knowledge" },
  { value: "custom", label: "Custom Dataset" },
];

const fieldBase = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid var(--line)",
  borderRadius: "6px",
  padding: "10px 14px",
  color: "var(--paper)",
  fontFamily: "var(--sans)",
  fontSize: "0.9rem",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const fieldErr = { ...fieldBase, borderColor: "#e05555" };

const lbl = {
  display: "block",
  fontSize: "0.8rem",
  color: "var(--muted)",
  marginBottom: "6px",
  fontFamily: "var(--sans)",
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const [form, setForm] = useState({
    full_name: "",
    work_email: "",
    company: "",
    role: "",
    company_type: "",
    use_case: "",
    dataset_interest: "",
    message: "",
    mobile_country_code: "+91-India",
    mobile_number: "",
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.full_name) errs.full_name = "Required";
    if (!form.work_email) errs.work_email = "Required";
    if (!form.company) errs.company = "Required";
    if (!form.role) errs.role = "Required";
    if (!form.company_type) errs.company_type = "Required";
    if (!form.use_case) errs.use_case = "Required";
    if (!form.dataset_interest) errs.dataset_interest = "Required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/leads`, form);
      setIsSubmitted(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setForm({ full_name: "", work_email: "", company: "", role: "", company_type: "", use_case: "", dataset_interest: "", message: "", mobile_country_code: "+91-India", mobile_number: "" });
  };

  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      <Helmet>
        <title>Request Dataset Access — Nalandadata.ai</title>
        <meta name="description" content="Request access to Nalandadata AI training datasets. Contact our team to discuss licensing, custom datasets, and enterprise agreements." />
      </Helmet>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none" }}>
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / Contact
          </nav>
          <p className="s-eyebrow">Contact</p>
          <div className="s-sec-head">
            <h2>Request dataset access.</h2>
            <p className="lead">
              Tell us about your project and we'll help you find the right datasets for your needs.
              Our team responds within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="s-band alt">
        <div className="s-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "64px", alignItems: "start" }}>

            {/* Contact info */}
            <div>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: "1.15rem", fontWeight: 700, color: "var(--paper)", marginBottom: "12px" }}>Get in Touch</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "32px", fontSize: "0.93rem" }}>
                Our data experts are ready to help you find the perfect datasets for your AI projects.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                <div>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>Email</p>
                  <a href="mailto:licensing@nalandadata.ai" style={{ color: "var(--paper)", fontSize: "0.93rem", textDecoration: "none" }}>licensing@nalandadata.ai</a>
                </div>
                <div>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>Phone</p>
                  <p style={{ color: "var(--paper)", fontSize: "0.93rem" }}>+91 8882687147</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>Headquarters</p>
                  <p style={{ color: "var(--paper)", fontSize: "0.93rem", lineHeight: 1.6 }}>A27, 2nd Floor, Mohan Cooperative Industrial Estate, New Delhi — 110 044, INDIA</p>
                </div>
              </div>

              <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: "10px", padding: "20px" }}>
                <p style={{ fontFamily: "var(--sans)", fontWeight: 600, color: "var(--paper)", marginBottom: "8px", fontSize: "0.95rem" }}>Enterprise Sales</p>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "12px" }}>
                  For large-scale data licensing and custom partnerships, contact our enterprise team.
                </p>
                <a href="mailto:licensing@nalandadata.ai" style={{ color: "var(--accent)", fontSize: "0.85rem", textDecoration: "none" }}>
                  licensing@nalandadata.ai →
                </a>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "40px" }}>
              {isSubmitted ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(200,169,110,0.15)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "1.4rem", color: "var(--accent)" }}>✓</div>
                  <h3 style={{ fontFamily: "var(--sans)", fontSize: "1.4rem", fontWeight: 700, color: "var(--paper)", marginBottom: "12px" }}>Request Submitted</h3>
                  <p style={{ color: "var(--muted)", marginBottom: "28px", lineHeight: 1.7 }}>
                    Thank you for your interest. Our data experts will reach out within 24 hours to discuss your requirements.
                  </p>
                  <button onClick={resetForm} className="s-btn ghost">Submit Another Request</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
                    <div>
                      <label style={lbl}>Full Name *</label>
                      <input ref={firstRef} value={form.full_name} onChange={e => set("full_name", e.target.value)} style={errors.full_name ? fieldErr : fieldBase} placeholder="John Smith" data-testid="contact-form-name" />
                      {errors.full_name && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.full_name}</p>}
                    </div>
                    <div>
                      <label style={lbl}>Work Email *</label>
                      <input type="email" value={form.work_email} onChange={e => set("work_email", e.target.value)} style={errors.work_email ? fieldErr : fieldBase} placeholder="john@company.com" data-testid="contact-form-email" />
                      {errors.work_email && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.work_email}</p>}
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Mobile Number</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select value={form.mobile_country_code} onChange={e => set("mobile_country_code", e.target.value)} style={{ ...fieldBase, width: "160px", flexShrink: 0 }} data-testid="contact-form-country-code">
                        {countryCodes.map((c, i) => (
                          <option key={`${c.code}-${c.country}-${i}`} value={`${c.code}-${c.country}`}>
                            {c.flag} {c.country} ({c.code})
                          </option>
                        ))}
                      </select>
                      <input type="tel" value={form.mobile_number} onChange={e => set("mobile_number", e.target.value)} style={{ ...fieldBase, flex: 1 }} placeholder="Mobile number" data-testid="contact-form-mobile" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
                    <div>
                      <label style={lbl}>Company *</label>
                      <input value={form.company} onChange={e => set("company", e.target.value)} style={errors.company ? fieldErr : fieldBase} placeholder="Company name" data-testid="contact-form-company" />
                      {errors.company && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.company}</p>}
                    </div>
                    <div>
                      <label style={lbl}>Role *</label>
                      <input value={form.role} onChange={e => set("role", e.target.value)} style={errors.role ? fieldErr : fieldBase} placeholder="ML Engineer" data-testid="contact-form-role" />
                      {errors.role && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.role}</p>}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
                    <div>
                      <label style={lbl}>Company Type *</label>
                      <select value={form.company_type} onChange={e => set("company_type", e.target.value)} style={errors.company_type ? fieldErr : fieldBase} data-testid="contact-form-company-type">
                        <option value="">Select type</option>
                        {companyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      {errors.company_type && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.company_type}</p>}
                    </div>
                    <div>
                      <label style={lbl}>Use Case *</label>
                      <select value={form.use_case} onChange={e => set("use_case", e.target.value)} style={errors.use_case ? fieldErr : fieldBase} data-testid="contact-form-use-case">
                        <option value="">Select use case</option>
                        {useCaseOptions.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                      {errors.use_case && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.use_case}</p>}
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Dataset Interest *</label>
                    <select value={form.dataset_interest} onChange={e => set("dataset_interest", e.target.value)} style={errors.dataset_interest ? fieldErr : fieldBase} data-testid="contact-form-dataset">
                      <option value="">Select dataset</option>
                      {datasetOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    {errors.dataset_interest && <p style={{ color: "#e05555", fontSize: "0.75rem", marginTop: "4px" }}>{errors.dataset_interest}</p>}
                  </div>

                  <div>
                    <label style={lbl}>Tell us about your project</label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)} style={{ ...fieldBase, minHeight: "120px", resize: "vertical" }} placeholder="Describe your use case, data requirements, and any specific needs..." data-testid="contact-form-message" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="s-btn primary" style={{ width: "100%", justifyContent: "center", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }} data-testid="contact-form-submit">
                    {isSubmitting ? "Submitting..." : "Submit Request →"}
                  </button>

                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center" }}>
                    By submitting, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
