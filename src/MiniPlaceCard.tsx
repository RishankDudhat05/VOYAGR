import { Star } from "lucide-react";
import Button from "./Button";

const MiniCardStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

type MiniPlaceCardProps = {
  id: string;
  title: string;
  rating?: number;
  reviews?: number;
  onAdd?: (id: string) => void;
  className?: string;
};

if (typeof document !== "undefined" && !document.getElementById("mini-card-style")) {
  const style = document.createElement("style");
  style.id = "mini-card-style";
  style.innerHTML =
    MiniCardStyle +
    `
      div { font-family: 'Nunito', sans-serif !important; }
    `;
  document.head.appendChild(style);
}

export default function MiniPlaceCard({
  id,
  title,
  rating = 4.4,
  reviews = 2044,
  onAdd,
  className = "",
}: MiniPlaceCardProps) {
  return (
    <div
      className={`inline-flex w-fit border rounded-xl p-3 shadow-sm bg-mywhite dark:bg-myblack items-center gap-2 ${className}`}
    >
      <div className="flex flex-col">
        <h2 className="font-semibold text-lg">{title}</h2>

        <div className="flex items-center gap-1 text-sm text-myblack/80 dark:text-white/80">
          <Star size={16} className="fill-yellow-500 dark:fill-blue-500" />
          <span className="text-myblack/90 dark:text-mywhite/90">{rating}</span>
          <span className="text-myblack/70 dark:text-mywhite/70">
            ({reviews} reviews)
          </span>
        </div>
      </div>

      {/* ✅ IMPORTANT FIX: type="button" */}
      <Button
        type="button"
        onClick={() => onAdd?.(id)}
        variant="wout_border"
        color="myred"
      >
        +
      </Button>
    </div>
  );
}
