import { useState, useEffect } from "react";
import Button from "./Button";
import ContentCard from "./ContentCard";
import { ArrowUp } from "lucide-react"; // helps in importing icons
import TextField from "./input_field";
import { submitReview, getReviews } from "./api";

type Review = {
  review: string;
  user_name: string;
  submitted_at: string;
};

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
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token && token !== "undefined" && token !== "null");

    // Fetch reviews for logged out users
    if (!token || token === "undefined" || token === "null") {
      getReviews()
        .then((data) => setReviews(data.reviews || []))
        .catch((err) => console.error("Failed to fetch reviews", err));
    }
  }, []);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      alert("Please write a review before submitting.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReview(reviewText);
      alert("Review submitted successfully!");
      setReviewText("");
    } catch (err: any) {
      alert(`Failed to submit review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <style>{HeroStyle}</style>
      <div className="flex flex-col m-8 mb-32 p-2 justify-center items-start font-nunito">
        <p className="m-2 p-4 font-extralight text-9xl">Features</p>
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
              {isLoggedIn ? (
                <>
                  <TextField
                    label={
                      <span className="text-mywhite dark:text-myblack">
                        Write your testimonial!
                      </span>
                    }
                    type="text"
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e: any) => setReviewText(e.target.value)}
                    className={`w-full text-myblack p-4 rounded-lg shadow-sm transition-colors duration-150
    bg-myred/90 placeholder:text-myblack dark:placeholder:text-mywhite border border-gray-700
    focus:outline-none focus:ring-2 focus:ring-mywhite/20
    dark:bg-myred/90 dark:text-mywhite dark:placeholder:text-mywhite dark:border-gray-200 dark:focus:ring-myblack/20`}
                  />
                  <Button
                    color="myblack"
                    variant="filled"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </>
              ) : (
                <div className="h-full p-4 rounded-lg bg-mywhite text-myblack dark:bg-myblack dark:text-mywhite border-2 border-myred/30 overflow-y-auto">
                  <p className="text-xl font-semibold mb-4">
                    💬 What our users say
                  </p>
                  {reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.map((r, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-myred/20 rounded-lg border border-myblack/70 dark:bg-myred/20 dark:border-mywhite/30"
                        >
                          <p className="text-sm italic">"{r.review}"</p>
                          <p className="text-xs mt-1">— {r.user_name || "Anonymous"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-mywhite/60 text-sm">No reviews yet. Be the first to share your experience!</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex-[1_1_0%] h-72 m-2 p-0 border-0 rounded-lg shadow-sm">
              <ContentCard heading="✈️ Smart Personalized Trips">
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
                  Plans change? Crowds hit? Your itinerary
                  updates instantly with new routes, recommendations, and
                  optimal timings by prompting with AI!
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
