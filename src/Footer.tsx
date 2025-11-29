const HeroStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

export default function ContentSection() {
  return (
    <>
      <style>{HeroStyle}</style>
      <div className="m-4 p-4 justify-center items-center bg-gray-950 font-nunito min-h-64">
        <p className="text-mywhite dark:text-mywhite font-bold text-2xl">Group 13</p>
        <p className="text-mywhite dark:text-mywhite font-bold text-2xl">IT314 Project - DAU</p>

        {/* Footer tagline */}
        <div className="absolute bottom-8 justify-center text-center font-nunito text-mywhite dark:text-mywhite italic pointer-events-none">
          <p>Crafted with ❤️ by Team VOYAGR</p>
        </div>
      </div>
    </>
  );
}
