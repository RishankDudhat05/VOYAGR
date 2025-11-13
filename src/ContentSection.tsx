import Button from "./Button";
import ContentCard from "./ContentCard";
import { ArrowUp } from "lucide-react"; // helps in importing icons
import TextField from "./input_field";

const HeroStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

//  ContentSection component showcasing features with cards
export default function ContentSection() {
  return (
    <>
      <style>{HeroStyle}</style>
      <div className="flex flex-col m-8 mb-32 p-2 justify-center items-center font-nunito">
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-lg pointer-events-none" />
              <div className="absolute bottom-3 left-3 z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm">Preview</p>
              </div>
            </div>
            <div className="flex-[3_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
              <TextField
                label="Write your testimonial!"
                type="text"
                placeholder="Write your review here..."
                defaultValue="hi there"
                className={`w-full text-myred p-4 rounded-lg shadow-sm transition-colors duration-150
              bg-myred/90 placeholder:text-gray-400 border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-mywhite/20
              dark:bg-myred/90 dark:text-myblack dark:placeholder:text-gray-500 dark:border-gray-200 dark:focus:ring-myblack/20`}
              />
            </div>
            <div className="flex-[1_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
              <ContentCard heading=" ✈️ Smart Personalized Trips">
                Get custom travel itineraries based on your interests, budget,
                and time. No templates — your trip feels uniquely yours, every
                time.
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
                  experiences curated by AI trained on real traveler feedback
                  and regional insights.
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
            <ArrowUp className="mr-2 h-4 w-4" />
            Scroll Up
          </Button>
        </div>
      </div>
    </>
  );
}
