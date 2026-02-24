import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, content, summary, questions } = await req.json();

  if (!title || !content || !summary) {
    return new Response("Title, content and summary are required", {
      status: 400,
    });
  }

  try {
    // Clerk userId-аас DB user олох
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Article + Quiz хамт хадгалах
    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        userId: user.id,
        quizzes: questions?.length
          ? {
              create: questions.map(
                (q: {
                  question: string;
                  options: string[];
                  answer: string;
                }) => ({
                  question: q.question,
                  options: q.options,
                  answer: q.answer,
                  userId: user.id,
                }),
              ),
            }
          : undefined,
      },
      include: {
        quizzes: true,
      },
    });

    return Response.json({ success: true, article });
  } catch (error) {
    console.error("Save and leave алдаа:", error);
    return new Response("Failed to save", { status: 500 });
  }
}
