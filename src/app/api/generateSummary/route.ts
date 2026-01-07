// 📁 FILE: app/api/generateSummary/route.ts
// Summary үүсгэх API

import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY!,
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return new Response("Title and content are required", { status: 400 });
  }

  try {
    const prompt = `
Summarize the following article in a clear and concise way. 
Keep it around 3-5 sentences.

Title: ${title}

Article:
${content}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summary = response.text;

    return Response.json({ summary });
  } catch (error) {
    console.error("Summary үүсгэх алдаа:", error);
    return new Response("Failed to generate summary", { status: 500 });
  }
}
