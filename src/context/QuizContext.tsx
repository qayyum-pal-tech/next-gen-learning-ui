"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AssessmentType } from '@/components/QuizLandingPage';

interface QuizConfig {
  pathId: string;
  userId: string;
  assessmentType: AssessmentType;
  categoryTitle?: string;
  courseTitle?: string;
  stepId?: string;
  subtopicId?: string;
  subtopicTitle?: string;
  customizationData?: any;
}

interface QuizContextType {
  quizConfig: QuizConfig | null;
  setQuizConfig: (config: QuizConfig) => void;
  clearQuizConfig: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizConfig, setQuizConfigState] = useState<QuizConfig | null>(null);

  const setQuizConfig = (config: QuizConfig) => {
    setQuizConfigState(config);
  };

  const clearQuizConfig = () => {
    setQuizConfigState(null);
  };

  return (
    <QuizContext.Provider value={{ quizConfig, setQuizConfig, clearQuizConfig }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
