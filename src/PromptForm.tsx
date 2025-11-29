import { useState, useEffect } from "react";

import TextField from "./input_field";
import Button from "./Button";
import Footer from "./Footer";

import { useNavigate } from "react-router-dom";
import { getUserProfile, deleteAccount } from "./api";
import ContentSection from "./ContentSection";

const styleBlock = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito { font-family: 'Nunito', sans-serif; }
`;

// ContentCard and scrollToTop were removed because they were declared but never used.

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // NEW: state for place, start date, end date
  const [place, setPlace] = useState("");           // NEW
  const [startDate, setStartDate] = useState("");   // NEW
  const [endDate, setEndDate] = useState("");       // NEW

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      alert("Account deleted successfully.");
      navigate("/auth?mode=login");
    } catch (err: any) {
      alert(`Failed to delete account: ${err.message}`);
    }
  };

  useEffect(() => {
    getUserProfile()
      .then((user) => {
        if (user && user.name) {
          setUsername(user.name);
        }
      })
      .catch((err) => console.error("Failed to load user profile", err));
  }, []);

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return alert("Please enter a prompt.");
    navigate("/results", { state: { prompt: trimmed } });
  };

  // NEW: validation for place / dates when clicking “Let’s Go!”
  const handleManualPlannerClick = () => {
    if (!place.trim() || !startDate || !endDate) {
      alert("Place, start date and end date cannot be empty.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // dates must not be in the past
    if (start < today || end < today) {
      alert("Dates cannot be in the past.");
      return;
    }
    // start date must be strictly less than end date
    if (start > end) {
      alert("Start date must be earlier than end date.");
      return;
    }

    // optional: pass values to manual planner
    navigate("/manual-planner", {
      state: { place, startDate, endDate },
    });
  };

  return (
    <>
      <style>{styleBlock}</style>

      <div id="prompt-top" className="relative font-nunito max-w-6xl mx-auto px-6 py-12">
        {username && (
          <div className="fixed top-6 left-6 z-50">
            <div
              className="flex items-center gap-3 bg-myred rounded-full p-1 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img
                src="logo_0.png"
                alt="avatar"
                className="w-10 h-10 rounded-full object-contain border p-2"
              />
              <div className="bg-myred text-mywhite p-2 pr-4 h-10 w-full rounded-full text-xl font-semibold align-middle">
                {username}
              </div>
            </div>

            {showDropdown && (
              <div className="absolute top-14 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px] overflow-hidden">
                <button
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    navigate("/auth?mode=login");
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start gap-8 pt-8">
          <div className="md:w-1/3 flex items-center">
            <img
              className="m-2 mt-4 max-w-[220px] select-none block dark:hidden"
              src="logo.png"
              alt="logo (light)"
            />
            <img
              className="m-2 mt-4 max-w-[220px] select-none hidden dark:block"
              src="logo_light.png"
              alt="logo (dark)"
            />
          </div>

          <div className="md:w-2/3">
            <h1 className="text-[2.2rem] md:text-[4rem] lg:text-[5.5rem] leading-tight font-light text-right">
              <span className="block">travel like it's</span>
              <span className="block">the</span>
              <span className="block text-5xl md:text-[6.5rem] lg:text-[7rem] font-semibold tracking-wide">
                LAST TIME
              </span>
            </h1>
          </div>
        </div>

        <hr className="mt-16 mb-16 ml-32 mr-32 rounded-sm border border-myblack/40 dark:border-mywhite/40"/>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 flex items-center">
            <div>
              <h3 className="text-7xl text-myred font-bold">
                Plan your
                <br />
                Itinerary
                <br />
                now!
              </h3>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-[#111218] text-mywhite rounded-xl p-6 shadow-lg max-w-md md:ml-auto border-2 border-myred/30">
              <div className="text-sm text-gray-300 mb-4">
                <div className="mb-3">
                  <label className="block text-xs text-gray-400">
                    Add place
                  </label>
                  <input
                    className="w-full rounded-md px-3 py-2 bg-gray-800 text-white"
                    placeholder="e.g. Ahmedabad, Gujarat"
                    // NEW: bind to state
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-400">
                    Add start date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md px-3 py-2 bg-gray-800 text-white"
                    // NEW: bind to state
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400">
                    Choose end date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md px-3 py-2 bg-gray-800 text-white"
                    // NEW: bind to state
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="text-sm text-gray-300"
                  onClick={() => {
                    // NEW: clear the fields
                    setPlace("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Clear
                </button>
                <button
                  className="bg-myred text-white px-4 py-2 rounded-full"
                  onClick={handleManualPlannerClick} // NEW
                >
                  Let's Go!
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-mywhite dark:bg-myblack border-2 border-myblack/20 dark:border-mywhite/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-2xl text-myblack dark:text-mywhite font-semibold mb-4 italic">
              AI assited Planning -just for you!
            </h3>

            <div className="bg-mywhite dark:bg-myblack rounded-xl border border-myblack/20 dark:border-mywhite/20 p-4">
              <TextField
                multiline
                label=""
                placeholder="e.g., I want to plan a 3 day trip to udaipur, india"
                value={prompt}
                onChange={(e) =>
                  setPrompt((e.target as HTMLTextAreaElement).value)
                }
                className="!bg-myred !text-myblack dark:!text-mywhite !rounded-md"
              />

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-3 justify-center items-center">
                  <Button onClick={handleSubmit}>Submit</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-mywhite/40 dark:bg-myblack/40 backdrop-blur-md backdrop-saturate-150 border border-white/30 dark:border-white/10 rounded-2xl p-6 text-left shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <p className="font-semibold text-myblack dark:text-mywhite text-3xl">
              or
            </p>
            <p className="mt-2 text-myblack dark:text-mywhite text-5xl font-bold">
              generate with the help of our AI!
            </p>
          </div>
        </div>
      </div>
      <hr className="mt-16 mb-16 ml-72 mr-72 rounded-sm border border-myblack/40 dark:border-mywhite/40"/>
      <div id="prompt-features">
        <ContentSection />
      </div>
      <div id="prompt-footer">
        <Footer />
      </div>
    </>
  );
}
