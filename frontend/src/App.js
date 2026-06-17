import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";

// Pages
import HomePage from "@/pages/HomePage";
import DatasetsPage from "@/pages/DatasetsPage";
import DatasetDetailPage from "@/pages/DatasetDetailPage";
import SolutionsPage from "@/pages/SolutionsPage";
import IndustriesPage from "@/pages/IndustriesPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import AboutPage from "@/pages/AboutPage";
import PrivacyPage from "@/pages/PrivacyPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Layout & utilities
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.gtag) {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <div className="App min-h-screen bg-[#0A0A0A]">
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/datasets" element={<DatasetsPage />} />
                <Route path="/datasets/:slug" element={<DatasetDetailPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/industries" element={<IndustriesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" theme="dark" />
        </div>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
