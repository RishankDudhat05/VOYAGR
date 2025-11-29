export type PlaceCardProps = {
  id: string;
  name: string;
  location?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  priceLabel?: string;
  timeLabel?: string;
  daysLabel?: string;
  forceBlack?: boolean;

  // map URL for Google Maps
  mapUrl?: string;

  // actions for itinerary editing
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
};

export default function PlaceCard({
  name,
  location,
  tags = [],
  rating,
  reviews,
  description,
  priceLabel,
  timeLabel,
  daysLabel,
  forceBlack = false,
  mapUrl,
  onMoveUp,
  onMoveDown,
  onDelete,
}: PlaceCardProps) {
  const forceClass = forceBlack ? "bg-myblack text-white" : "";

  return (
    <div
      className={`
        w-full rounded-xl border p-5 
        bg-mywhite dark:bg-myblack 
        text-myblack dark:text-white 
        transition-colors
        ${forceClass}
      `}
    >
      {/* Header */}
      <div className="flex justify-between gap-4">
        <div>
          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="m-0 text-[20px] font-bold text-myred hover:underline"
            >
              {name}
            </a>
          ) : (
            <h3 className="m-0 text-[20px] font-bold">{name}</h3>
          )}

          {location && (
            <div className="mt-1 text-[13px] opacity-70">{location}</div>
          )}

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="
                    rounded-full px-3 py-1 text-[12px] font-bold
                    bg-red-50 border border-red-100 text-red-700
                    dark:bg-white/10 dark:border-white/10 dark:text-white
                  "
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="text-right min-w-[80px]">
          {typeof rating === "number" && (
            <div className="text-[16px] font-bold">
              {rating.toFixed(1)} ★
            </div>
          )}
          {typeof reviews === "number" && (
            <div className="text-[12px] opacity-70">
              {reviews.toLocaleString()} reviews
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-3 leading-5 opacity-90">{description}</p>
      )}

      {/* Info + Buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {priceLabel && <div>💰 {priceLabel}</div>}
        {timeLabel && <div>⏰ {timeLabel}</div>}
        {daysLabel && <div>📅 {daysLabel}</div>}

        {(onMoveUp || onMoveDown || onDelete) && (
          <div className="ml-auto flex gap-3">
            {/* Up button */}
            {onMoveUp && (
              <button
                type="button"
                onClick={onMoveUp}
                className="
                  rounded-md px-3 py-2 text-sm font-semibold
                  bg-red-50 border border-red-200 text-red-700
                  dark:bg-white/10 dark:border-white/20 dark:text-blue-200
                "
              >
                ↑
              </button>
            )}

            {/* Down button */}
            {onMoveDown && (
              <button
                type="button"
                onClick={onMoveDown}
                className="
                  rounded-md px-3 py-2 text-sm font-semibold
                  bg-red-50 border border-red-200 text-red-700
                  dark:bg-white/10 dark:border-white/20 dark:text-blue-200
                "
              >
                ↓
              </button>
            )}

            {/* Delete button */}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="
                  rounded-md px-3 py-2 text-sm font-semibold
                  bg-red-100 border border-red-300 text-red-900
                  dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-200
                "
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
