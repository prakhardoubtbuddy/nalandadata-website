import { useState } from "react";
import { Link } from "react-router-dom";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const footerLinks = {
  datasets: [
    { name: "STEM Reasoning", path: "/datasets/stem-reasoning" },
    { name: "Language & Literacy", path: "/datasets/language-literacy" },
    { name: "Social Sciences", path: "/datasets/social-sciences" },
    { name: "Higher Education", path: "/datasets/higher-education" },
  ],
  services: [
    { name: "Custom Dataset Development", path: "/solutions" },
    { name: "AI Factuality Audit", path: "/solutions" },
    { name: "Data Pipeline Engineering", path: "/solutions" },
    { name: "India Language Solutions", path: "/solutions" },
  ],
  company: [
    { name: "Who We Serve", path: "/industries" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms", path: "/privacy" },
  ],
};

export default function Footer() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      {/* Cream CTA Section */}
      <section
        className="py-16 px-6 lg:px-10"
        style={{ backgroundColor: "#E8D5A3" }}
        data-testid="footer-cta"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <h2
            className="font-bold leading-tight tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 52px)", color: "#0D0D0D" }}
          >
            The data is ready.
            <br />
            Is your pipeline?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#0D0D0D] text-[#E8D5A3] font-semibold text-sm px-5 py-2.5 rounded hover:bg-[#1A1A1A] transition-colors"
            >
              Request Dataset Access →
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="border border-[#0D0D0D]/40 text-[#0D0D0D] font-medium text-sm px-5 py-2.5 rounded hover:bg-[#0D0D0D]/10 transition-colors"
            >
              Download Catalogue
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-[#1A1A1A]" data-testid="footer">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-3" data-testid="footer-logo">
                <svg width="18" height="14" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="0"  y="27" width="48" height="10" fill="#C8A96E"/>
                  <rect x="14" y="13" width="34" height="9"  fill="#C8A96E"/>
                  <rect x="28" y="0"  width="20" height="8"  fill="#C8A96E"/>
                </svg>
                <span className="text-[#F0EBE0] font-bold text-base tracking-tight">
                  nalandadata<span className="text-[#C8A96E]">.ai</span>
                </span>
              </Link>
              <p className="text-[#666] text-xs mb-1">A division of S Chand Group</p>
              <p className="text-[#666] text-xs font-mono">
                © {new Date().getFullYear()} &middot; New Delhi, India
              </p>
            </div>

            {/* Datasets */}
            <div>
              <h4 className="text-[#777] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">Datasets</h4>
              <ul className="space-y-2.5">
                {footerLinks.datasets.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[#777] text-sm hover:text-[#F0EBE0] transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[#777] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">Services</h4>
              <ul className="space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-[#777] text-sm hover:text-[#F0EBE0] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[#777] font-mono font-semibold text-[12px] tracking-widest uppercase mb-4">Company</h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.path + link.name}>
                    <Link
                      to={link.path}
                      className="text-[#777] text-sm hover:text-[#F0EBE0] transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[#666] text-xs font-mono">
              © {new Date().getFullYear()} Nalandadata.ai. All rights reserved.
            </p>
            <p className="text-[#555] text-xs font-mono">
              Powered by S Chand Group
            </p>
          </div>
        </div>
      </footer>

      <LeadCaptureForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        downloadFiles={[]}
      />
    </>
  );
}
