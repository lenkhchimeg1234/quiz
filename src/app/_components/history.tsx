"use client";
import {
  BookOpenIcon,
  ChevronLeftIcon,
  FileTextIcon,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  content: string;
  summary: string;
  onBack: () => void;
  onTakeQuiz: () => void;
};

export default function History({
  title,
  content,
  summary,
  onBack,
  onTakeQuiz,
}: Props) {
  return (
    <div className="w-full max-w-2xl h-fit box-border rounded-lg border bg-white shadow-md p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-zinc-600 hover:text-zinc-900"
      >
        <ChevronLeftIcon size={20} />
      </button>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px]">
            <Sparkles size={24} />
            Article Quiz Generator
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-zinc-500">
            <BookOpenIcon size={16} />
            Summarized content
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
            <div className="h-[80px] overflow-y-auto rounded-md border border-zinc-200 p-3 text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </div>

          <div className="grid gap-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <FileTextIcon size={16} />
              Article Content
            </div>
            <div className="max-h-[80px] overflow-y-auto rounded-md border border-zinc-200 p-3 text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2">
          <Button
            onClick={onTakeQuiz}
            className="bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            Take a quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
