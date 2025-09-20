import type { ReactNode } from "react";

const ContentCardStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

// Props for the ContentCard component
interface ContentCardProps {
  heading: string;
  children: ReactNode;
  img_src?: string;
  onClick?: () => void;
}

export default function ContentCard({
  heading,
  children,
  onClick,
}: ContentCardProps) {
  return (
    <>
      <style>{`
      ${ContentCardStyle}
      .content-card:hover .content-card-heading {
        background-color: #000;
        color: #fff;
        border-radius: 0.75rem 0.75rem 0.75rem 0.75rem;
        border-color: #000;
      }
      `}</style>
      {/* Card container with conditional cursor style */}
      <div
        onClick={onClick}
        className={`content-card m-2 p-4 bg-gray-300 font-nunito max-w-sm rounded-xl shadow-none border border-1
             transition hover:shadow-sm hover:scale-[1.01] hover:bg-white${
               onClick ? " cursor-pointer" : ""
             }`}
      >
        <h2 className="content-card-heading text-2xl font-semibold mb-2 px-2 py-2 transition-colors">
          {heading}
        </h2>
        <p className="mt-2 text-gray-800 text-1xl font-normal">{children}</p>
      </div>
    </>
  );
}
