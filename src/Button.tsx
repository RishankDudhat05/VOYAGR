const buttonStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

//variants
const colorClasses: Record<
  string,
  {
    solid: string;
    filled: string;
    wout_border: string;
    filled_wout_border: string;
  }
> = {
  gray: {
    solid:
      "bg-gray-800 text-white border border-gray-800 hover:bg-gray-700 hover:text-white",
    filled:
      "bg-white text-gray-800 border-2 border-gray-800 hover:bg-gray-800 hover:text-white",
    wout_border: "bg-white text-gray-800 hover:bg-gray-700 hover:text-white",
    filled_wout_border:
      "bg-gray-800 text-white font-bold hover:bg-white hover:text-gray-800",
  },
  black: {
    solid:
      "bg-black text-white border border-black hover:bg-gray-700 hover:border-gray-800 hover:text-white",
    filled:
      "bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-2 hover:border-black",
    wout_border: "bg-white text-black hover:bg-gray-900 hover:text-white",
    filled_wout_border:
      "bg-black text-white font-bold hover:bg-white hover:text-black",
  },
};

interface ButtonProps {
  children: React.ReactNode;
  color?: keyof typeof colorClasses;
  variant?: "solid" | "filled" | "wout_border" | "filled_wout_border";
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  color = "gray",
  variant = "solid",
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
}: ButtonProps) {
  return (
    <>
      <style>{buttonStyle}</style>
      <button
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className={`
          inline-flex items-center justify-center m-2
          text-base font-medium rounded-full
          shadow-sm font-nunito
          transition-colors duration-200
          px-4 py-2
          ${colorClasses[color][variant]}
        `}
      >
        {children}
      </button>
    </>
  );
}
