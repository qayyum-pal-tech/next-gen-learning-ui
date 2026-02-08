/* ─── mirrors your NestJS RoadmapFlat schema exactly ─── */

export interface Subtopic {
  _id?: string;
  title: string;
  order: number;
  description?: string;
  isCompleted: boolean;
  estimatedDuration?: string;
  resources?: string[];
  notes?: string;
}

export interface Topic {
  _id?: string;
  title: string;
  order: number;
  description?: string;
  subtopics: Subtopic[];
  isCompleted: boolean;
  estimatedDuration?: string;
}

export interface AiGeneratedMetadata {
  model: string;
  generatedAt: string;
  prompt: string;
  responseTime?: number;
}

export interface Roadmap {
  id?: string;
  subject: string;
  userId: string;
  description?: string;
  topics: Topic[];
  status: "not_started" | "in_progress" | "completed";
  difficultyLevel?: string;
  totalEstimatedDuration?: string;
  progressPercentage: number;
  aiGeneratedMetadata?: AiGeneratedMetadata;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── helper: derive lock / progress state for a topic ─── */
export interface TopicMeta {
  topic: Topic;
  index: number;
  isLocked: boolean;
  isActive: boolean;
  isCompleted: boolean;
  needsQuiz: boolean;
  progressPercent: number;
}

/* ─── content schemas ─── */

export interface Link {
  title: string;
  url: string;
  description?: string;
  source?: string;
}

export interface InterviewQA {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface CodeSnippet {
  title: string;
  code: string;
  language: string;
  explanation?: string;
}

export interface SubtopicContent {
  _id?: string;
  roadmapId: string;
  topicOrder: number;
  subtopicOrder: number;
  subtopicTitle: string;
  content: string; // Markdown
  codeExamples: CodeSnippet[];
  realWorldExamples?: string;
  articleLinks: Link[];
  documentationLinks: Link[];
  interviewQuestions: InterviewQA[];
  aiGeneratedMetadata?: {
    model: string;
    generatedAt: Date;
    prompt: string;
    responseTime: number;
  };
  isGenerated: boolean;
  estimatedReadTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GenerateContentDto {
  roadmapId: string;
  topicOrder: number;
  subtopicOrder: number;
  subtopicTitle: string;
  topicContext?: string;
  difficultyLevel?: string;
}
