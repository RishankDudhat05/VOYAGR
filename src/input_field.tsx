// input_field.tsx
import { useState, useRef } from "react";
import type { ChangeEvent } from "react";

import Button from "./Button";

interface TextFieldProps {
  label?: React.ReactNode;
  type?: "text" | "email" | "number" | "password" | "date";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  /** render a multiline textarea that auto-resizes within its parent */
  multiline?: boolean;
  className?: string; // wrapper class
  inputClassName?: string; // class applied to the real input/textarea
}

export default function TextField({
  label = "",
  type = "text",
  placeholder = "Enter the specified detail",
  value,
  defaultValue,
  onChange = (() => {}) as (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void,
  multiline = false,
  className = "",
  inputClassName = "",
}: TextFieldProps) {
  // state to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  // ref to the underlying input/textarea so we can clear uncontrolled fields
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const inputType = type === "password" && showPassword ? "text" : type;

  // base classes for input/textarea — we keep these but allow overrides via inputClassName
  const baseInputClasses =
    "flex-1 px-4 py-2 rounded-full font-nunito text-base bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-800 dark:focus:ring-gray-300 hover:border-gray-500 dark:hover:border-gray-500 transition w-full";

  const baseTextareaClasses =
    "flex-1 px-4 py-2 rounded-lg font-nunito text-base bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-800 dark:focus:ring-gray-300 hover:border-gray-500 dark:hover:border-gray-500 transition w-full max-h-full overflow-auto";

  return (
    <div className={`flex flex-col gap-1 m-2 p-2 w-full ${className}`}>
      {label && (
        <label className="font-nunito text-lg text-gray-700 dark:text-gray-300 transition-all">
          {label}
        </label>
      )}

      <div className="flex flex-row gap-2 items-center w-full">
        {multiline ? (
          <textarea
            placeholder={placeholder}
            ref={inputRef as any}
            onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
            {...(value !== undefined ? { value } : {})}
            {...(value === undefined && defaultValue !== undefined
              ? { defaultValue }
              : {})}
            rows={1}
            onInput={(e) => {
              const el = e.currentTarget as HTMLTextAreaElement;
              el.style.height = "auto";
              // expand to scrollHeight but don't exceed parent's height
              const parent = el.parentElement
                ?.parentElement as HTMLElement | null;
              const maxH = parent ? parent.clientHeight : undefined;
              const newH = el.scrollHeight;
              if (maxH) el.style.height = Math.min(newH, maxH) + "px";
              else el.style.height = newH + "px";
            }}
            className={`${baseTextareaClasses} ${inputClassName}`}
          />
        ) : (
          <input
            type={inputType}
            placeholder={placeholder}
            ref={inputRef as any}
            {...(value !== undefined ? { value } : {})}
            {...(value === undefined && defaultValue !== undefined
              ? { defaultValue }
              : {})}
            onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            className={`${baseInputClasses} ${inputClassName}`}
          />
        )}

        {/* Clear Button */}
        <Button
          {...({ type: "button" } as any)} // prevent accidental submit
          color="myred"
          variant="wout_border"
          onClick={() => {
            // If it's an uncontrolled input (defaultValue used), clear the DOM value.
            if (inputRef.current) {
              try {
                (
                  inputRef.current as HTMLInputElement | HTMLTextAreaElement
                ).value = "";
              } catch (e) {
                /* ignore */
              }
            }

            // Also call parent's onChange so controlled inputs receive the update.
            try {
              onChange({
                target: { value: "" },
              } as ChangeEvent<HTMLInputElement>);
            } catch (e) {
              // swallow — onChange might be absent or not expect our synthetic event
            }
          }}
        >
          {"\u2715"}
        </Button>

        {/* Show/Hide Password Button */}
        {type === "password" && (
          <Button
            {...({ type: "button" } as any)} // prevent accidental submit
            color="myred"
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
