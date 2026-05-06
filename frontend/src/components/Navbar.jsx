import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const datasetCategories = [
  { name: "STEM Reasoning", slug: "stem-reasoning" },
  { name: "Language & Literacy", slug: "language-literacy" },
  { name: "Social Sciences", slug: "social-sciences" },
  { name: "Higher Education", slug: "higher-education" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Datasets", path: "/datasets", hasDropdown: true },
  { name: "Solutions", path: "/solutions" },
  { name: "Industries", path: "/industries" },
  { name: "About", path: "/about" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo">
            {/* Geometric icon inspired by infobay.ai */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/40" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="11" cy="11" r="2.5" fill="white" />
                <circle cx="4" cy="5" r="1.8" fill="white" fillOpacity="0.85" />
                <circle cx="18" cy="5" r="1.8" fill="white" fillOpacity="0.85" />
                <circle cx="4" cy="17" r="1.8" fill="white" fillOpacity="0.85" />
                <circle cx="18" cy="17" r="1.8" fill="white" fillOpacity="0.85" />
                <line x1="11" y1="11" x2="4" y2="5" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
                <line x1="11" y1="11" x2="18" y2="5" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
                <line x1="11" y1="11" x2="4" y2="17" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
                <line x1="11" y1="11" x2="18" y2="17" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
              </svg>
            </div>
            {/* Wordmark + Tagline */}
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg tracking-tight leading-none">
                Nalanda<span className="text-blue-400">data</span><span className="text-indigo-400">.ai</span>
              </span>
              <span className="text-gray-400 text-xs block mt-0.5 tracking-wide">Structured knowledge. Infinite intelligence.</span>
            </div>
            <span className="sm:hidden text-white font-bold text-lg tracking-tight">
              Nalanda<span className="text-blue-400">data</span><span className="text-indigo-400">.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      data-testid="nav-datasets-dropdown"
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 bg-[#121212] border-white/10"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/datasets"
                        className="w-full cursor-pointer text-gray-300 hover:text-white focus:text-white"
                        data-testid="nav-all-datasets"
                      >
                        All Datasets
                      </Link>
                    </DropdownMenuItem>
                    {datasetCategories.map((cat) => (
                      <DropdownMenuItem key={cat.slug} asChild>
                        <Link
                          to={`/datasets/${cat.slug}`}
                          className="w-full cursor-pointer text-gray-300 hover:text-white focus:text-white"
                          data-testid={`nav-dataset-${cat.slug}`}
                        >
                          {cat.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  data-testid={`nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="btn-secondary text-sm"
              data-testid="nav-request-dataset-btn"
            >
              Request Dataset
            </Link>
            <Link
              to="/contact"
              className="btn-primary text-sm"
              data-testid="nav-get-started-btn"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-3 text-gray-400 hover:text-white transition-colors"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
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
            className="lg:hidden bg-[#0A0A0A] border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center min-h-[44px] py-2 text-lg font-medium transition-colors ${
                      isActive(link.path)
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && (
                    <div className="pl-4 pb-2 space-y-1">
                      {datasetCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/datasets/${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center min-h-[40px] py-1.5 text-sm text-gray-500 hover:text-blue-400 transition-colors"
                          data-testid={`mobile-nav-dataset-${cat.slug}`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center"
                  data-testid="mobile-get-started-btn"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
