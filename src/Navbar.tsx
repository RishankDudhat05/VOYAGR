import Button from "./Button";
import { Home, Binoculars, Users, Info } from "lucide-react";
import ThemeToggle from "./components/theme-toggle";

const buttonStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

interface NavbarProps {
  onHomeClick?: () => void;
  onFeaturesClick?: () => void;
  onJoinClick?: () => void;
  onAboutClick?: () => void;
}

export default function Navbar({
  onHomeClick,
  onFeaturesClick,
  onJoinClick,
  onAboutClick,
}: NavbarProps) {
  return (
    <>
      <style>{buttonStyle}</style>

      <div
        className="
          fixed top-2 right-2 z-50
          flex flex-row items-center gap-2
          px-3 py-2
          bg-mywhite/80 dark:bg-myblack/80
          border border-myred/30
          backdrop-blur-md
          rounded-full shadow-md
          transition-colors duration-300
        "
        style={{ boxSizing: "border-box" }}
      >
        {/* Theme Toggle Button */}
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>

        {/* Home */}
        <Button color="myred" variant="wout_border" onClick={onHomeClick}>
          <span className="relative min-w-[90px] h-8 flex items-center justify-center group font-nunito">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              Home
            </span>
            <Home className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>

        {/* Features */}
        <Button color="myred" variant="wout_border" onClick={onFeaturesClick}>
          <span className="relative min-w-[110px] h-8 flex items-center justify-center group font-nunito">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              Features
            </span>
            <Binoculars className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>

        {/* Join */}
        <Button color="myred" variant="wout_border" onClick={onJoinClick}>
          <span className="relative min-w-[80px] h-8 flex items-center justify-center group font-nunito">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              Join
            </span>
            <Users className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>

        {/* About Us */}
        <Button color="myred" variant="wout_border" onClick={onAboutClick}>
          <span className="relative min-w-[120px] h-8 flex items-center justify-center group font-nunito">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              About Us
            </span>
            <Info className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>
      </div>
    </>
  );
}
