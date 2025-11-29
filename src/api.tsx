const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
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

  const res = await fetch(`${backendUrl}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}


export async function createManualTrip(data: any, token: string) {
  const res = await fetch(`${backendUrl}/manual/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // must include auth
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to save manual itinerary");
  }

  return res.json();
}

export async function getUserProfile() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${backendUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
}

export async function deleteAccount() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${backendUrl}/auth/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to delete account: ${res.status} ${txt}`);
  }

  localStorage.removeItem("access_token");
  return res.json();
}

export async function submitReview(review: string) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${backendUrl}/auth/submit-review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ review }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to submit review: ${res.status} ${txt}`);
  }

  return res.json();
}

export async function getReviews() {
  const res = await fetch(`${backendUrl}/auth/reviews`);

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return res.json();
}

export async function getLocationRecommendations(
  placeName: string,
  location: string,
  exclude: string[] = [],
  topK: number = 5
) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${backendUrl}/manual/location-recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ place_name: placeName, location: location, exclude: exclude, top_k: topK }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Backend error:", res.status, txt);
    throw new Error(`Failed to fetch location recommendations: ${res.status} ${txt}`);
  }

  return res.json();
}

export async function getRecommendations(
  addedPlaces: string[] = [],
  topK: number = 5,
  exclude: string[] = []
) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${backendUrl}/recommendations/personalized`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ added_places: addedPlaces, top_k: topK, exclude: exclude }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Backend error:", res.status, txt);
    throw new Error(`Failed to fetch recommendations: ${res.status} ${txt}`);
  }

  return res.json();
}
