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
      <div className="m-4 p-4 bg-gray-950 font-nunito min-h-64">
        <p className="text-white font-bold text-2xl">Group 13</p>
        <p className="text-white font-bold text-2xl">IT314 Project - DAU</p>
      </div>
    </>
  );
}