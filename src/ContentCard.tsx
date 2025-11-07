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
        background-color: #f7fbfa;
        border-radius: 0.75rem 0.75rem 0.75rem 0.75rem;
        border-color: #f7fbfa;
      }
      `}</style>
      {/* Card container with conditional cursor style */}
      <div
        onClick={onClick}
        className={`content-card m-2 p-4 bg-mywhite text-myblack font-nunito w-full rounded-lg shadow-none border border-1
             transition hover:shadow-sm hover:scale-[1.02] hover:bg-myred hover:text-myred${
               onClick ? " cursor-pointer" : ""
             }`}
      >
        <h2 className="content-card-heading text-2xl font-semibold mb-2 px-2 py-2 transition-colors">
          {heading}
        </h2>
        <p className="mt-2 text-myblack text-1xl font-normal transition hover:text-mywhite">
          {children}
        </p>
      </div>
    </>
  );
}
