// Define a CSS block as a template string
// It imports the "Nunito" font from Google Fonts
// and defines a custom CSS class `.font-nunito` that applies this font.
const MyStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

// Define TypeScript interface for the props of this component.
// - day_num: a number representing the day (e.g., 1, 2, 3)
// - activities: a string describing the activities of that day
interface ResultPageProps {
  day_num: number;
  activities: string;
}

// Functional React component `DayText`
// Accepts props that match the ResultPageProps interface.
export default function DayText({ day_num, activities }: ResultPageProps) {
  return (
    <>
      {/* Inject custom styles (Google font + .font-nunito class) into the DOM */}
      <style>{MyStyle}</style>

      {/* Container div with flexbox layout in column direction */}
      <div className="flex flex-col">
        {/* Show the day number in bold text */}
        <p className="font-semibold">Day {day_num}</p>

        {/* Show the activities description text */}
        <p className="regular">{activities}</p>
      </div>
    </>
  );
}
