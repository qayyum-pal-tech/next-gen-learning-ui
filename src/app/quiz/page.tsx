"use client";

import { useSearchParams } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import QuizLanding from "@/app/components/QuizLandingPage";

export default function QuizStartPage() {
  const searchParams = useSearchParams();
  const { quizConfig } = useQuiz();

  const pathId = quizConfig?.pathId || searchParams.get("pathId") || "learning-path-default";
  const userId = quizConfig?.userId || searchParams.get("userId") || "user123";
  const assessmentType = quizConfig?.assessmentType || "PRE_ASSESSMENT";
  const categoryTitle = quizConfig?.categoryTitle || searchParams.get("categoryTitle") || searchParams.get("title") || "General Assessment";
  const courseTitle = quizConfig?.courseTitle || searchParams.get("courseTitle");

  return <QuizLanding
    userId={userId}
    pathId={pathId}
    assessmentType={assessmentType}
    categoryTitle={categoryTitle}
    courseTitle={courseTitle || undefined}
    stepId={quizConfig?.stepId}
    subtopicId={quizConfig?.subtopicId}
    subtopicTitle={quizConfig?.subtopicTitle}
  />
}