import { useNavigate } from "react-router-dom";
import Button from "./Button";

const HeroStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
`;

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <style>{HeroStyle}</style>
      //branding and call to action section
      <div className="flex flex-col m-8 p-2 justify-center items-center font-nunito">
        <img
          className="m-2 mt-32 max-w-lg max-h-lg"
          src="logo.png"
          alt="logo image"
        />
        <p className="m-2 italic font-semibold text-3xl text-center">
          “Discover. Explore. Remember. <br />
          <span className="text-4xl font-bold">Let VOYAGR guide the way.</span>”
        </p>
        <div className="flex flex-row gap-32 mt-24 p-2 ">
          {/* buttons to navigate to auth page with different modes */}
          <Button
            color="black"
            variant="solid"
            onClick={() => navigate("/auth?mode=signup")}
          >
            Sign Up
          </Button>
          <Button
            color="black"
            variant="wout_border"
            onClick={() => navigate("/auth?mode=login")}
          >
            Log In
          </Button>
        </div>
      </div>
    </>
  );
}
