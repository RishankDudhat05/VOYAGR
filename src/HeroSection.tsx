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

      {/* Outer wrapper */}
      <div className="relative flex flex-col items-center justify-center m-8 p-8 pt-32 font-nunito pointer-events-none">
        {/* Floating card (with BorderBeam INSIDE) */}
        <div
          className="
            relative                       /* REQUIRED for BorderBeam */
            overflow-hidden                /* REQUIRED */
            pointer-events-auto
            flex flex-col
            max-w-screen-md
            border-2 rounded-3xl border-myred/40
            m-8 pt-2 pb-8 px-32
            justify-center items-center
            font-nunito
            bg-mywhite/70 dark:bg-myblack/70
            backdrop-blur-sm shadow-lg
            transition-all duration-300
          "
          style={{ boxShadow: "0 4px 8px rgba(220,38,38,0.2)" }}
        >
    

          {/* Light and dark logos */}
          <img
            className="m-2 mt-4 max-w-lg max-h-lg select-none block dark:hidden cursor-pointer"
            src="logo.png"
            alt="logo (light)"
            onClick={() => navigate("/prompt")}
          />
          <img
            className="m-2 mt-4 max-w-lg max-h-lg select-none hidden dark:block cursor-pointer"
            src="logo_light.png"
            alt="logo (dark)"
            onClick={() => navigate("/prompt")}
          />

          {/* Typewriter text */}
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

          {/* Signup/Login */}
          <div className="flex flex-row gap-24 p-2 justify-center items-center mt-12">
            <div className="w-64 h-44 bg-mywhite dark:bg-myblack justify-center items-start rounded-lg shadow-md flex flex-col p-4">
              <p className="text-myblack dark:text-mywhite text-center font-bold text-2xl">
                New here?
              </p>
              <p className="text-myblack dark:text-mywhite text-start font-medium text-0.5xl">
                Create an account!
              </p>
              <Button
                color="myred"
                variant="filled_wout_border"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Sign Up
              </Button>
            </div>
            <div className="w-64 h-44 bg-mywhite dark:bg-myblack justify-center items-start rounded-lg shadow-md flex flex-col p-4">
              <p className="text-myblack dark:text-mywhite text-start font-bold text-xl">
                Already having an account?
              </p>
              <p className="text-myblack dark:text-mywhite text-start font-medium text-0.5xl">
                Log in to your account!
              </p>
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
      </div>
    </>
  );
}
