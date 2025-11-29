import React from "react";

const buttonStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

const colorClasses: Record<
  string,
  {
    solid: string;
    filled: string;
    wout_border: string;
    filled_wout_border: string;
  }
> = {
  myred: {
    solid:
      "bg-myred text-mywhite border border-myred hover:bg-gray-700 hover:border-gray-800 hover:text-mywhite",
    filled:
      "bg-myred text-mywhite border-2 border-mywhite hover:bg-mywhite hover:text-myred hover:border-2 hover:border-myred",
    wout_border: "bg-mywhite text-myblack hover:bg-myred hover:text-mywhite",
    filled_wout_border:
      "bg-myred text-mywhite font-bold hover:bg-mywhite hover:text-myred",
  },
  myblack: {
    solid:
      "bg-myblack text-mywhite border border-myblack hover:bg-gray-700 hover:border-gray-800 hover:text-mywhite",
    filled:
      "bg-myblack text-mywhite border-2 border-mywhite hover:bg-mywhite hover:text-myblack hover:border-2 hover:border-myblack",
    wout_border: "bg-mywhite text-myblack hover:bg-gray-900 hover:text-mywhite",
    filled_wout_border:
      "bg-myblack text-mywhite font-bold hover:bg-mywhite hover:text-myblack",
  },
};

// Add color aliases
colorClasses.red = colorClasses.myred;
colorClasses.black = colorClasses.myblack;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: keyof typeof colorClasses;
  variant?: "solid" | "filled" | "wout_border" | "filled_wout_border";
}

export default function Button({
  children,
  color = "myred",
  variant = "solid",
  className = "",
  ...props
}: ButtonProps) {
  const selectedColor = colorClasses[color] || colorClasses.myred;
  const selectedVariant = selectedColor[variant] || selectedColor.solid;

  return (
    <>
      <style>{buttonStyle}</style>
      <button
        {...props}
        className={`inline-flex items-center justify-center m-2
          text-base font-medium rounded-full
          shadow-sm font-nunito
          transition-colors duration-200
          px-4 py-2
          ${selectedVariant} ${className} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {children}
      </button>
    </>
  );
}
