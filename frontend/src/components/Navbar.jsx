import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Datasets", path: "/datasets" },
  { name: "Who We Serve", path: "/industries" },
  { name: "Services", path: "/solutions" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo">
            {/*
              Ascending Steps mark
              Three bars — right-aligned, ascending left-to-right.
              Base bar is widest/heaviest. References Nalanda's tiered stupa
              architecture while reading as ascending data bars.
            */}
            <svg width="22" height="17" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="0"  y="27" width="48" height="10" fill="#C8A96E"/>
              <rect x="14" y="13" width="34" height="9"  fill="#C8A96E"/>
              <rect x="28" y="0"  width="20" height="8"  fill="#C8A96E"/>
            </svg>
            {/* Wordmark */}
            <span className="font-bold text-sm tracking-tight leading-none" style={{ color: '#F0EBE0' }}>
              nalandadata<span style={{ color: '#C8A96E' }}>.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-[#F0EBE0]"
                    : "text-[#888888] hover:text-[#F0EBE0]"
                }`}
                data-testid={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="text-sm font-medium text-[#F0EBE0] border border-white/25 px-4 py-1.5 rounded hover:bg-white/8 transition-colors"
              data-testid="nav-download-catalogue-btn"
            >
              Download Catalogue
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-[#0D0D0D] bg-[#C8A96E] px-4 py-1.5 rounded hover:bg-[#D4B896] transition-colors"
              data-testid="nav-request-dataset-btn"
            >
              Request Dataset Access
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 text-[#888888] hover:text-[#F0EBE0] transition-colors"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0D0D0D] border-t border-white/5"
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center min-h-[44px] py-2 text-base font-medium transition-colors ${
                    isActive(link.path) ? "text-[#F0EBE0]" : "text-[#888888] hover:text-[#F0EBE0]"
                  }`}
                  data-testid={`mobile-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-sm"
                  data-testid="mobile-request-dataset-btn"
                >
                  Request Dataset Access
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
