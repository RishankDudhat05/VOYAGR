import { useState } from "react";
import type { ChangeEvent } from "react";

import Button from "./Button";

interface TextFieldProps {
  label: string;
  type?: "text" | "email" | "number" | "password";
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function TextField({
  label,
  type = "text",
  placeholder = "Enter the specified detail",
  value,
  onChange,
  className = "",
}: TextFieldProps) {
  // state to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1 m-2 p-2 w-full ${className}`}>
      <label className="font-nunito text-lg text-gray-700 transition-all">
        {label}
      </label>
      <div className="flex flex-row gap-2 items-center w-full">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 px-4 py-2 rounded-full font-nunito text-base
             border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-800
             hover:border-gray-500 transition w-full"
        />

        {/* Clear Button */}
        <Button
          {...({ type: "button" } as any)} // prevent accidental submit
          color="gray"
          variant="wout_border"
          onClick={() =>
            onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)
          }
        >
          {"\u2715"}
        </Button>

        {/* Show/Hide Password Button */}
        {type === "password" && (
          <Button
            {...({ type: "button" } as any)} // prevent accidental submit
            color="gray"
            variant="wout_border"
            onMouseDown={(e) => {
              e.preventDefault(); // stop focus/submit
              setShowPassword(true);
            }}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            onTouchStart={(e: React.TouchEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setShowPassword(true);
            }}
            onTouchEnd={() => setShowPassword(false)}
            onTouchCancel={() => setShowPassword(false)}
            tabIndex={-1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 
                   8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 
                   7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
