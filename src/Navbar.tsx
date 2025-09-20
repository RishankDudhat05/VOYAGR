import Button from "./Button";
import { Home, Binoculars, Users, Info } from "lucide-react";

const buttonStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

// Props for the Navbar component
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
        // Navbar container with styling
        className="
          fixed top-2 right-2 w-fit z-50
          flex flex-row justify-start gap-2
          p-0 min-w-2
          bg-white bg-opacity-80
          border border-white rounded-full border-opacity-60
          shadow-md
        "
        style={{ boxSizing: "border-box" }}
      >
        {/* Home */}
        <Button color="black" variant="wout_border" onClick={onHomeClick}>
          <span className="relative min-w-[90px] h-8 flex items-center justify-center group">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              Home
            </span>
            <Home className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>

        {/* Features */}
        <Button color="black" variant="wout_border" onClick={onFeaturesClick}>
          <span className="relative min-w-[110px] h-8 flex items-center justify-center group">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              Features
            </span>
            <Binoculars className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>

        {/* Join */}
        <Button color="black" variant="wout_border" onClick={onJoinClick}>
          <span className="relative min-w-[80px] h-8 flex items-center justify-center group">
            <span className="absolute transition-opacity duration-200 group-hover:opacity-0">
              Join
            </span>
            <Users className="absolute w-7 h-7 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125" />
          </span>
        </Button>

        {/* About Us */}
        <Button color="black" variant="wout_border" onClick={onAboutClick}>
          <span className="relative min-w-[120px] h-8 flex items-center justify-center group">
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
