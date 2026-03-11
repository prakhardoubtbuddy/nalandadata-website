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
  { name: "Academic Reasoning", slug: "academic-reasoning" },
  { name: "STEM Datasets", slug: "stem-datasets" },
  { name: "Multilingual Education", slug: "multilingual-education" },
  { name: "OCR & Document AI", slug: "ocr-document-ai" },
  { name: "Speech & Audio Learning", slug: "speech-audio-learning" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Datasets", path: "/datasets", hasDropdown: true },
  { name: "Solutions", path: "/solutions" },
  { name: "Industries", path: "/industries" },
  { name: "Resources", path: "/resources" },
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
          <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-semibold text-lg">S Chand</span>
              <span className="text-gray-500 text-sm block -mt-1">AI Infrastructure</span>
            </div>
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
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A] border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                  data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
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
