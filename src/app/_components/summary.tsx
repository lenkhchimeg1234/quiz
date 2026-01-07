"use client";
import { BookOpenIcon, ChevronLeftIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

type Props = {
  title: string;
  summary: string;
  onBack(): void;
  onTakeQuiz(): void;
};

export default function Summary({ title, summary, onBack, onTakeQuiz }: Props) {
  return (
    <div>
      <ChevronLeftIcon onClick={onBack} className="ml-4 mt-4 cursor-pointer" />

      <div className="flex w-full h-full p-7 flex-col justify-center items-center gap-5  ">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-start text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px]">
              <Sparkles />
              Article Quiz Generator
            </CardTitle>
            <CardDescription className="flex items-center">
              <BookOpenIcon />
              Summarized content
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-name">{title}</Label>
              <div>{summary}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={onTakeQuiz}
              className="bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              Take a quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
