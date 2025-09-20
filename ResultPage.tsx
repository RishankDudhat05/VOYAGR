// src/ResultPage.tsx

// Import React Router hooks for accessing navigation and route state
import { useLocation, useNavigate } from "react-router-dom";

// Import React hooks
import { useEffect, useState } from "react";

// Import custom components
import BackButton from "./BackButton"; // Back button component
import DayText from "./DayText";       // Component to display a single day's plan
import { getAIResponse } from "./api"; // Function to call AI API
import Button from "./Button";         // Custom Button component

// CSS block to import Nunito font and define a custom font class
const ResultStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito { font-family: 'Nunito', sans-serif; }
`;

// TypeScript interface for a single day of the itinerary
interface Day {
  day: number;      // Day number
  plan: string[];   // List of activities for that day
}

// Main functional component for the result page
export default function ResultPage() {
  // Get location object to access route state (prompt passed from previous page)
  const location = useLocation();

  // Hook to navigate programmatically between pages
  const navigate = useNavigate();

  // Extract state from location; may contain the prompt
  const state = location.state as { prompt?: string } | undefined;

  // State variables for loading, error, and the AI response payload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<any | null>(null);

  // useEffect runs on mount or when `state` changes
  useEffect(() => {
    const prompt = state?.prompt; // Extract prompt from route state

    // If no prompt is provided, show an error
    if (!prompt) {
      setError("No prompt provided.");
      return;
    }

    // Start loading and clear previous errors
    setLoading(true);
    setError("");

    // Call the AI API with the prompt
    getAIResponse(prompt)
      .then((obj) => setPayload(obj))                    // Store response in payload state
      .catch((err) => setError(err.message || "Unknown error")) // Handle errors
      .finally(() => setLoading(false));                // Stop loading regardless of success/failure
  }, [state]);

  // Conditional rendering based on state
  if (loading) return <p className="m-4">Loading AI response...</p>; // Show loading text
  if (error) return <p className="m-4 text-red-600">Error: {error}</p>; // Show error text
  if (!payload) return null; // If no payload yet, render nothing

  // Extract type of AI response; fallback to "unknown" if missing
  const type = payload.type ?? "unknown";

  return (
    <>
      {/* Inject custom font CSS */}
      <style>{ResultStyle}</style>

      {/* Render back button at top */}
      {<BackButton />}

      {/* Top-right section with username and logout */}
      <div className="flex flex-row items-center gap-4 fixed top-4 right-16 m-2 p-2 font-nunito">
        <p className="font-medium">Username</p>
        <Button variant="wout_border" onClick={() => navigate("/")}>
          Logout
        </Button>
      </div>

      {/* Main content container */}
      <div className="m-4">
        {/* Case 1: AI returned an itinerary */}
        {type === "itinerary" && (
          <div className="flex flex-col bg-gray-300 p-2 mt-8 font-nunito rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold m-2 p-2">
              Trip to{" "}
              {payload.cities?.join(", ") ?? payload.country ?? "Unknown"}
            </h1>

            {/* Display each day as a card */}
            <div className="flex flex-col gap-4">
              {(payload.days ?? []).map((d: Day) => (
                <div key={d.day} className="bg-white p-4 rounded-lg shadow-md">
                  <DayText
                    day_num={d.day}
                    activities={(d.plan ?? []).join(". ")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case 2: AI returned top places/recommendations */}
        {type === "places" && (
          <div className="flex flex-col bg-gray-100 p-4 font-nunito rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold m-2">
              Top recommendations — {payload.location ?? "Unknown location"}
            </h1>
            <p className="mb-2">Category: {payload.category ?? "Any"}</p>

            {/* Display recommendations in a responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(payload.places ?? []).map((p: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded shadow">
                  <h2 className="font-semibold">{p.name ?? "Unnamed"}</h2>
                  {p.speciality && <p className="text-sm">{p.speciality}</p>}
                  {p.address && (
                    <p className="text-xs text-gray-600">{p.address}</p>
                  )}
                  {p.note && <p className="text-xs text-gray-700">{p.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case 3: Unsupported, general, or error response */}
        {(type === "unsupported" || type === "general" || type === "error") && (
          <div className="bg-yellow-50 p-4 rounded">
            <h2 className="font-semibold">{type.toUpperCase()}</h2>
            <p>{payload.message ?? "No additional message provided."}</p>
            {payload.raw && (
              <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">
                {payload.raw}
              </pre>
            )}
          </div>
        )}

        {/* Case 4: Unknown or unexpected response type */}
        {type === "unknown" && (
          <div className="bg-red-50 p-4 rounded">
            <h2 className="font-semibold">Unexpected response</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {/* Button to plan another trip */}
        <div className="flex justify-center mt-8">
          <Button
            variant="filled_wout_border"
            color="black"
            onClick={() => window.history.back()} // Go back to previous page
          >
            Plan Another Trip
          </Button>
        </div>
      </div>
    </>
  );
}
