export const HAS_API_KEY = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY || !!process.env.VITE_GEMINI_API_KEY || !!process.env.GEMINI_API_KEY;

export async function askGemini(prompt, { useSearch = false, revalidate = 3600 } = {}) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key config is missing from server env");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    ...(useSearch && { tools: [{ googleSearch: {} }] })
  };

  // Next.js magically caches this fetch globally for 'revalidate' seconds
  // This completely solves the 429 issue because Gemini is only hit once per hour.
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: revalidate }
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) throw new Error("Empty response from AI");
  return rawText;
}
