export type QuestionType = 'multiple_choice' | 'descriptive' | 'scenario';

export interface QuizRecord {
    questionText: string;
    questionType: string;
    options: string[];
    correctAnswer: string;
    userAnswer: string;
    explanation: string;
    score: number;
    difficulty?: number;
    subtopic?: string;
}

export interface QuizPreviewData {
    quizId: string;
    assessmentType: string;
    categoryTitle: string;
    subtopicTitle: string;
    status: string;
    questions: QuizRecord[];
    finalScore: number;
    finalFeedback: string;
    insights: {
        strengths: string[];
        weaknesses: string[];
    };
    startedAt: string;
    completedAt: string;
}

export type AssessmentType = 'PRE_ASSESSMENT' | 'SKILL_CHECK';
