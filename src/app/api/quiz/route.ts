// 📁 FILE: app/api/quizzes/route.ts
// Quiz үүсгэх API

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
Create a quiz based on the article below.

Rules:
- Exactly 5 questions
- Each question has 4 answer options
- Only one correct answer per question
- Return ONLY valid JSON, no explanations
- The "answer" field must contain the EXACT text of the correct option

JSON format:
{
  "questions": [
    {
      "question": "What is the main topic?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    }
  ]
}

Title: ${title}

Article:
${content}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const quizText = response.text;

    if (!quizText) {
      throw new Error("Empty response from AI");
    }

    const jsonMatch = quizText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to parse quiz JSON");
    }

    const quiz = JSON.parse(jsonMatch[0]);

    if (quiz.questions) {
      quiz.questions = quiz.questions.map((q: { question: string; options: string[]; answer?: string; correctAnswerIndex?: number }) => {
        if (typeof q.correctAnswerIndex === "number" && !q.answer) {
          return {
            question: q.question,
            options: q.options,
            answer: q.options[q.correctAnswerIndex],
          };
        }
        return q;
      });
    }

    const quizId = crypto.randomUUID();

    return Response.json({
      id: quizId,
      title,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("Quiz үүсгэх алдаа:", error);
    return new Response("Failed to create quiz", { status: 500 });
  }
}