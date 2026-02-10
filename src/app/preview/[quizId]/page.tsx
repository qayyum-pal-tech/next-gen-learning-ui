"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Question from "@/app/components/QuizQuestion";
import { 
  ChevronLeft, ChevronRight, BarChart3, 
   Award,  ArrowLeft,
  Calendar,
  Brain
} from "lucide-react";
import { QuizPreviewData } from "@/lib/types";

import { useSearchParams } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SimpleLoader = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500/10 rounded-full animate-spin border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
      <div className="absolute inset-0 bg-blue-500/5 blur-2xl animate-pulse rounded-full" />
    </div>
    <div className="flex flex-col items-center gap-2">
      <p className="text-blue-400 font-bold tracking-[0.2em] animate-pulse uppercase text-xs">{text}</p>
    </div>
  </div>
);

export default function QuizPreviewPage() {
  const params = useParams<{ quizId: string }>();
  const quizId = params?.quizId;
  const router = useRouter();

  const [quizPreview, setQuizPreview] = useState<QuizPreviewData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
     const { quizConfig } = useQuiz();
     const searchParams = useSearchParams();
     const USER_ID =  quizConfig?.userId || searchParams.get("userId");
     console.log("user id",USER_ID)
    

  useEffect(() => {
    const fetchQuizPreview = async () => {
      if (!quizId) return;
      try {
        const token = localStorage.getItem("token");
        if (!token || !USER_ID) throw new Error("Authentication required");

        const res = await fetch(`${API_URL}/quiz/preview/${quizId}`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:USER_ID, quizId })
        });

        if (!res.ok) throw new Error("Failed to fetch quiz preview");

        const response = await res.json();
        setQuizPreview(response.data);
      } catch (err: any) {
        console.error("Fetch quiz preview error:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setShowContent(true);
        }, 1000);
      }
    };

    fetchQuizPreview();
  }, [quizId]);

  const handleNextQuestion = () => {
    if (quizPreview?.questions && currentQuestionIndex < quizPreview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading || !showContent) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <SimpleLoader text="Recovering Evaluation Data" />
      </div>
    );
  }

  if (!quizPreview || !quizPreview.questions || quizPreview.questions.length === 0) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="relative z-10 text-center space-y-4">
          <p className="text-slate-500 text-sm">No evaluation records found for this quiz.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentRecord = quizPreview.questions[currentQuestionIndex];
  const recordsCount = quizPreview.questions.length;
  const totalPossibleScore = recordsCount * 10;
  const scorePercentage = Math.round((quizPreview.finalScore / totalPossibleScore) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex flex-col selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <header className="relative z-20 bg-slate-900/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
              title="Back to History"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-8 w-px bg-white/5 hidden sm:block" />
            <div className="space-y-0.5">
              <h1 className="text-base font-bold text-white tracking-tight">{quizPreview.categoryTitle}</h1>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                <span>{quizPreview.subtopicTitle}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400">{formatDate(quizPreview.completedAt)}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg ${
              scorePercentage >= 70 ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-blue-500/5 border-blue-500/20 text-blue-400"
            }`}>
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{scorePercentage}% Final Rank</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto h-full px-6 py-8 flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <Question
                questionText={currentRecord.questionText}
                questionType={
                  currentRecord.questionType === "scenario"
                    ? "scenario"
                    : currentRecord.questionType === "descriptive"
                    ? "descriptive"
                    : "multiple_choice"
                }
                options={currentRecord.options}
                mode="preview"
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={quizPreview.questions.length}
                correctAnswer={currentRecord.correctAnswer}
                userAnswer={currentRecord.userAnswer}
                explanation={currentRecord.explanation}
                score={currentRecord.score}
                difficulty={currentRecord.difficulty}
                onNext={handleNextQuestion}
              />
            </div>
          </div>

          <aside className="lg:w-80 space-y-6 flex flex-col">
            
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-blue-400">
                <Brain className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Post-Analysis Stats</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Total Score</p>
                  <p className="text-xl font-black text-white">{quizPreview.finalScore}<span className="text-[10px] text-slate-600 font-medium">/{totalPossibleScore}</span></p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Rank</p>
                  <p className={`text-xl font-black ${scorePercentage >= 70 ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {scorePercentage >= 80 ? 'Elite' : scorePercentage >= 60 ? 'Pro' : 'Solid'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Success Rate</span>
                  <span className="text-white font-mono">{scorePercentage}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      scorePercentage >= 70 ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex-1 flex flex-col shadow-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-5">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Question Matrix</span>
              </div>

              <div className="grid grid-cols-5 gap-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1 content-start">
                {quizPreview.questions.map((record, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`aspect-square rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center ${
                      index === currentQuestionIndex
                        ? "bg-white text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : record.score >= 8
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          : record.score >= 5
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:grayscale text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border border-white/5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === quizPreview.questions.length - 1}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                
              </div>
            </div>
          </aside>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}