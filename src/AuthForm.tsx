import { useState } from "react";
import type { FormEvent } from "react";
import TextField from "./input_field";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const backendUrl = "http://localhost:8000";

  // Name validation
  const validateName = (name: string): string => {
    if (name.trim().length < 4 || name.trim().length > 20)
      return "Name must be 4-20 characters";
    return "";
  };

  // Password validation
  const validatePassword = (pwd: string): string => {
    if (pwd.length < 6 || pwd.length > 20)
      return "Password must be 6-20 characters";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(pwd))
      return "Password must contain at least one number";
    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isLogin) {
      const nameError = validateName(name);
      const pwdError = validatePassword(password);

      if (nameError || pwdError) {
        setErrorMsg(nameError);
        setPasswordError(pwdError);
        return;
      }
    }

    try {
      if (isLogin) {
        // Login
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch(`${backendUrl}/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });

        const data: { access_token?: string; detail?: string } = await res.json();

        if (res.ok && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          navigate("/prompt");
        } else {
          setErrorMsg(data.detail || "Login failed");
        }
      } else {
        // Signup
        const res = await fetch(`${backendUrl}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email_id: email,
            password,
          }),
        });

        const data: { access_token?: string; detail?: string } = await res.json();

        if (res.ok && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          navigate("/prompt");
        } else {
          setErrorMsg(data.detail || "Signup failed");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-fit mt-4">
      <div className="w-full max-w-md rounded-xl border border-gray-300 shadow-lg p-8 bg-transparent">
        <h2 className="text-2xl font-bold mb-6 text-center font-nunito">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <TextField
              label="Name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          <div className="flex justify-center">
            <Button color="black" variant="filled">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </div>
        </form>

        <p className="text-center mt-4 text-gray-600 font-nunito">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
