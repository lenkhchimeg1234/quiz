"use client";
import { SidebarCloseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreateArticle from "./_components/createArticle";
import Summary from "./_components/summary";
import History from "./_components/history";
import Quiz from "./_components/quiz";

type Question = {
  question: string;
  options: string[];
  answer: string;
};
type ArticleItem = {
  id: string;
  title: string;
  content: string;
  summary: string;
  createdAt: number;
  quizData?: {
    quizId: string;
    questions: Question[];
  };
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [currentQuizData, setCurrentQuizData] = useState<{
    quizId: string;
    questions: Question[];
  } | null>(null);
  const [view, setView] = useState<"form" | "summary" | "quiz" | "history">(
    "form",
  );
  const [history, setHistory] = useState<ArticleItem[]>([]);

  // 1️⃣ Summary үүсгэх
  async function handleGenerate() {
    if (!title.trim() || !content.trim()) {
      alert("Гарчиг болон агуулга оруулна уу");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generateSummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Summary үүсгэж чадсангүй");

      const data = await res.json();

      const newItem: ArticleItem = {
        id: crypto.randomUUID(),
        title,
        content,
        summary: data.summary,
        createdAt: Date.now(),
      };

      setSummary(data.summary);
      setView("summary");

      // History-д хадгалах
      setHistory((prev) => {
        const updated = [newItem, ...prev];
        localStorage.setItem("articles", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Summary үүсгэх алдаа:", error);
      alert("Та эхлээд нэвтрэх шаардлагатай байна.");
    } finally {
      setLoading(false);
    }
  }

  // 2️⃣ Quiz үүсгэх
  async function handleCreateQuiz() {
    if (!title || !content) {
      alert("Гарчиг болон агуулга хоосон байна");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Quiz үүсгэж чадсангүй");

      const quizData = await res.json();

      // Quiz өгөгдөл хадгалах
      setCurrentQuizData({
        quizId: quizData.id,
        questions: quizData.questions,
      });

      // History-д quiz нэмэх
      setHistory((prev) => {
        const updated = prev.map((item) => {
          if (item.title === title && item.content === content) {
            return {
              ...item,
              quizData: {
                quizId: quizData.id,
                questions: quizData.questions,
              },
            };
          }
          return item;
        });
        localStorage.setItem("articles", JSON.stringify(updated));
        return updated;
      });

      // Quiz хуудас руу шилжих
      setView("quiz");
    } catch (error) {
      console.error("Quiz үүсгэх алдаа:", error);
      alert("Quiz үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  // 3️⃣ localStorage-с history ачаалах
  useEffect(() => {
    const saved = localStorage.getItem("articles");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error("History ачаалах алдаа:", error);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR - History */}
      <div className="flex h-screen w-64 px-4 pt-4 pb-0 flex-col items-start gap-2 border-r border-[#E4E4E7] bg-white text-black overflow-y-auto">
        <div className="text-[#09090B] font-inter text-[20px] font-semibold leading-7 tracking-[-0.5px] flex justify-between w-full items-center">
          History
          <SidebarCloseIcon
            className="inline-block ml-2 mb-1 cursor-pointer"
            size={16}
          />
        </div>

        <div className="flex flex-col w-full gap-2 mt-2">
          {history.length === 0 && (
            <p className="text-sm text-zinc-500">No saved articles yet</p>
          )}

          {history.map((item) => (
            <button
              key={item.id}
              className="text-left p-2 rounded hover:bg-zinc-100 transition-colors"
              onClick={() => {
                setTitle(item.title);
                setContent(item.content);
                setSummary(item.summary);
                setCurrentQuizData(item.quizData || null);
                setView("history");
              }}
            >
              <p className="font-medium truncate text-sm">{item.title}</p>
              <p className="text-xs text-zinc-500 truncate">
                {new Date(item.createdAt).toLocaleString()}
              </p>
              {item.quizData && (
                <span className="text-xs text-blue-600 block mt-1">
                  📝 Quiz бүхий
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className="flex w-full h-screen p-7 flex-col justify-center items-center gap-5 overflow-y-auto">
        {/* Form View - Article бичих */}
        {view === "form" && (
          <CreateArticle
            title={title}
            content={content}
            setTitle={setTitle}
            setContent={setContent}
            loading={loading}
            onGenerate={handleGenerate}
          />
        )}

        {/* Summary View - Хураангуй харах */}
        {view === "summary" && (
          <Summary
            title={title}
            summary={summary}
            onBack={() => setView("form")}
            onTakeQuiz={handleCreateQuiz}
          />
        )}

        {/* History View - Түүхээс сонгосон */}
        {view === "history" && (
          <History
            title={title}
            content={content}
            summary={summary}
            onBack={() => setView("form")}
            onTakeQuiz={() => {
              if (currentQuizData) {
                setView("quiz");
              } else {
                handleCreateQuiz();
              }
            }}
          />
        )}

        {/* Quiz View - Quiz хийх */}
        {view === "quiz" && currentQuizData && (
          <Quiz
            quizData={currentQuizData}
            title={title}
            onBack={() => setView("history")}
            onSaveAndLeave={async () => {
              // DB-д хадгалах
              await fetch("/api/save-and-leave", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  title,
                  content,
                  summary,
                  questions: currentQuizData.questions,
                }),
              });
              // Эхний хэсэг рүү буцах + state цэвэрлэх
              setView("form");
              setTitle("");
              setContent("");
              setSummary("");
              setCurrentQuizData(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
