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

      {/* Outer wrapper — transparent, allows hex background to show */}
      <div className="relative flex flex-col items-center justify-center m-8 p-8 pt-32 font-nunito pointer-events-none">
        {/* Floating card — visible and clickable */}
        <div
          className="pointer-events-auto flex flex-col max-w-screen-md border-2 rounded-3xl border-myred/40 m-8 pt-2 pb-8 px-32 justify-center items-center font-nunito bg-mywhite/70 dark:bg-myblack/70 backdrop-blur-sm shadow-lg transition-all duration-300"
          style={{ boxShadow: "0 4px 8px rgba(220,38,38,0.2)" }}
        >
          {/* Light-mode logo shown by default, dark-mode logo shown when .dark is present */}
          <img
            className="m-2 mt-4 max-w-lg max-h-lg select-none block dark:hidden"
            src="logo.png"
            alt="logo (light)"
          />
          <img
            className="m-2 mt-4 max-w-lg max-h-lg select-none hidden dark:block"
            src="logo_light.png"
            alt="logo (dark)"
          />

          <p className="m-2 italic font-semibold text-3xl text-center text-myblack dark:text-mywhite">
            “Discover. Explore. Remember. <br />
            <style>{`
              .typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: .12em solid rgba(0,0,0,0.75);
          animation: typing 3s steps(30,end), blink .75s step-end infinite;
              }
              @keyframes typing { from { width: 0 } to { width: 100% } }
              @keyframes blink { 50% { border-color: transparent } }
            `}</style>
            <span className="typewriter text-4xl font-bold">
              Let <span className="text-myred">VOYAGR</span> guide the way.
            </span>
            ”
          </p>

          <div className="flex flex-row gap-32 mt-24 p-2">
            <Button
              color="myred"
              variant="filled_wout_border"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Sign Up
            </Button>
            <Button
              color="myred"
              variant="wout_border"
              onClick={() => navigate("/auth?mode=login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
