import Button from "./Button";
import ContentCard from "./ContentCard";
import { ArrowUp } from "lucide-react"; // helps in importing icons

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
      <div className="flex flex-col m-8 p-2 justify-center items-center font-nunito">
        <p className="m-2 p-4 font-semibold text-3xl">Features</p>
        <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ContentCard heading="AI-Enabled Itinerary Planner">
            Plan your trips effortlessly with AI-driven suggestions tailored to
            your interests, trip duration, and budget. Receive optimized daily
            schedules, including top attractions, recommended restaurants, and
            travel routes, saving you time and effort.
          </ContentCard>
          <ContentCard heading="Places Searcher">
            Type any location, interest, or keyword, and the AI finds the best
            places for you. It suggests attractions, dining options, shopping
            spots, and hidden gems, providing curated recommendations instantly.
          </ContentCard>
          {/* <ContentCard heading="MyCard">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ContentCard>
          <ContentCard heading="MyCard">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ContentCard> */}
        </div>
        // btn to help scroll to top
        <div className="justify-start">
          <Button onClick={scrollToTop} variant="filled">
            <ArrowUp className="mr-2 h-4 w-4" />
            Scroll Up
          </Button>
        </div>
      </div>
    </>
  );
}
