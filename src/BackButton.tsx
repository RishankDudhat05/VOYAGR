import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  lightLogo?: string;
  darkLogo?: string;
  altText?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  lightLogo = "logo.png",
  darkLogo = "logo_light.png",
  altText = "Company logo",
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      aria-label="Go back to main page"
    >
      {/* Light mode logo */}
      <img
        src={lightLogo}
        alt={altText}
        className="block dark:hidden"
        style={{
          margin: "24px 0 24px 24px",
          width: "120px",
          height: "auto",
          objectFit: "contain",
        }}
      />

      {/* Dark mode logo */}
      <img
        src={darkLogo}
        alt={altText}
        className="hidden dark:block"
        style={{
          margin: "24px 0 24px 24px",
          width: "120px",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </button>
  );
};

export default BackButton;
