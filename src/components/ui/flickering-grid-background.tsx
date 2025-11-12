"use client";

import * as React from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface FlickeringGridBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  flickerChance?: number;
  flickerSpeed?: number;
}

export function FlickeringGridBackground({
  gridSize = 20, // ⬅️ smaller grid (was 50) → closer cubes
  flickerChance = 0.8, // ⬅️ higher flicker probability (was 0.015)
  flickerSpeed = 0.8, // ⬅️ faster update interval (was 0.6)
  className,
  ...props
}: FlickeringGridBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    const grid: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random())
    );

    let lastTime = 0;
    const draw = (time: number) => {
      if (time - lastTime < flickerSpeed * 1000) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const darkMode = document.documentElement.classList.contains("dark");
      const baseColor = darkMode ? "247,251,250" : "40,45,51";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const val = grid[y][x];
          if (Math.random() < flickerChance) grid[y][x] = Math.random();
          const brightness = val * 0.7 + 0.3;
          ctx.fillStyle = `rgba(${baseColor}, ${brightness * 0.45})`;
          ctx.fillRect(x * gridSize, y * gridSize, 8, 8); // ⬅️ slightly larger to reduce spacing
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", resize);
    };
  }, [gridSize, flickerChance, flickerSpeed]);

  return (
    <div
      {...props}
      className={cn("absolute inset-0 pointer-events-none", className)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
