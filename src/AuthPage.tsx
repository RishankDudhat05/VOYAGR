// import React from "react";
import AuthForm from "./AuthForm";
import BackButton from "./BackButton";
import ThemeToggle from "./components/theme-toggle";

export default function AuthPage() {
  return (
    <div>
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>
      <BackButton />
      <AuthForm />
    </div>
  );
}
