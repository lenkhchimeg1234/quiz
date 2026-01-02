import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY!,
});

export async function POST(req: Request) {
  // 1️⃣ Auth check
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2️⃣ Parse request
  const { title, content } = await req.json();

  if (!content) {
    return new Response("Content is required", { status: 400 });
  }

  // 3️⃣ Build prompt
  const prompt = `
Summarize the following article clearly and concisely.
 
Title: ${title || "Untitled"}
 
Article:
${content}
 
Summary:
`;

  try {
    // 4️⃣ Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // 5️⃣ Extract text
    const summary = response.text;

    return Response.json({ summary });
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response("Failed to generate summary", { status: 500 });
  }
}
