"use client";

import { SidebarCloseIcon } from "lucide-react";
import { useState } from "react";
import CreateArticle from "./_components/createArticle";
import Summary from "./_components/summary";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [view, setView] = useState<"form" | "summary">("form");

  async function handleGenerate() {
    setLoading(true);

    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();

    setSummary(data.summary);
    setView("summary");
    setLoading(false);
  }

  return (
    <div className="flex">
      <div className="flex h-full w-75 px-4 pt-4 pb-0 flex-col items-start gap-2 border-r border-[#E4E4E7] bg-white text-black">
        <div className="text-[#09090B] font-inter text-[20px] font-semibold leading-7 tracking-[-0.5px] flex justify-between w-full items-center">
          History
          <SidebarCloseIcon className="inline-block ml-2 mb-1" size={16} />
        </div>
        <div>text</div>
      </div>

      <div className="flex w-full h-full p-7 flex-col justify-center items-center gap-5">
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

        {view === "summary" && (
          <Summary
            title={title}
            summary={summary}
            onBack={() => setView("form")}
          />
        )}
      </div>
    </div>
  );
}
