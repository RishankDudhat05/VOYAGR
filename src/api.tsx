
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export async function getAIResponse(prompt: string): Promise<any> {
  const token = localStorage.getItem("access_token"); 
  const res = await fetch(
    `${backendUrl}/travel/generate?prompt=${encodeURIComponent(prompt)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to fetch from backend: ${res.status} ${txt}`);
  }

  const data = await res.json();

  // If backend already returned an object, use it
  if (typeof data === "object" && data !== null) {
    return data;
  }

  // Otherwise data may be a string containing JSON or markdown fenced code block
  let content = typeof data === "string" ? data : JSON.stringify(data);

  // remove code fences and surrounding text
  content = content
    .replace(/^```[\w]*\s*/, "")
    .replace(/```$/, "")
    .trim();

  // attempt to find JSON substring
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    content = content.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    // If parsing fails, return a structured error object
    return {
      type: "error",
      message: "Failed to parse AI response as JSON",
      raw: content,
    };
  }
}

export async function sendOtp(email: string) {
  const res = await fetch(`${backendUrl}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    let msg = "Failed to send OTP";
    try {
      const data = await res.json();
      msg = data.detail || msg;
    } catch {}
    throw new Error(msg);
  }
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch(`${backendUrl}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    let msg = "Invalid or expired OTP";
    try {
      const data = await res.json();
      msg = data.detail || msg;
    } catch {}
    throw new Error(msg);
  }
}


export async function logoutRequest() {
  const token = localStorage.getItem("access_token");

  const res = await fetch("http://localhost:8000/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
