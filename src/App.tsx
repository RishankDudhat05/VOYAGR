// importing all the required components and libraries
import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import Footer from "./Footer";
import AuthPage from "./AuthPage"; // new page
import PromptPage from "./PromptPage";
import ResultPage from "./ResultPage";

export default function App() {
  // references for scrolling to sections
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // setting up the router for navigation
    <Router>
      <Routes>
        <Route
          // main landing page route
          path="/"
          element={
            // main layout with navbar and sections
            <div className="main">
              <Navbar
                onHomeClick={() => scrollTo(heroRef)}
                onFeaturesClick={() => scrollTo(contentRef)}
                onJoinClick={() => (window.location.href = "/auth")}
                onAboutClick={() => scrollTo(footerRef)}
              />

              <div ref={heroRef}>
                <HeroSection />
              </div>

              <div ref={contentRef}>
                <ContentSection />
              </div>

              <div ref={footerRef}>
                <Footer />
              </div>
            </div>
          }
        />
        // defining routes for different pages
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/prompt" element={<PromptPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}
