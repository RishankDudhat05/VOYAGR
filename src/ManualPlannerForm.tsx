// ManualPlannerForm.tsx
import React, { useState } from "react";
import InputField from "./input_field";
import PlaceCard from "./PlaceCard"; // keep for full-size selected places
import MiniPlaceCard from "./MiniPlaceCard"; // keep for mini recommended places
import Button from "./Button";

type FormState = {
  tripName: string;
  notes: string;
};

export default function ManualPlannerForm() {
  const [state, setState] = useState<FormState>({ tripName: "", notes: "" });

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      const value = typeof e === "string" ? e : e.target?.value ?? "";
      setState((s) => ({ ...s, [key]: value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting manual plan:", state);
  };

  // Example data (replace with real data later)
  const selectedPlaces = [
    {
      id: "kankariya-1",
      name: "Kankariya Lake",
      location: "Ahmedabad, India",
      tags: ["Historical"],
      rating: 4.4,
      reviews: 2044,
      description:
        "Kankaria Lake, located in the Maninagar area of Ahmedabad, Gujarat, is the largest artificial lake in the city, covering 76 acres and featuring a unique polygonal shape.",
      priceLabel: "200 INR",
      timeLabel: "09:30 AM - 05:30 PM",
      daysLabel: "All days",
    },
    {
      id: "kankariya-1",
      name: "Kankariya Lake",
      location: "Ahmedabad, India",
      tags: ["Historical"],
      rating: 4.4,
      reviews: 2044,
      description:
        "Kankaria Lake, located in the Maninagar area of Ahmedabad, Gujarat, is the largest artificial lake in the city, covering 76 acres and featuring a unique polygonal shape.",
      priceLabel: "200 INR",
      timeLabel: "09:30 AM - 05:30 PM",
      daysLabel: "All days",
    },
    {
      id: "kankariya-1",
      name: "Kankariya Lake",
      location: "Ahmedabad, India",
      tags: ["Historical"],
      rating: 4.4,
      reviews: 2044,
      description:
        "Kankaria Lake, located in the Maninagar area of Ahmedabad, Gujarat, is the largest artificial lake in the city, covering 76 acres and featuring a unique polygonal shape.",
      priceLabel: "200 INR",
      timeLabel: "09:30 AM - 05:30 PM",
      daysLabel: "All days",
    },
    {
      id: "kankariya-1",
      name: "Kankariya Lake",
      location: "Ahmedabad, India",
      tags: ["Historical"],
      rating: 4.4,
      reviews: 2044,
      description:
        "Kankaria Lake, located in the Maninagar area of Ahmedabad, Gujarat, is the largest artificial lake in the city, covering 76 acres and featuring a unique polygonal shape.",
      priceLabel: "200 INR",
      timeLabel: "09:30 AM - 05:30 PM",
      daysLabel: "All days",
    },
    {
      id: "city-palace-1",
      name: "City Palace",
      location: "Udaipur, India",
      tags: ["Historical", "Museum"],
      rating: 4.6,
      reviews: 1580,
      description:
        "A majestic palace showcasing the royal heritage of Udaipur — perfect for history enthusiasts.",
      priceLabel: "200 INR",
      timeLabel: "09:30 AM - 05:30 PM",
      daysLabel: "All days",
    },
  ];

  const recommended = [
    { id: "r1", title: "Kankariya Lake", rating: 4.4, reviews: 2044 },
    { id: "r2", title: "Shri Akshardham", rating: 4.5, reviews: 1200 },
    { id: "r3", title: "Sabarmati Ashram", rating: 4.3, reviews: 980 },
    { id: "r3", title: "Sabarmati Ashram", rating: 4.3, reviews: 980 },
    { id: "r3", title: "Sabarmati Ashram", rating: 4.3, reviews: 980 },
    { id: "r3", title: "Sabarmati Ashram", rating: 4.3, reviews: 980 },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <main
        style={{
          flex: 1,
          padding: 24,
          boxSizing: "border-box",
          overflow: "auto",
        }}
      >
        <form
          className="bg-myred p-8 border-2 min-w-full rounded-2xl border-myblack dark:border-mywhite"
          onSubmit={handleSubmit}
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            
            <p className="font-bold text-4xl italic">Manual Itinerary Planner</p>
          </div>

          <div style={{ marginBottom: 16 }} className="text-myblack dark:text-mywhite">
            <InputField
              label="Trip Name"
              value={state.tripName}
              onChange={handleChange("tripName")}
              placeholder="e.g. summer vacation '25"
              inputClassName="text-myblack dark:text-mywhite placeholder:text-myblack/60 bg-myblack dark:bg-gray-800"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <InputField
              label="Notes"
              value={state.notes}
              onChange={handleChange("notes")}
              placeholder="e.g. explore the local shops and cafes"
              inputClassName="text-myblack dark:text-mywhite placeholder:text-myblack/60 bg-myblack dark:bg-gray-800"
            />
          </div>

          {/* Selected Places (full-size PlaceCard) */}
            <div style={{ marginBottom: 24 }}>
            <p className="text-2xl font-semibold ml-4 font-nunito font-mywhite">Selected Places</p>
            <div
              style={{
              padding: 12,
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))", // two cards per row
              alignItems: "start",
              }}
            >
              {selectedPlaces.map((p) => (
              <div key={p.id} style={{ width: "100%" }}>
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
                daysLabel={p.daysLabel}
                // onMove={(id: string) => console.log("Move →", id)}
                // onDelete={(id: string) => console.log("Delete →", id)}
                />
              </div>
              ))}
            </div>
            </div>

          {/* Recommended Places (mini cards row) */}
          <div style={{ marginBottom: 20 }}>
            <p className="text-2xl font-semibold ml-4 font-nunito font-mywhite">Recommended Places</p>

            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "start" }}>
              {recommended.map((r) => (
                <div key={r.id}>
                  <MiniPlaceCard
                    id={r.id}
                    title={r.title}
                    rating={r.rating}
                    reviews={r.reviews}
                    onAdd={(id) => console.log("Add recommended", id)}
                  />
                </div>
              ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <Button variant="solid" color="myblack">
              Plan My Itinerary
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

/**
 * Small adapter so ManualPlannerForm can use the MiniPlaceCard we created earlier.
 * Importing the MiniPlaceCard at top of this file would work too; to keep the file
 * self-contained I use a simple inline wrapper component that just renders the mini card.
 *
 * If your MiniPlaceCard is exported as default from "./MiniPlaceCard", import it at top:
 *   import MiniPlaceCard from "./MiniPlaceCard";
 * and then use <MiniPlaceCard ... /> directly in the map() above.
 */
// function MiniPlaceCardAdapter(props: { id: string; title: string; rating?: number; reviews?: number; onAdd?: (id: string) => void; }) {
//   // If you imported MiniPlaceCard at top, replace the returned markup with:
//   // return <MiniPlaceCard {...props} />
//   // For now we render a small inline card matching the MiniPlaceCard API (no image).
//   const { id, title, rating = 4.4, reviews = 1000, onAdd } = props;
//   const isDark = (() => {
//     const html = document.documentElement;
//     if (html.dataset.theme === "dark") return true;
//     if (html.dataset.theme === "light") return false;
//     if (html.classList.contains("dark")) return true;
//     return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
//   })();

//   const surfaceBg = isDark ? "#0b1216" : "#ffffff";
//   const borderColor = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
//   const titleColor = isDark ? "#e6eef6" : "#0b1220";
//   const metaColor = isDark ? "#9aa7b4" : "#6b7280";
//   const ratingBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.08)";

//   const cardStyle: React.CSSProperties = {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "10px 14px",
//     borderRadius: 12,
//     background: surfaceBg,
//     border: 1px solid ${borderColor},
//     minWidth: 240,
//     boxSizing: "border-box",
//   };

//   const titleStyle: React.CSSProperties = {
//     margin: 0,
//     fontSize: 14,
//     color: titleColor,
//     fontWeight: 700,
//   };

//   const ratingStyle: React.CSSProperties = {
//     background: ratingBg,
//     border: 1px solid ${borderColor},
//     padding: "3px 8px",
//     borderRadius: 6,
//     fontSize: 12,
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 4,
//     color: titleColor,
//   };

//   const addBtnStyle: React.CSSProperties = {
//     marginLeft: "auto",
//     width: 30,
//     height: 30,
//     borderRadius: 999,
//     border: 1px solid ${borderColor},
//     background: "transparent",
//     color: titleColor,
//     cursor: "pointer",
//     fontSize: 18,
//     fontWeight: 600,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   return (
//     <div style={cardStyle} role="group" aria-label={mini-${id}}>
//       <div style={{ minWidth: 0 }}>
//         <p style={titleStyle}>{title}</p>

//         <div style={{ marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
//           <div style={ratingStyle}>
//             ⭐ {rating.toFixed(1)} <span style={{ color: metaColor }}>({reviews.toLocaleString()})</span>
//           </div>
//         </div>
//       </div>

//       <button style={addBtnStyle} onClick={() => onAdd?.(id)} aria-label={Add ${title}}>
//         +
//       </button>
//     </div>
//   );
// }
