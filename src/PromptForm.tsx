import React, { useState } from "react";

import TextField from "./input_field";
import Button from "./Button";
import Footer from "./Footer";

import { useNavigate } from "react-router-dom";

const styleBlock = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito { font-family: 'Nunito', sans-serif; }
`;

/**
 * Small helper components/functions added inline so the file compiles:
 * - ContentCard: lightweight container used in the layout
 * - ArrowUp: simple SVG icon component
 * - scrollToTop: window helper
 */

type ContentCardProps = {
  heading?: React.ReactNode;
  children?: React.ReactNode;
};
function ContentCard({ heading, children }: ContentCardProps) {
  return (
    <div className="h-full w-full">
      {heading && <h4 className="text-lg font-semibold mb-2">{heading}</h4>}
      <div className="text-sm text-gray-200">{children}</div>
    </div>
  );
}

function ArrowUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M3.293 9.293a1 1 0 011.414 0L9 13.586V3a1 1 0 112 0v10.586l4.293-4.293a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return alert("Please enter a prompt.");
    navigate("/results", { state: { prompt: trimmed } });
  };

  return (
    <>
      <style>{styleBlock}</style>

      <div id="prompt-top" className="relative font-nunito max-w-6xl mx-auto px-6 py-12">
        <div className="fixed top-6 left-6 z-50 flex items-center gap-3 bg-myred rounded-full p-1">
          <img
            src="ada.jpg"
            alt="avatar"
            draggable
            title="Drag to logout"
            onDragStart={(e: React.DragEvent<HTMLImageElement>) => {
              // required for some browsers to allow drag
              try {
                e.dataTransfer?.setData("text/plain", "");
              } catch {}
              e.currentTarget.dataset.startX = String(e.clientX);
              e.currentTarget.dataset.startY = String(e.clientY);
            }}
            onDragEnd={(e: React.DragEvent<HTMLImageElement>) => {
              const startX = Number(e.currentTarget.dataset.startX ?? 0);
              const startY = Number(e.currentTarget.dataset.startY ?? 0);
              const dx = Math.abs(e.clientX - startX);
              const dy = Math.abs(e.clientY - startY);
              const threshold = 40; // pixels required to consider it a drag
              if (dx > threshold || dy > threshold) navigate("/");
            }}
            onTouchStart={(e: React.TouchEvent<HTMLImageElement>) => {
              const t = e.touches[0];
              e.currentTarget.dataset.startX = String(t.clientX);
              e.currentTarget.dataset.startY = String(t.clientY);
            }}
            onTouchEnd={(e: React.TouchEvent<HTMLImageElement>) => {
              const t = e.changedTouches[0];
              if (!t) return;
              const startX = Number(e.currentTarget.dataset.startX ?? 0);
              const startY = Number(e.currentTarget.dataset.startY ?? 0);
              const dx = Math.abs(t.clientX - startX);
              const dy = Math.abs(t.clientY - startY);
              const threshold = 40;
              if (dx > threshold || dy > threshold) navigate("/");
            }}
            className="w-10 h-10 rounded-full object-cover border cursor-grab active:cursor-grabbing"
          />
          <div className="bg-myred text-mywhite p-2 pr-4 h-10 w-full rounded-full text-xl font-semibold align-middle">
            username
          </div>
        </div>

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

        <hr className="my-8 border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 flex items-center">
            <div>
              <h3 className="text-3xl md:text-4xl text-myred font-bold">
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
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-400">
                    Add start date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md px-3 py-2 bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400">
                    Choose end date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md px-3 py-2 bg-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button className="text-sm text-gray-300">Clear</button>
                <button
                  className="bg-myred text-white px-4 py-2 rounded-full"
                  onClick={() => navigate("/manual-planner")}
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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-1 gap-6">
          <div id="prompt-features" className="flex flex-col m-8 mb-32 p-2 justify-center items-center font-nunito">
            <p className="m-2 p-4 font-semibold text-3xl">Features</p>
            {/* main bento box layout */}
            <div className="flex flex-col w-full mr-4">
              <div className="flex flex-row flex-wrap m-0 p-0 w-full">
                <div className="flex-[2_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <img
                    src="backdrop.png"
                    alt="LogoBackdrop"
                    className="absolute inset-0 w-full h-full object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-myblack/30 transition-colors duration-200 rounded-lg pointer-events-none" />
                </div>
                <div className="flex-[3_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
                  <TextField
                  label={<span className="text-mywhite dark:text-myblack">Write your testimonial!</span>}
                  type="text"
                  placeholder="Write your review here..."
                  defaultValue="hi there"
                  className={`w-full p-4 rounded-lg shadow-sm transition-colors duration-150
                bg-myred/90 placeholder:text-gray-400 border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-mywhite/20
                dark:bg-myred/90 dark:placeholder:text-gray-500 dark:border-gray-200 dark:focus:ring-myblack/20
                text-myblack dark:text-mywhite`}
                  />
                </div>
                <div className="flex-[1_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
                  <ContentCard heading=" ✈️ Smart Personalized Trips">
                    Get custom travel itineraries based on your interests,
                    budget, and time. No templates — your trip feels uniquely
                    yours, every time.
                  </ContentCard>
                </div>
              </div>
              <div className="flex flex-row flex-wrap m-0 p-0 w-full">
                <div className="flex-[3_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm overflow-hidden relative">
                  <img
                    src="ada.jpg"
                    alt="PlaceBackdrop"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.32) 32%, rgba(0,0,0,0) 60%)",
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* simple text blocks without glass effects */}
                  <div className="absolute bottom-16 left-4 z-10 m-0 p-0">
                    <div className="rounded-md px-4 py-2">
                      <p className="m-0 p-0 font-extrabold text-5xl italic text-white">
                        Great Places
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 z-10 m-0 p-0">
                    <div className="rounded-md px-4 py-2">
                      <p className="m-0 p-0 font-thin text-2xl text-white">
                        Unforgettable Memories
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-[2_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
                  <div className="h-full p-4 rounded-lg bg-mywhite/6 backdrop-blur-sm border border-white/10">
                    <ContentCard heading="🔄 Dynamic Real-Time Adjustments">
                      Plans change? Weather shifts? Crowds hit? Your itinerary
                      updates instantly with new routes, recommendations, and
                      optimal timings.
                    </ContentCard>
                  </div>
                </div>

                <div className="flex-[2_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
                  <div className="h-full p-4 rounded-lg bg-mywhite/6 backdrop-blur-sm border border-white/10">
                    <ContentCard heading="📍Local-Inspired Recommendations">
                      Discover hidden gems, local favorites, and authentic
                      experiences curated by AI trained on real traveler
                      feedback and regional insights.
                    </ContentCard>
                  </div>
                </div>
              </div>
            </div>

            <div className="justify-start mt-8">
              <Button
                onClick={() => scrollToTop()}
                color="myblack"
                variant="filled"
              >
                {"\u2191"} Scroll Up
              </Button>
            </div>
          </div>
        </div>
        <div id="prompt-footer">
          <Footer />
        </div>
      </div>
    </>
  );
}
