// src/ResultPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import BackButton from "./BackButton";
import DayText from "./DayText"; // fallback when only "plan" text exists
import { getAIResponse } from "./api";
import Button from "./Button";
import PlaceCard from "./PlaceCard"; // timeline / place cards


import { generatePdfFromElement } from "./lib/generatePdf";



const ResultStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito { font-family: 'Nunito', sans-serif; }
`;

interface Place {
  id: string;
  name: string;
  location?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  priceLabel?: string;
  timeLabel?: string;
}

interface APIDay {
  day?: number | string;
  date?: string;
  plan?: string[];
  places?: any[];
}

interface UIDay {
  day: number | string;
  date?: string;
  places: Place[];
  // backup plan text for DayText if there are no place cards
  planText?: string;
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { prompt?: string } | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<any | null>(null);

  // UI-ready days (for the timeline)
  const [uiDays, setUiDays] = useState<UIDay[]>([]);

  // refs for timeline red line heights
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [heights, setHeights] = useState<Record<number, number>>({});

  // reference for pdf export (only around the main trip content)
 

  // ---------- DARK / LIGHT THEME TOGGLE ----------
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // ---------- FETCH FROM BACKEND ----------
  useEffect(() => {
    const prompt = state?.prompt;

    if (!prompt) {
      setError("No prompt provided.");
      return;
    }

    setLoading(true);
    setError("");

    getAIResponse(prompt)
      .then((obj) => setPayload(obj))
      .catch((err) => setError(err.message || "Unknown error"))
      .finally(() => setLoading(false));
  }, [state]);

  // ---------- TRANSFORM PAYLOAD -> UI DAYS ----------
  useEffect(() => {
    if (!payload || payload.type !== "itinerary") {
      setUiDays([]);
      return;
    }

    const apiDays: APIDay[] = Array.isArray(payload.days) ? payload.days : [];

    const mapped: UIDay[] = apiDays.map((d, dayIndex) => {
      const dayNumber = d.day ?? dayIndex + 1;
      const date =
        d.date ||
        (d as any)["formatted_date"] ||
        (d as any)["dateString"] ||
        undefined;

      let places: Place[] = [];

      // If backend already gives detailed places
      if (Array.isArray(d.places) && d.places.length > 0) {
        places = d.places.map((p: any, idx: number) => ({
          id: p.id?.toString() ?? `${dayNumber}-${idx}`,
          name: p.name ?? `Place ${idx + 1}`,
          location: p.location,
          tags: p.tags,
          rating: p.rating,
          reviews: p.reviews,
          description: p.description ?? p.details ?? "",
          priceLabel: p.priceLabel ?? p.price ?? "",
          timeLabel: p.timeLabel ?? p.duration ?? "",
        }));
      } else if (Array.isArray(d.plan)) {
        // Only "plan" text exists → convert each activity into a simple card
        places = d.plan.map((txt: string, idx: number) => ({
          id: `${dayNumber}-${idx}`,
          name:
            txt.split(".")[0]?.slice(0, 60) ||
            `Activity ${idx + 1} (Day ${dayNumber})`,
          description: txt,
        }));
      }

      const planText = Array.isArray(d.plan) ? d.plan.join(". ") : undefined;

      return {
        day: dayNumber,
        date,
        places,
        planText,
      };
    });

    setUiDays(mapped);
  }, [payload]);

  // ---------- MEASURE HEIGHTS FOR RED TIMELINE ----------
  useEffect(() => {
    const computeHeights = () => {
      const newHeights: Record<number, number> = {};
      uiDays.forEach((_, idx) => {
        const el = cardRefs.current[idx];
        newHeights[idx] = el ? el.scrollHeight : 0;
      });
      setHeights(newHeights);
    };

    computeHeights();
    window.addEventListener("resize", computeHeights);
    return () => window.removeEventListener("resize", computeHeights);
  }, [uiDays]);

  // ---------- EDITING ACTIONS (DELETE / MOVE) ----------

  // delete one place from a given day
  const handleDeletePlace = (dayIdx: number, placeIdx: number) => {
    setUiDays((prev) =>
      prev.map((day, dIdx) =>
        dIdx !== dayIdx
          ? day
          : {
              ...day,
              places: day.places.filter((_, idx) => idx !== placeIdx),
            }
      )
    );
  };

  /**
   * Move a place up/down across the whole itinerary.
   * - "up":
   *    - if not first in its day -> swap with previous in same day
   *    - if first in day -> move to previous day (bottom)
   * - "down":
   *    - if not last in its day -> swap with next in same day
   *    - if last in day -> move to next day (top)
   */
  const handleMovePlace = (
    dayIdx: number,
    placeIdx: number,
    direction: "up" | "down"
  ) => {
    setUiDays((prev) => {
      const days = prev.map((d) => ({ ...d, places: [...d.places] }));

      const currentDay = days[dayIdx];
      if (!currentDay) return prev;

      const currentPlace = currentDay.places[placeIdx];
      if (!currentPlace) return prev;

      if (direction === "up") {
        // inside same day
        if (placeIdx > 0) {
          [currentDay.places[placeIdx - 1], currentDay.places[placeIdx]] = [
            currentDay.places[placeIdx],
            currentDay.places[placeIdx - 1],
          ];
          return days;
        }

        // move to previous day (bottom)
        if (dayIdx === 0) return prev; // top-most already
        currentDay.places.splice(placeIdx, 1);
        const prevDay = days[dayIdx - 1];
        prevDay.places.push(currentPlace);
        return days;
      } else {
        // direction === "down"
        if (placeIdx < currentDay.places.length - 1) {
          [currentDay.places[placeIdx + 1], currentDay.places[placeIdx]] = [
            currentDay.places[placeIdx],
            currentDay.places[placeIdx + 1],
          ];
          return days;
        }

        // move to next day (top)
        if (dayIdx === days.length - 1) return prev; // last day already
        currentDay.places.splice(placeIdx, 1);
        const nextDay = days[dayIdx + 1];
        nextDay.places.unshift(currentPlace);
        return days;
      }
    });
  };

  // ---------- PDF EXPORT FUNCTION ----------
 // ---------- PDF EXPORT FUNCTION ----------
const downloadPDF = () => {
  generatePdfFromElement("trip-content", "voyagr_trip.pdf");
};


  if (loading) return <p className="m-4">Loading AI response...</p>;
  if (error) return <p className="m-4 text-red-600">Error: {error}</p>;
  if (!payload) return null;

  const type = payload.type ?? "unknown";

  const tripTitle =
    payload.title ||
    (payload.cities && payload.cities.length
      ? `Trip to ${payload.cities.join(", ")}`
      : payload.country
      ? `Trip to ${payload.country}`
      : "Your Trip");

  return (
    <>
      <style>{ResultStyle}</style>

      <BackButton />

      {/* Top-right bar: theme toggle + username + logout */}
      <div className="flex flex-row items-center gap-4 fixed top-4 right-16 m-2 p-2 font-nunito z-40">
        <Button variant="wout_border" onClick={handleToggleTheme}>
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
        <p className="font-medium">Username</p>
        <Button variant="wout_border" onClick={() => navigate("/")}>
          Logout
        </Button>
      </div>

      <div className="m-4 font-nunito">
        {/* PDF Export Button */}
        <div className="flex justify-end mb-4">
          <Button variant="filled_wout_border" onClick={downloadPDF}>
            Export as PDF
          </Button>
        </div>

        {/* ----------- CONTENT WRAPPER FOR PDF ----------- */}
        <div id="trip-content">
          {/* ========== ITINERARY → TIMELINE UI ========== */}
          {type === "itinerary" && (
            <div className="min-h-screen bg-white text-myblack dark:bg-gray-900 dark:text-gray-50">
              {/* Header similar to timeline design */}
              <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="max-w-6xl mx-auto px-6 py-4">
                  <div className="text-xl font-semibold text-gray-500">
                    mytrip/
                  </div>
                  <div className="text-3xl font-bold italic underline">
                    {tripTitle}
                  </div>
                </div>
              </header>

              <main className="max-w-6xl mx-auto px-6 py-2 pb-12">
                {uiDays.map((dayBlock, idx) => {
                  const redHeight = heights[idx] ?? 0;

                  return (
                    <section
                      key={idx}
                      className="flex items-start gap-4 mb-12"
                    >
                      {/* Left column: Day label / red line (date removed) */}
                      <div
                        className="flex flex-col items-center"
                        style={{ width: "auto" }}
                      >
                        <div className="text-myred font-semibold text-3xl leading-tight text-center">
                          Day {dayBlock.day}
                        </div>

                        {/* space between label and line */}
                        <div style={{ height: 20 }} />

                        {/* red vertical line */}
                        <div
                          className="w-[4px] bg-myred rounded"
                          style={{ height: redHeight, minHeight: 24 }}
                        />
                      </div>

                      {/* Right column: cards container */}
                      <div
                        className="flex-1 mt-20"
                        ref={(el) => {
                          cardRefs.current[idx] = el;
                        }}
                      >
                        {/* If we have detailed places → PlaceCard timeline */}
                        {dayBlock.places.length > 0 ? (
                          <div className="flex flex-col gap-4">
                            {dayBlock.places.map((p, placeIdx) => (
                              <div key={p.id}>
                                <PlaceCard
                                  id={p.id}
                                  name={p.name}
                                  location={p.location}
                                  tags={p.tags}
                                  rating={p.rating}
                                  reviews={p.reviews}
                                  description={p.description}
                                  priceLabel={p.priceLabel}
                                  timeLabel={p.timeLabel}
                                  // NEW callbacks:
                                  onMoveUp={() =>
                                    handleMovePlace(idx, placeIdx, "up")
                                  }
                                  onMoveDown={() =>
                                    handleMovePlace(idx, placeIdx, "down")
                                  }
                                  onDelete={() =>
                                    handleDeletePlace(idx, placeIdx)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Fallback: just show DayText (if only "plan" exists)
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <DayText
                              day_num={Number(dayBlock.day) || idx + 1}
                              activities={dayBlock.planText ?? "No details."}
                            />
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </main>
            </div>
          )}

          {/* ========== PLACES TYPE (recommendations) ========== */}
          {type === "places" && (
            <div className="min-h-screen bg-white text-myblack dark:bg-gray-900 dark:text-gray-50">
              <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="max-w-6xl mx-auto px-6 py-4">
                  <div className="text-xl font-semibold text-gray-500">
                    mytrip/
                  </div>
                  <div className="text-3xl font-bold italic underline">
                    Top Recommendations — {payload.location ?? "Unknown"}
                  </div>
                  {payload.category && (
                    <div className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                      Category: {payload.category}
                    </div>
                  )}
                </div>
              </header>

              <main className="max-w-6xl mx-auto px-6 py-2 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(payload.places ?? []).map((p: any, idx: number) => (
                    <PlaceCard
                      key={p.id?.toString() ?? `place-${idx}`}
                      id={p.id?.toString() ?? `place-${idx}`}
                      name={p.name ?? "Unnamed place"}
                      location={p.location}
                      tags={p.tags}
                      rating={p.rating}
                      reviews={p.reviews}
                      description={p.description}
                      priceLabel={p.priceLabel}
                      timeLabel={p.timeLabel}
                    />
                  ))}
                </div>
              </main>
            </div>
          )}
        </div>

        {/* Bottom button to go back and plan again */}
        <div className="flex justify-center mt-8">
          <Button
            variant="filled_wout_border"
            color="myblack"
            onClick={() => navigate(-1)}
          >
            Plan Another Trip
          </Button>
        </div>
      </div>
    </>
  );
}
