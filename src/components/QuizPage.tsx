"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import QuizQuestion from "./QuizQuestion";
import { PreparingQuizLoader } from "@/lib/PreparingQuizLoader";
import { EvaluatingQuizLoader } from "@/lib/EvaluationLoader";

const API_URL = "http://localhost:5000";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams<{ quizId: string }>();
  const quizId = params?.quizId;

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 1, total: 5 }); // Default 5 questions
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Fetch quiz details and start/resume
  useEffect(() => {
    const startQuiz = async () => {
      if (!quizId) return;

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
            userId: 'user123',
            quizId,
          }),
        });

        if (!res.ok) throw new Error("Failed to load quiz");

        const response = await res.json();
        const data = response.data;

        setCurrentQuestion(data.question);
        setProgress({
          current: data.currentQuestionNumber || 1,
          total: details.data.questionsCount || 5,
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
    console.log("userAnswer", userAnswer);
    console.log("currentQuestion", currentQuestion);
    console.log("isSubmitting", isSubmitting);
    console.log("quizId", quizId);
    if (!userAnswer.trim() || !currentQuestion || isSubmitting || !quizId) return;

    console.log("passed")
    setIsSubmitting(true);
    try {
    //   const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/quiz/submit-answer`, {
        method: "POST",
        headers: {
        //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 'user123',
          quizId,
          question: currentQuestion.questionText,
          questionType: currentQuestion.questionType,
          userAnswer,
          subtopicTitle: currentQuestion?.subtopic, // if available
        }),
      });

      const response = await res.json();
      console.log("got response",response)
      if (!res.ok) throw new Error(response.error || "Submission failed");

      const result = response.data;

      if (result.quizCompleted) {
        setIsQuizCompleted(true);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <PreparingQuizLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            {currentQuestion && (
              <QuizQuestion
                questionText={currentQuestion.questionText}
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
            )}
          </div>

        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-sm">
          <EvaluatingQuizLoader />
        </div>
      )}
    </div>
  );
}