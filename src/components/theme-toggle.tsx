import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-full border border-myred
        bg-mywhite dark:bg-myblack
        text-myblack dark:text-mywhite
        hover:scale-110 transition-transform duration-300
        flex items-center justify-center
      "
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
