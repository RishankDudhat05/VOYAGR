import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "./input_field";
import PlaceCard from "./PlaceCard";
import MiniPlaceCard from "./MiniPlaceCard";
import Button from "./Button";
import { getRecommendations, getLocationRecommendations } from "./api";

/* ---------------- TYPES ---------------- */

type FormState = {
  tripName: string;
  notes: string;
  startDate: string;
  endDate: string;
};

type Place = {
  id: string;
  name: string;
  location: string;
  tags: string[];
  rating?: number;
  reviews?: number;
  description: string;
  priceLabel: string;
  timeLabel: string;
  daysLabel: string;
};

type ManualPlaceForm = {
  name: string;
  location: string;
  description: string;
  priceLabel: string;
  timeLabel: string;
  daysLabel: string;
};

type RecommendedPlace = {
  id: string;
  title: string;
  rating: number;
  reviews: number;
  // extra fields from backend
  location?: string;
  description?: string;
  priceLabel?: string;
  timeLabel?: string;
  daysLabel?: string;
  tags?: string[];
};

/* ---------------- COMPONENT ---------------- */

export default function ManualPlannerForm({
  onSubmitComplete,
}: {
  onSubmitComplete: (data: any) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<FormState>({
    tripName: "",
    notes: "",
    startDate: "",
    endDate: "",
  });

  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

  /* ----------- MANUAL PLACE STATE ----------- */

  const [manualPlace, setManualPlace] = useState<ManualPlaceForm>({
    name: "",
    location: "",
    description: "",
    priceLabel: "",
    timeLabel: "",
    daysLabel: "",
  });

  /* ----------- RECOMMENDED ----------- */

  const [recommended, setRecommended] = useState<RecommendedPlace[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const fetchRecommendations = (
    currentPlaces: Place[],
    append: boolean = false,
    topK: number = 5,
    exclude: string[] = []
  ) => {
    setLoadingRecs(true);
    const placeNames = currentPlaces.map((p) => `${p.name} (${p.location})`);
    getRecommendations(placeNames, topK, exclude)
      .then((data) => {
        if (data && data.recommendations) {
          const mapped = data.recommendations.map((rec: any) => ({
            id: crypto.randomUUID(),
            title: rec.name,
            rating: 4.5, // Mock rating
            reviews: 100 + Math.floor(Math.random() * 900), // Mock reviews
            location: rec.location,
            description: rec.description,
            priceLabel: rec.entry_price,
            timeLabel: rec.timings,
            daysLabel: rec.open_days,
            tags: rec.category ? rec.category.split(", ") : ["Recommended"],
          }));

          if (append) {
            setRecommended((prev) => {
              const existingTitles = new Set(prev.map((x) => x.title));
              const newRecs = mapped.filter((m: RecommendedPlace) => !existingTitles.has(m.title));
              return [...prev, ...newRecs];
            });
          } else {
            setRecommended(mapped);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load recommendations", err);
        alert(`Failed to fetch recommendations: ${err.message}`);
      })
      .finally(() => setLoadingRecs(false));
  };

  useEffect(() => {
    // Check for initial place from navigation state
    const initialPlace = location.state?.place;
    const initialStartDate = location.state?.startDate;
    const initialEndDate = location.state?.endDate;

    // Set dates from navigation state
    if (initialStartDate) {
      setState((prev) => ({ ...prev, startDate: initialStartDate }));
    }
    if (initialEndDate) {
      setState((prev) => ({ ...prev, endDate: initialEndDate }));
    }

    if (initialPlace) {
      setManualPlace((prev) => ({ ...prev, name: initialPlace, location: initialPlace }));
      const seedPlace: Place = {
        id: "seed-context",
        name: initialPlace,
        location: initialPlace,
        tags: [],
        description: "Initial search context",
        priceLabel: "",
        timeLabel: "",
        daysLabel: "",
      };
      fetchRecommendations([seedPlace]);
    } else {
      // Initial fetch with empty list (uses only search history)
      fetchRecommendations([]);
    }
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleChange =
    (key: keyof FormState) =>
    (e: any) => {
      setState((s) => ({ ...s, [key]: e.target?.value ?? "" }));
    };

  const handleManualPlaceChange =
    (key: keyof ManualPlaceForm) =>
    (e: any) => {
      setManualPlace((p) => ({ ...p, [key]: e.target?.value ?? "" }));
    };

  const handleManualSearch = async () => {
    if (!manualPlace.name) {
      alert("Please enter a place name to search recommendations");
      return;
    }
    
    setLoadingRecs(true);
    
    // Exclude currently displayed recommendations and selected places to ensure uniqueness
    const excludeList = [
      ...recommended.map(r => r.title),
      ...selectedPlaces.map(p => p.name)
    ];
    
    try {
      const data = await getLocationRecommendations(
        manualPlace.name,
        manualPlace.location || manualPlace.name,
        excludeList,
        5
      );
      
      if (data && data.recommendations) {
        const mapped = data.recommendations.map((rec: any) => ({
          id: crypto.randomUUID(),
          title: rec.name,
          rating: 4.0 + Math.random(), // 4.0 - 5.0 rating
          reviews: 100 + Math.floor(Math.random() * 900),
          location: rec.location,
          description: rec.description,
          priceLabel: rec.entry_price,
          timeLabel: rec.timings,
          daysLabel: rec.open_days,
          tags: rec.category ? rec.category.split(", ") : ["Recommended"],
        }));
        
        // Replace existing recommendations with new ones for this location
        setRecommended(mapped);
      }
    } catch (err: any) {
      console.error("Failed to load location recommendations", err);
      alert(`Failed to fetch recommendations: ${err.message}`);
    } finally {
      setLoadingRecs(false);
    }
  };

  const addManualPlace = () => {
    if (!manualPlace.name || !manualPlace.location) {
      alert("Please enter at least place name and location");
      return;
    }

    const newPlace = {
      id: crypto.randomUUID(),
      name: manualPlace.name,
      location: manualPlace.location,
      tags: ["Custom"],
      description: manualPlace.description || "Custom added place",
      priceLabel: manualPlace.priceLabel || "—",
      timeLabel: manualPlace.timeLabel || "Flexible",
      daysLabel: manualPlace.daysLabel || "All Days",
    };

    const updatedPlaces = [...selectedPlaces, newPlace];
    setSelectedPlaces(updatedPlaces);

    // Always fetch recommendations when a manual place is added
    fetchRecommendations(updatedPlaces, true, 1);

    // reset form
    setManualPlace({
      name: "",
      location: "",
      description: "",
      priceLabel: "",
      timeLabel: "",
      daysLabel: "",
    });
  };

  const addRecommended = (id: string) => {
    const place = recommended.find((r) => r.id === id);
    if (!place) return;

    const newPlace = {
      id: place.id,
      name: place.title,
      location: place.location || "Unknown Location",
      tags: place.tags || ["Recommended"],
      rating: place.rating,
      reviews: place.reviews,
      description: place.description || "Recommended place added manually.",
      priceLabel: place.priceLabel || "—",
      timeLabel: place.timeLabel || "Flexible",
      daysLabel: place.daysLabel || "All Days",
    };

    const updatedPlaces = [...selectedPlaces, newPlace];
    setSelectedPlaces(updatedPlaces);

    const remaining = recommended.filter((r) => r.id !== id);
    setRecommended(remaining);

    // Refresh recommendations based on the new list
    if (remaining.length < 5) {
      fetchRecommendations(updatedPlaces, true, 1);
    }
  };

  const handleDeletePlace = (id: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlaces.length === 0) {
      alert("Please add at least one place to your itinerary");
      return;
    }

    if (!state.startDate || !state.endDate) {
      alert("Please select start and end dates for your trip");
      return;
    }

    // Calculate number of days
    const start = new Date(state.startDate);
    const end = new Date(state.endDate);
    const diffTime = end.getTime() - start.getTime();
    const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (numDays < 1) {
      alert("End date must be after or equal to start date");
      return;
    }

    // Distribute places across days (max 4 places per day)
    const days = [];
    const placesPerDay = Math.min(4, Math.ceil(selectedPlaces.length / numDays));
    let placeIndex = 0;

    for (let i = 0; i < numDays && placeIndex < selectedPlaces.length; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(dayDate.getDate() + i);
      const formattedDate = dayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const dayPlaces = [];
      for (let j = 0; j < placesPerDay && placeIndex < selectedPlaces.length; j++) {
        const p = selectedPlaces[placeIndex];
        dayPlaces.push({
          id: p.id,
          name: p.name,
          location: p.location,
          tags: p.tags,
          rating: p.rating,
          reviews: p.reviews,
          description: p.description,
          priceLabel: p.priceLabel,
          timeLabel: p.timeLabel,
        });
        placeIndex++;
      }

      if (dayPlaces.length > 0) {
        days.push({
          day: i + 1,
          date: formattedDate,
          places: dayPlaces,
        });
      }
    }

    // Format the data as an itinerary for ResultPage
    const itineraryPayload = {
      type: "itinerary",
      title: state.tripName || "My Manual Trip",
      days,
      notes: state.notes,
    };

    // Invoke optional callback and navigate to result page with the manual itinerary
    try {
      onSubmitComplete?.(itineraryPayload);
    } catch (err) {
      // ignore callback errors here
      console.warn("onSubmitComplete callback failed", err);
    }

    navigate("/results", { state: { manualItinerary: itineraryPayload } });
  };

  /* ---------------- UI ---------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-myred dark:bg-gradient-to-br dark:from-myblack dark:to-myred p-8 border-2 min-w-lg max-w-1048 rounded-2xl border-myblack"
      style={{ maxWidth: 1100, margin: "0 auto" }}
    >
      <p className="font-bold text-4xl italic mb-6">
        Manual Itinerary Planner
      </p>

      {/* Trip Inputs */}
      <InputField
        label="Trip Name"
        value={state.tripName}
        onChange={handleChange("tripName")}
        placeholder="Summer Trip 2025"
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <InputField
          label="Start Date"
          type="date"
          value={state.startDate}
          onChange={handleChange("startDate")}
          placeholder=""
        />
        <InputField
          label="End Date"
          type="date"
          value={state.endDate}
          onChange={handleChange("endDate")}
          placeholder=""
        />
      </div>

      <div className="mt-4">
        <InputField
          label="Notes"
          value={state.notes}
          onChange={handleChange("notes")}
          placeholder="Add notes..."
        />
      </div>

      {/* -------- MANUAL PLACE ENTRY -------- */}
      <p className="text-2xl font-semibold ml-4 mt-8">
        Add Place Manually
      </p>

      <div className="grid grid-cols-2 gap-4 p-3">
        <InputField
          label="Place Name"
          value={manualPlace.name}
          onChange={handleManualPlaceChange("name")}
          placeholder="Baga Beach"
        />
        <InputField
          label="Location"
          value={manualPlace.location}
          onChange={handleManualPlaceChange("location")}
          placeholder="Goa"
        />
        <InputField
          label="Description"
          value={manualPlace.description}
          onChange={handleManualPlaceChange("description")}
          placeholder="Relaxing beach spot"
        />
        <InputField
          label="Entry Fee / Price"
          value={manualPlace.priceLabel}
          onChange={handleManualPlaceChange("priceLabel")}
          placeholder="₹0"
        />
        <InputField
          label="Timings"
          value={manualPlace.timeLabel}
          onChange={handleManualPlaceChange("timeLabel")}
          placeholder="6 AM - 7 PM"
        />
        <InputField
          label="Days"
          value={manualPlace.daysLabel}
          onChange={handleManualPlaceChange("daysLabel")}
          placeholder="All Days"
        />
      </div>

      <div className="ml-4 mt-2 flex gap-4">
        <Button
          type="button"
          variant="solid"
          color="myblack"
          onClick={addManualPlace}
        >
          + Add Place
        </Button>
        <Button
          type="button"
          variant="solid"
          color="myblack"
          onClick={handleManualSearch}
          disabled={loadingRecs}
        >
          {loadingRecs ? "Loading..." : "Get Recommendations"}
        </Button>
      </div>

      {/* Selected Places */}
      <p className="text-2xl font-semibold ml-4 mt-8">
        Selected Places
      </p>

      <div className="grid grid-cols-2 gap-4 p-3">
        {selectedPlaces.map((p) => (
          <PlaceCard
            key={p.id}
            {...p}
            onDelete={() => handleDeletePlace(p.id)}
          />
        ))}
      </div>

      {/* Recommended */}
      <p className="text-2xl font-semibold ml-4 mt-6">
        Recommended Places
      </p>
      <div className="flex gap-3 flex-wrap p-3">
        {recommended.map((r) => (
          <MiniPlaceCard
            key={r.id}
            id={r.id}
            title={r.title}
            rating={r.rating}
            reviews={r.reviews}
            onAdd={addRecommended}
          />
        ))}
      </div>

      {/* Submit */}
      <Button type="submit" variant="solid" color="myblack">
        ✈️ Save Manual Itinerary
      </Button>
    </form>
  );
}
