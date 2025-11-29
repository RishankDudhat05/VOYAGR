// src/components/ui/aurora-background.tsx

import React from "react";

interface AuroraProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuroraBackground({ className = "", ...props }: AuroraProps) {
  return (
    <div
      {...props}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Base background (light/dark) */}
      <div className="absolute inset-0 bg-[#f7fbfa] dark:bg-[#282d33]" />

      {/* Aurora Layer 1 — main accent using 10 (#ed4343) */}
      <div
        className="
          absolute -top-1/3 -left-1/4 w-[120%] h-[120%]
          bg-[radial-gradient(circle_at_30%_30%,rgba(237,67,67,0.35),transparent_60%)]
          dark:bg-[radial-gradient(circle_at_30%_30%,rgba(237,67,67,0.25),transparent_65%)]
          blur-3xl animate-[auroraFloat_18s_ease-in-out_infinite]
        "
      />

      {/* Aurora Layer 2 — soft white wash in light, soft gray in dark */}
      <div
        className="
          absolute -bottom-1/3 -right-1/4 w-[120%] h-[120%]
          bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.35),transparent_60%)]
          dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_60%)]
          blur-3xl animate-[auroraShift_22s_ease-in-out_infinite]
        "
      />

      {/* Aurora Layer 3 — subtle neutral tone */}
      <div
        className="
          absolute top-1/4 left-1/3 w-[100%] h-[100%]
          bg-[radial-gradient(circle_at_50%_50%,rgba(40,45,51,0.15),transparent_60%)]
          dark:bg-[radial-gradient(circle_at_50%_50%,rgba(247,251,250,0.06),transparent_60%)]
          blur-[100px] animate-[auroraFloat_28s_ease-in-out_infinite]
        "
      />

      {/* Keyframes (inlined using arbitrary plugin) */}
      <style>
        {`
          @keyframes auroraFloat {
            0% { transform: translate3d(-10%, 0, 0) scale(1); }
            50% { transform: translate3d(10%, -6%, 0) scale(1.05); }
            100% { transform: translate3d(-10%, 0, 0) scale(1); }
          }
          @keyframes auroraShift {
            0% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(0,-4%,0) scale(1.08); }
            100% { transform: translate3d(0,0,0) scale(1); }
          }
        `}
      </style>
    </div>
  );
}
