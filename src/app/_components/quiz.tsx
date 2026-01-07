// 📁 FILE: app/_components/quiz.tsx
// Quiz хийх компонент

"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizProps {
  quizData: {
    quizId: string;
    questions: Question[];
  };
  title: string;
  onBack: () => void;
}

export default function Quiz({ quizData, title, onBack }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizData.questions;

  const handleAnswer = (option: string) => {
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Оноо тооцоолох
      let finalScore = 0;
      questions.forEach((q, index) => {
        if (q.answer === newAnswers[index]) finalScore++;
      });

      setScore(finalScore);
      setIsFinished(true);

      // localStorage-д үр дүн хадгалах
      try {
        const attempts = JSON.parse(
          localStorage.getItem("quiz_attempts") || "[]"
        );
        attempts.push({
          quizId: quizData.quizId,
          title,
          score: finalScore,
          total: questions.length,
          date: Date.now(),
        });
        localStorage.setItem("quiz_attempts", JSON.stringify(attempts));
      } catch (error) {
        console.error("Үр дүн хадгалах алдаа:", error);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsFinished(false);
    setScore(0);
  };

  // Үр дүнгийн хэсэг
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 ">
              <Sparkles />
              <p className="flex items-center justify-start text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px]">
                Quiz completed
              </p>
            </div>
            <p className="text-center text-[#71717A] font-medium text-base leading-6">
              Let’s see what you did
            </p>
          </div>
        </div>

        {/* Оноо */}
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
          <p className="text-[#18181B] text-start text-2xl font-semibold leading-8">
            Your score: {score}/ {questions.length}
          </p>

          {/* Дэлгэрэнгүй тойм */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {questions.map((q, index) => {
                const isCorrect = q.answer === selectedAnswers[index];
                return (
                  <div key={index} className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {isCorrect ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={3}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#737373] text-xs font-medium leading-4">
                          {index + 1}. {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="ml-9 space-y-1.5 text-start">
                      <p
                        className={`text-sm ${
                          isCorrect ? "text-green-700" : "text-[#171717]"
                        }`}
                      >
                        <span className="text-[#171717] text-xs font-medium leading-4">
                          Your answer:
                        </span>
                        {selectedAnswers[index]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 bg-green-50/50 py-1 px-3 rounded-lg inline-block">
                          <span className="font-medium">Correct:</span>{" "}
                          {q.answer}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleRestart}
              className="py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Restart quiz
            </button>
            <button
              onClick={onBack}
              className="py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Save and leave
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz явагдаж байгаа хэсэг
  const q = questions[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 ">
            <Sparkles />
            <p className="flex items-center justify-start text-black font-inter text-[24px] font-semibold leading-8 tracking-[-0.6px]">
              Quick test
            </p>
          </div>
          <p className="text-center text-[#71717A] font-medium text-base leading-6">
            Take a quick test about your knowledge from your content{" "}
          </p>
        </div>

        <button
          onClick={onBack}
          className="flex h-10 px-4 py-2 justify-center items-center gap-2 text-zinc-600 hover:text-black transition-colors rounded-md border border-[#E4E4E7] bg-white "
        >
          x
        </button>
      </div>

      {/* Quiz card */}
      <div className=" bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center gap-4 ">
          <h2 className="text-black text-xl font-medium leading-7">
            {q.question}
          </h2>
          <p className="  text-black text-xl font-medium leading-7">
            {currentStep + 1} / {questions.length}
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className="flex  px-4 py-2 justify-center items-center gap-2 self-stretch rounded-md border border-[#E4E4E7] bg-whitetext-[#18181B] text-sm font-medium leading-5 box-border"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
