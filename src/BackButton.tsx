import React from "react";

interface BackButtonProps {
  logoSrc?: string;
  altText?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  logoSrc = "logo.png",
  altText = "Company logo at top left above the authentication form, set against a neutral background, conveying a welcoming and professional atmosphere",
}) => (
  <button
    onClick={() => (window.location.href = "/")}
    style={{
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
    }}
    aria-label="Go back to main page"
  >
    <img
      src={logoSrc}
      alt={altText}
      style={{
        display: "block",
        margin: "24px 0 24px 24px",
        width: "120px",
        height: "auto",
        objectFit: "contain",
      }}
      className="logo"
    />
  </button>
);

export default BackButton;
