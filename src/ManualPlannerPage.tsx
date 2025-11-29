import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./components/theme-toggle";
import { generatePdfFromElement } from "./lib/generatePdf";
import ManualPlannerForm from "./ManualPlannerForm";
import PlaceCard from "./PlaceCard";

export default function ManualPlannerPage() {
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const [result, setResult] = useState<any | null>(null);

  const handleSubmitComplete = (data: any) => {
    setResult(data);
  };

 /* const handlePdf = () => {
    if (pdfRef.current) generatePdfFromElement(pdfRef.current);
  };
*/
  return (
    <>
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>

      <div style={{ padding: 16 }}>
        <header style={{ display: "flex", gap: 12 }}>
          <Button onClick={() => navigate("/prompt")}>Go Back</Button>

          {result ? (
            <Button
              variant="solid"
              color="myblack"
              onClick={() => generatePdfFromElement("trip-content", "My_Trip.pdf")}
            >
              Export PDF
            </Button>
          ) : null}
        </header>

        {/* PDF Target */}
        <main id="trip-content" ref={pdfRef} style={{ marginTop: 16 }}>
          {!result ? (
            <ManualPlannerForm onSubmitComplete={handleSubmitComplete} />
          ) : (
            <>
              <p className="text-4xl font-bold italic mb-6">
                {result.tripName}
              </p>

              <p className="text-xl mb-4 italic">{result.notes}</p>

              <h2 className="text-2xl font-semibold mb-4">Your Itinerary</h2>

              <div className="grid grid-cols-2 gap-4">
                {result.places.map((p: any) => (
                  <PlaceCard key={p.id} {...p} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
