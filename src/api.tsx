// src/api.ts
export async function getAIResponse(prompt: string): Promise<any> {
  const res = await fetch(
    `http://localhost:8000/travel/generate?prompt=${encodeURIComponent(prompt)}`
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
