// src/PromptForm.tsx

// Import React hook to manage local component state
import { useState } from "react";

// Import custom components
import BackButton from "./BackButton";       // Back button component
import TextField from "./input_field";       // Custom input field component
import Button from "./Button";               // Custom button component

// Import React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";

// CSS block as a string to import Google font "Nunito" and define a custom font class
const styleBlock = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito { font-family: 'Nunito', sans-serif; }
`;

// Main functional component
export default function PromptForm() {
  // State variable `prompt` stores the user's input text
  const [prompt, setPrompt] = useState("");

  // Hook to navigate programmatically between routes
  const navigate = useNavigate();

  // Function to handle submission of the prompt
  const handleSubmit = () => {
    const trimmed = prompt.trim(); // Remove leading/trailing spaces

    // If input is empty, show alert and stop submission
    if (!trimmed) return alert("Please enter a prompt.");

    // Navigate to "/result" page and pass the trimmed prompt as state
    // The result page can access this state via React Router's useLocation
    navigate("/result", { state: { prompt: trimmed } });
  };

  // JSX returned by the component
  return (
    <>
      {/* Inject custom CSS for font into the page */}
      <style>{styleBlock}</style>

      {/* Render the back button */}
      <BackButton />

      {/* Top-right user info section with username and logout button */}
      <div className="flex flex-row items-center gap-4 fixed top-4 right-16 m-2 p-2 font-nunito">
        {/* Display username */}
        <p className="font-medium">Username</p>

        {/* Logout button that navigates to the homepage */}
        <Button variant="wout_border" onClick={() => navigate("/")}>
          Logout
        </Button>
      </div>

      {/* Main prompt input container */}
      <div className="flex flex-col min-w-[384px] m-32 bg-white font-nunito p-8 rounded-xl shadow-lg">
        {/* Heading for instructions */}
        <p className="text-start m-4 text-2xl font-bold">
          Enter your prompt and get your itinerary or recommendations!
        </p>

        {/* Input field for prompt */}
        <TextField
          label="Prompt" // Label text for the input
          type="text"    // Input type
          placeholder="E.g. Plan a 3-day trip to Kyoto OR Top 10 bakeries in Mumbai" // Example text
          value={prompt} // Controlled input value from state
          onChange={(e) => setPrompt((e.target as HTMLInputElement).value)} // Update state on typing
        />

        {/* Submit button container */}
        <div className="flex justify-center items-end mt-4">
          {/* Button to submit the prompt */}
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
}
