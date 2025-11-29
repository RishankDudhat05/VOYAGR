"use client";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Button from "./Button";
import { Home, Binoculars, Info, LogIn } from "lucide-react";
import ThemeToggle from "./components/theme-toggle";

const buttonStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

interface NavbarProps {
  onHomeClick?: () => void;
  onFeaturesClick?: () => void;
  onAboutClick?: () => void;
}

export default function Navbar({
  onHomeClick,
  onFeaturesClick,
  onAboutClick,
}: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // detect login/signup page
  const isAuthPage = location.pathname.startsWith("/auth");

  // Check auth token
  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    // Check if token exists and is not the string "undefined" or "null"
    setIsLoggedIn(!!token && token !== "undefined" && token !== "null");
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);


  return (
    <>
      <style>{buttonStyle}</style>

      <div
        className="
          fixed top-2 right-2 z-50
          flex flex-row items-center gap-2
          px-3 py-2
          bg-mywhite/80 dark:bg-myblack/80
          border border-myred/30
          backdrop-blur-md
          rounded-full shadow-md
          transition-colors duration-300
        "
      >
        {/* ALWAYS SHOW THEME TOGGLE */}
        <ThemeToggle />

        {/* SHOW NAV ITEMS ONLY IF NOT ON AUTH PAGE */}
        {!isAuthPage && (
          <>
            <Button
              color="myred"
              variant="wout_border"
              onClick={() => {
                if (location.pathname === "/") {
                  onHomeClick && onHomeClick();
                } else if (location.pathname === "/prompt") {
                  const el = document.getElementById("prompt-top");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else navigate("/#home");
                } else {
                  navigate("/#home");
                }
              }}
            >
              <span className="relative min-w-[90px] h-8 flex items-center justify-center group font-nunito">
                <span className="absolute transition-opacity duration-200 group-hover:opacity-0">Home</span>
                <Home className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
              </span>
            </Button>

            <Button
              color="myred"
              variant="wout_border"
              onClick={() => {
                if (location.pathname === "/") {
                  onFeaturesClick && onFeaturesClick();
                } else if (location.pathname === "/prompt") {
                  const el = document.getElementById("prompt-features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else navigate("/#features");
                } else {
                  navigate("/#features");
                }
              }}
            >
              <span className="relative min-w-[110px] h-8 flex items-center justify-center group font-nunito">
                <span className="absolute transition-opacity duration-200 group-hover:opacity-0">Features</span>
                <Binoculars className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
              </span>
            </Button>

            <Button
              color="myred"
              variant="wout_border"
              onClick={() => {
                if (location.pathname === "/") {
                  onAboutClick && onAboutClick();
                } else if (location.pathname === "/prompt") {
                  const el = document.getElementById("prompt-footer");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else navigate("/#footer");
                } else {
                  navigate("/#footer");
                }
              }}
            >
              <span className="relative min-w-[120px] h-8 flex items-center justify-center group font-nunito">
                <span className="absolute transition-opacity duration-200 group-hover:opacity-0">About Us</span>
                <Info className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
              </span>
            </Button>

            {/* {isLoggedIn && (
              <Button color="myred" variant="wout_border" onClick={handleLogout}>
                <span className="relative min-w-[90px] h-8 flex items-center justify-center group font-nunito">
                  <span className="absolute transition-opacity duration-200 group-hover:opacity-0">Logout</span>
                  <LogOut className="absolute w-6 h-6 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
                </span>
              </Button>
            )} */}

            {!isLoggedIn && (
              <Button color="myred" variant="wout_border" onClick={() => navigate("/auth?mode=login")}>
                <span className="relative min-w-[90px] h-8 flex items-center justify-center group font-nunito">
                  <span className="absolute transition-opacity duration-200 group-hover:opacity-0">Sign In</span>
                  <LogIn className="absolute w-6 h-6 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
                </span>
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
