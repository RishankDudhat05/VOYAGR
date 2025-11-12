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
      /* light mode heading hover */
      .content-card:hover .content-card-heading {
        background-color: #f7fbfa;
        border-radius: 0.75rem;
        border-color: #f7fbfa;
      }
      /* dark mode heading hover (when using Tailwind's dark class on html/body) */
      .dark .content-card:hover .content-card-heading {
        background-color: #292d32;
        border-radius: 0.75rem;
        border-color: #292d32;
      }
      `}</style>

      {/* Card container with light + dark mode classes and conditional cursor */}
      <div
        onClick={onClick}
        className={`content-card m-2 p-4 bg-mywhite text-myblack dark:bg-[#292d32] dark:text-mywhite font-nunito w-full rounded-lg shadow-none border-2
             transition hover:shadow-sm hover:scale-[1.02] hover:bg-myred hover:text-myred dark:hover:bg-myred dark:hover:text-myred${
               onClick ? " cursor-pointer" : ""
             }`}
      >
        <h2 className="content-card-heading text-2xl font-semibold mb-2 px-2 py-2 transition-colors rounded-md">
          {heading}
        </h2>
        <p className="mt-2 text-myblack dark:text-mywhite text-1xl font-normal transition-colors hover:text-mywhite dark:hover:text-mywhite">
          {children}
        </p>
      </div>
    </>
  );
}
