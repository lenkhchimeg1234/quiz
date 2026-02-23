"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon, Sparkles } from "lucide-react";
import { useState } from "react";

const CONTENT_LIMIT = 300;

type Props = {
  title: string;
  content: string;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  loading: boolean;
  onGenerate: () => void;
};

export default function CreateArticle({
  title,
  content,
  setTitle,
  setContent,
  loading,
  onGenerate,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const isLong = content.length > CONTENT_LIMIT;
  const displayedContent =
    isLong && !expanded ? content.slice(0, CONTENT_LIMIT) + "..." : content;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black font-inter text-[24px] font-semibold">
          <Sparkles />
          Article Quiz Generator
        </CardTitle>

        <CardDescription>
          Paste your article below to generate a summarize and quiz question.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label>
            <FileIcon /> Article Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your article..."
          />
        </div>

        <div className="grid gap-3">
          <Label>
            <FileIcon /> Article Content
          </Label>

          {/* Editing mode: always show full textarea */}
          {expanded || !isLong ? (
            <Textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              placeholder="Paste your article content here..."
              className="min-h-[120px]"
            />
          ) : (
            /* Collapsed preview */
            <div className="rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap break-words">
              {displayedContent}
            </div>
          )}

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}