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
            <div className="flex-[2_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm">
              <img
                src="logo_0.png"
                alt="LogoBackdrop"
                className="w-full h-full object-contain object-center rounded-lg"
              />
            </div>
            <div className="flex-[3_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm">
              <TextField
                label="Write your testimonial!"
                type="text"
                placeholder="Write your review here..."
                value="hi there"
                className="bg-mywhite"
              />
            </div>
            <div className="flex-[1_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm">
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
              <p className="absolute bottom-32 left-24 z-10 m-0 p-2 font-extrabold text-4xl italic text-white">
                Great Places
              </p>
              <p className="absolute bottom-8 left-24 z-10 m-0 p-2 font-thin text-5xl text-white">
                Unforgettable Memories
              </p>
            </div>
            <div className="flex-[2_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm">
              <ContentCard heading="🔄 Dynamic Real-Time Adjustments">
                Plans change? Weather shifts? Crowds hit? Your itinerary updates
                instantly with new routes, recommendations, and optimal timings.
              </ContentCard>
            </div>
            <div className="flex-[2_1_0%] h-72 m-2 p-0 border-2 rounded-lg shadow-sm">
              <ContentCard heading="📍Local-Inspired Recommendations">
                Discover hidden gems, local favorites, and authentic experiences
                curated by AI trained on real traveler feedback and regional
                insights.
              </ContentCard>
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
