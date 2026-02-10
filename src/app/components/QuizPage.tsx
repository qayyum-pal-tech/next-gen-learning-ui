"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import QuizQuestion from "@/app/components/QuizQuestion";
import { useQuiz } from "@/context/QuizContext";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "=http://localhost:8000";

// Simple, premium CSS-only loader
const SimpleLoader = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500/10 rounded-full animate-spin border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
      <div className="absolute inset-0 bg-blue-500/5 blur-2xl animate-pulse rounded-full" />
    </div>
    <div className="flex flex-col items-center gap-2">
      <p className="text-blue-400 font-bold tracking-[0.2em] animate-pulse uppercase text-xs">{text}</p>
      <div className="flex gap-1.5 mt-1">
        <div className="w-1 h-1 bg-blue-500/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 bg-blue-500/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 bg-blue-500/60 rounded-full animate-bounce" />
      </div>
    </div>
  </div>
);

export default function QuizPage() {
  const router = useRouter();
  const params = useParams<{ quizId: string }>();
  const quizId = params?.quizId;

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 1, total: 0 }); // Initialize with 0 to indicate unknown total
  const { quizConfig } = useQuiz();
  const searchParams = useSearchParams();

  const hasInitialized = useRef(false);

  // Fetch quiz details and start/resume
  useEffect(() => {
    const startQuiz = async () => {
      if (!quizId || hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in");
          router.push("/login");
          return;
        }

        // Get quiz details first
        const detailsRes = await fetch(`${API_URL}/quiz/getdetails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId }),
        });

        if (!detailsRes.ok) throw new Error("Quiz not found");
        const details = await detailsRes.json();

        if (details.data.status === "COMPLETED") {
          router.replace(`/results/${quizId}`);
          return;
        }

        // Resume or start
        const endpoint = details.data.status === "IN_PROGRESS" ? "resume" : "start";
        const res = await fetch(`${API_URL}/quiz/${endpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: quizConfig?.userId || searchParams.get("userId") ,
            quizId,
          }),
        });

        if (!res.ok) throw new Error("Failed to load quiz");

        const response = await res.json();
        const data = response.data;

        setCurrentQuestion(data.question);
        
        // Use questions count from details or start response, defaulting to whatever the backend sent if not explicit
        const totalQuestions = details.data.questionsCount || data.questionsCount || data.totalQuestions || (data.question ? 5 : 0);
        
        setProgress({
          current: data.currentQuestionNumber || 1,
          total: totalQuestions,
        });
      } catch (err: any) {
        console.error("Start quiz error:", err);
        alert(`Error: ${err.message}`);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    startQuiz();
  }, [quizId, router]);

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim() || !currentQuestion || isSubmitting || !quizId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/quiz/submit-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: quizConfig?.userId || searchParams.get("userId") ,
          quizId,
          question: currentQuestion.questionText,
          questionType: currentQuestion.questionType,
          userAnswer,
          subtopicTitle: currentQuestion?.subtopic,
          options: currentQuestion.options || [],
        }),
      });

      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Submission failed");

      const result = response.data;

      if (result.quizCompleted) {
        router.replace(`/results/${quizId}`);
      } else {
        setCurrentQuestion(result.nextQuestion);
        setProgress(result.progress);
        setUserAnswer("");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Background Layer matching main page */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black opacity-100" />
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10">
          <SimpleLoader text="Preparing Quiz" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex flex-col">
      {/* Background Layer matching Landing Page */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black opacity-100" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col justify-center py-4 md:py-8">
        <div className="w-full">
          {currentQuestion && (
            <div className="transition-all duration-500 animate-in fade-in zoom-in-95">
              <QuizQuestion
                questionText={currentQuestion.questionText}
                difficulty={currentQuestion.difficultyLevel}
                questionType={
                  currentQuestion.questionType === "scenario"
                    ? "scenario"
                    : currentQuestion.questionType === "descriptive"
                    ? "descriptive"
                    : "multiple_choice"
                }
                options={currentQuestion.options || []}
                mode="quiz"
                currentQuestion={progress.current}
                totalQuestions={progress.total}
                userAnswer={userAnswer}
                onAnswer={setUserAnswer}
                onNext={handleAnswerSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-2xl transition-all duration-300">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-4">
            <SimpleLoader text="Analyzing Response" />
          </div>
        </div>
      )}
    </div>
  );
}