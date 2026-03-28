import { GoogleGenAI } from "@google/genai";

async function test() {
  console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find a hospital in San Francisco.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    console.log("SUCCESS!", response.text?.substring(0, 50));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
