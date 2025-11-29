import React from "react";
import { useNavigate } from "react-router-dom";
import ManualPlannerForm from "./ManualPlannerForm";
import Button from "./Button";
import ThemeToggle from "./components/theme-toggle";

const ManualPlannerPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    // navigate to the PromptPage route; adjust path if your route differs
    navigate("/prompt");
  };

  return (
    <>
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>
      <div style={{ padding: 16 }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button onClick={handleReturn}>Go Back</Button>
        </header>
        <main style={{ marginTop: 16 }}>
          <ManualPlannerForm />
        </main>
      </div>
    </>
  );
};

export default ManualPlannerPage;
