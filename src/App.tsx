import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./components/theme-provider";
// import { FlickeringGridBackground } from "./components/ui/flickering-grid-background";
import { AuroraBackground } from "./components/ui/aurora-background"; // <-- add import

import RealNavbar from "./Navbar";
import { useLocation } from "react-router-dom";

const Navbar: React.FC<any> = (props) => {
  const location = useLocation();
  const allowed = ["/", "/prompt"]; // show only on home and prompt routes
  if (!allowed.includes(location.pathname)) return null;
  return <RealNavbar {...props} />;
};
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import Footer from "./Footer";

import AuthPage from "./AuthPage";
import PromptPage from "./PromptPage";
import ResultPage from "./ResultPage";
import ManualPlannerPage from "./ManualPlannerPage";

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="relative min-h-screen bg-mywhite dark:bg-myblack text-myblack dark:text-mywhite overflow-x-hidden transition-colors duration-300">
          {/* Background */}
          {/* <FlickeringGridBackground
            gridSize={50}
            flickerChance={0.03}
            className="fixed top-0 left-0 w-full h-full z-[1] opacity-90 pointer-events-none"
          /> */}
          <AuroraBackground className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none" />

          {/* Foreground */}
          <div className="relative z-[3]">
            <Navbar
              onHomeClick={() => scrollTo(heroRef)}
              onFeaturesClick={() => scrollTo(contentRef)}
              onJoinClick={() => scrollTo(footerRef)}
              onAboutClick={() => scrollTo(footerRef)}
            />

            <Routes>
              {/* HOME PAGE */}
              <Route
                path="/"
                element={
                  <>
                    <div ref={heroRef}>
                      <HeroSection />
                    </div>

                    <div ref={contentRef}>
                      <ContentSection />
                    </div>

                    <div ref={footerRef}>
                      <Footer />
                    </div>
                  </>
                }
              />

              {/* AUTH */}
              <Route path="/auth" element={<AuthPage />} />

              {/* PROMPT FORM PAGE */}
              <Route path="/prompt" element={<PromptPage />} />

              {/* RESULTS */}
              <Route path="/results" element={<ResultPage />} />

              {/* ⭐ NEW: MANUAL PLANNER ROUTE ⭐ */}
              <Route path="/manual-planner" element={<ManualPlannerPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
