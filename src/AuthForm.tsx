import { useState } from "react";
import type { FormEvent } from "react";
import TextField from "./input_field";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "./api";

export default function AuthForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");

  const [isLogin, setIsLogin] = useState(mode !== "signup");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation errors
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // -------------------------
  // Validators
  // -------------------------

  const validatePassword = (pwd: string): string => {
    // must start with alphabet
    if (!/^[A-Za-z]/.test(pwd)) {
      return "Password must start with an alphabet";
    }

    if (pwd.length < 6 || pwd.length > 20)
      return "Password must be 6–20 characters";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(pwd))
      return "Password must contain at least one number";
    return "";
  };

  const validateEmail = (mail: string): string => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(mail)) return "Invalid e-mail format";
    return "";
  };

  // -------------------------
  // OTP
  // -------------------------
  const handleSendOtp = async () => {
    // Username validation only in signup
    if (!isLogin) {
      const trimmed = name.trim();

      if (trimmed.length < 2 || trimmed.length > 8) {
        setOtpError("Username must be 2–8 characters.");
        setOtpSent(false);
        return;
      }

      if (!/^[A-Za-z]/.test(trimmed)) {
        setOtpError("Username must start with an alphabet.");
        setOtpSent(false);
        return;
      }
    }

    // Email validation
    const emailCheck = validateEmail(email);
    if (emailCheck) {
      setOtpError(emailCheck);
      setOtpSent(false);
      return;
    }

    setOtpError("");
    setSendingOtp(true);

    try {
      await sendOtp(email);
      setOtpSent(true);
      setOtpVerified(false);
    } catch (err: any) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpError(err.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Enter the OTP.");
      return;
    }

    setOtpError("");
    setVerifyingOtp(true);

    try {
      await verifyOtp(email, otp);
      setOtpVerified(true);
      setOtpError("");
    } catch (err: any) {
      setOtpVerified(false);
      setOtpError(err.message || "Invalid or expired OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    // LOGIN only checks required fields
    if (isLogin) {
      try {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch(`${backendUrl}/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("access_token", data.access_token);
          navigate("/prompt");
        } else {
          setSubmitError(data.detail || "Login failed");
        }
      } catch {
        setSubmitError("Unexpected error while logging in");
      }
      return;
    }

    // SIGNUP — VALIDATION
    const pwdError = validatePassword(password);
    setPasswordError(pwdError);

    if (pwdError) return;

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    if (!otpVerified) {
      setSubmitError("Please verify OTP first.");
      return;
    }

    // SIGNUP API
    try {
      const res = await fetch(`${backendUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email_id: email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/prompt");
      } else {
        setSubmitError(data.detail || "Signup failed");
      }
    } catch {
      setSubmitError("Unexpected error during signup.");
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 font-nunito">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl h-full items-stretch">
        {/* LEFT PANEL */}
        <div className="relative h-full">
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div
              className="w-[85%] h-[90%] rounded-[40%] bg-gradient-to-r from-myred/80 via-myred/40 to-transparent filter blur-2xl opacity-90 transform rotate-12 scale-105 drop-shadow-2xl"
              style={{ mixBlendMode: "screen" }}
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden h-full shadow-myred/30 shadow-lg z-10">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="bg_video.mp4"
              autoPlay
              muted
              loop
            />
            <div className="absolute inset-0 bg-myblack/50" />

            <div className="relative z-10 p-10 flex flex-col justify-center text-myred-100 h-full">
              <h1 className="text-[5rem] text-mywhite leading-tight font-bold tracking-widest">
                {isLogin ? (
                  <>
                    L O G
                    <br />
                    <span className="font-thin">I N</span>
                  </>
                ) : (
                  <>
                    S I G N
                    <br />
                    <span className="font-thin">U P</span>
                  </>
                )}
              </h1>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-mywhite dark:bg-myblack backdrop-blur-xl border-2 border-myblack/40 shadow-md rounded-3xl p-10 h-full flex items-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* Username (signup only) */}
            {!isLogin && (
              <TextField
                label="Username"
                type="text"
                placeholder="e.g. johndoe123"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            {/* Email + OTP */}
            <div>
              <TextField
                label="E-mail"
                type="email"
                placeholder="e.g. user@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Show email-related / send-OTP errors even when OTP is not sent */}
              {!isLogin && !otpSent && otpError && (
                <p className="text-xs text-red-600 mt-1">{otpError}</p>
              )}

              {!isLogin && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="px-3 py-1 rounded bg-myblack text-white text-sm disabled:opacity-70"
                  >
                    {sendingOtp
                      ? "Sending..."
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </button>

                  {otpSent && (
                    <p className="text-xs text-green-600 mt-1">
                      OTP sent to your email.
                    </p>
                  )}

                  {otpSent && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full border px-3 py-2 rounded text-black placeholder:text-black"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyingOtp}
                        className="mt-2 px-3 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-70"
                      >
                        {verifyingOtp ? "Verifying..." : "Verify OTP"}
                      </button>

                      {otpVerified && (
                        <p className="text-xs text-green-600 mt-1">
                          OTP verified!
                        </p>
                      )}

                      {/* OTP verify errors (invalid/expired etc.) */}
                      {otpError && (
                        <p className="text-xs text-red-600 mt-1">
                          {otpError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Password */}
            <TextField
              label={isLogin ? "Password" : "New Password"}
              type="password"
              placeholder={
                isLogin ? "Enter your password" : "Enter your new password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-[-14px]">
                {passwordError}
              </p>
            )}

            {/* Confirm Password */}
            {!isLogin && (
              <>
                <TextField
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value !== password)
                      setConfirmPasswordError("Passwords do not match");
                    else setConfirmPasswordError("");
                  }}
                />

                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-[-14px]">
                    {confirmPasswordError}
                  </p>
                )}
              </>
            )}

            {submitError && (
              <p className="text-red-500 text-sm text-center">{submitError}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-myred">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    // reset OTP-related state when switching mode
                    setOtp("");
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtpError("");
                    setSubmitError("");
                  }}
                  className="font-semibold underline hover:text-blue-600"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setOtp("");
                    setOtpError("");
                    setOtpSent(false);
                    setOtpVerified(false);
                    setPasswordError("");
                    setConfirmPasswordError("");
                    setSubmitError("");
                  }}
                  className="px-6 py-2 rounded-full border border-myblack bg-mywhite dark:bg-myblack hover:text-mywhite text-black hover:bg-myred/100"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="px-8 py-2 rounded-full bg-myblack dark:bg-mywhite text-mywhite dark:text-myblack hover:bg-myblack/80"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
