interface DayTextProps {
  day_num: number;
  activities: string;
}

export default function DayText({ day_num, activities }: DayTextProps) {
  return (
    <div>
      <h3 className="font-bold text-lg">Day {day_num}</h3>
      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{activities}</p>
    </div>
  );
}
