"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

import { useSearchParams } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import {
  Home, Target, BarChart3,
  Sparkles, Eye, TrendingUp, CheckCircle,
  AlertTriangle, ChevronRight,
  BrainCircuit
} from "lucide-react";
import { createRoadmap } from '@/utils/apis/roadmapApi';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface QuizResult {
  quizId: string;
  category: string;
  subcategory: string;
  assessmentType: 'PRE_ASSESSMENT' | 'SKILL_CHECK';
  score: number;
  totalScore: number;
  percentage: number;
  questionsCount: number;
  performanceFeedback: string;
  strengths: string[];
  weaknesses: string[];
  startedAt: string;
  completedAt: string;
}

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

export default function ResultsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const [showFeedback, setShowFeedback] = useState(false);
  const [typedFeedback, setTypedFeedback] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [showStrengths, setShowStrengths] = useState(false);
  const [typedStrengths, setTypedStrengths] = useState<string[]>([]);
  const [showWeaknesses, setShowWeaknesses] = useState(false);
  const [typedWeaknesses, setTypedWeaknesses] = useState<string[]>([]);
  const { quizConfig } = useQuiz();
  const searchParams = useSearchParams();
  const USER_ID = quizConfig?.userId || searchParams.get("userId");
  const [isGenerating, setIsGenerating] = useState(false);


  useEffect(() => {
    const fetchResults = async () => {
      try {


        const res = await fetch(`${API_URL}/quiz/results/${quizId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizId, userId: USER_ID }),
        });

        if (!res.ok) throw new Error("Failed to load results");

        const response = await res.json();
        const resultData = response.data;
        setResult(resultData);

        const targetPercent = resultData.percentage;
        const userScore = resultData.score;
        let currentScore = 0;
        let currentPercent = 0;
        const duration = 1500;
        const steps = 60;
        const incrementScore = userScore / steps;
        const incrementPercent = targetPercent / steps;

        const timer = setInterval(() => {
          currentScore += incrementScore;
          currentPercent += incrementPercent;
          if (currentScore >= userScore) {
            currentScore = userScore;
            currentPercent = targetPercent;
            clearInterval(timer);
          }
          setAnimatedScore(Math.floor(currentScore));
          setAnimatedPercent(Math.floor(currentPercent));
        }, duration / steps);

        setLoading(false);
      } catch (error) {
        console.error("Results fetch error:", error);
        router.replace("/history");
      }
    };
    fetchResults();
  }, [quizId, router]);

  useEffect(() => {
    if (!result || result.percentage < 50) return;
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#8b5cf6", "#10b981"]
    });
  }, [result]);

  // Automated sequence effect
  useEffect(() => {
    if (!loading && result) {
      const timer = setTimeout(() => setShowFeedback(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, result]);

  useEffect(() => {
    if (!showFeedback || !result?.performanceFeedback) return;
    setIsTyping(true);
    let i = 0;
    const feedback = result.performanceFeedback;
    const interval = setInterval(() => {
      if (i < feedback.length) {
        setTypedFeedback(feedback.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        if (result.strengths?.length > 0) setShowStrengths(true);
        else setShowWeaknesses(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [showFeedback, result?.performanceFeedback]);

  const typeList = async (list: string[], setter: (val: string[]) => void, onComplete?: () => void) => {
    const newTyped: string[] = [];
    for (const item of list) {
      await new Promise(r => setTimeout(r, 300));
      newTyped.push(item);
      setter([...newTyped]);
    }
    onComplete?.();
  };

  useEffect(() => {
    if (showStrengths && result?.strengths.length) {
      typeList(result.strengths, setTypedStrengths, () => {
        setShowWeaknesses(true);
      });
    }
  }, [showStrengths, result?.strengths]);

  useEffect(() => {
    if (showWeaknesses && result?.weaknesses.length) {
      typeList(result.weaknesses, setTypedWeaknesses);
    }
  }, [showWeaknesses, result?.weaknesses]);

  const handleGenerateRoadmap = async () => {
    if (!result || !USER_ID) return;

    setIsGenerating(true);
    try {
      const { customizationData, courseTitle } = quizConfig || {};

      const newRoadmap = await createRoadmap({
        subject: courseTitle || result.category,
        userId: USER_ID,
        difficultyLevel: customizationData?.depth?.toLowerCase() || 'intermediate',
        additionalContext: `
          Goal: ${customizationData?.goal || 'General Learning'}, 
          Time: ${customizationData?.duration || 20}h, 
          Pace: ${customizationData?.speed || 'Fast Track'},
          Quiz Score: ${result.percentage}%,
          Strengths: ${result.strengths.join(', ')},
          Weaknesses: ${result.weaknesses.join(', ')},
          AI Feedback: ${result.performanceFeedback}
        `
      });

      router.push(`/roadmap/${newRoadmap.id}`);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };


  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <SimpleLoader text="Analyzing Experience" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex flex-col selection:bg-blue-500/30">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-purple-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <main className="flex-1 relative z-10 w-full overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">

          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Analysis Complete</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 tracking-tight">
              {result.percentage >= 70 ? "Excellent Performance" : "Solid Effort"}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Core Metrics */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden group">
                {/* Visual Card Glow */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-600/5 rounded-full blur-[50px] group-hover:bg-blue-600/10 transition-all duration-500" />

                <div className="relative z-10 space-y-6">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Subtopic Mastery</p>
                    <h2 className="text-lg font-bold text-white leading-tight">{result.subcategory}</h2>
                  </div>

                  {/* Circular Accuracy Gauge - Refined Precision */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90 transform">
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={263.89}
                          strokeDashoffset={263.89 - (263.89 * animatedPercent) / 100}
                          className="text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{animatedPercent}%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Accuracy</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">
                        Performance indicates a professional grasp of core conceptual patterns in this module.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group/stat">
                      <div className="p-1.5 w-fit rounded-lg bg-blue-500/10 mb-2.5 group-hover/stat:bg-blue-500/20 transition-colors">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-xl font-bold text-white">{animatedScore}<span className="text-slate-500 text-xs font-medium">/{result.totalScore}</span></p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mt-1">Total Points</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group/stat">
                      <div className="p-1.5 w-fit rounded-lg bg-purple-500/10 mb-2.5 group-hover/stat:bg-purple-500/20 transition-colors">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-xl font-bold text-white">{result.questionsCount}</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mt-1">Questions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/history")}
                  className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-white/5 rounded-xl hover:bg-slate-800 transition-all group shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-bold text-slate-300">View History</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => router.push(`/preview/${quizId}`)}
                  className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-white/5 rounded-xl hover:bg-slate-800 transition-all group shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-slate-300">Review Quiz</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 transition-all" />
                </button>

                {/* Shimmering CTA - Tightened */}
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={isGenerating}
                  className="sm:col-span-2 relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-xs text-white shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <div className="relative flex items-center justify-center gap-2.5">
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <BrainCircuit className="w-4 h-4" />
                    )}
                    {isGenerating ? "Synthesizing Path..." : "Generate AI Learning Path"}
                  </div>
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="sm:col-span-2 flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest"
                >
                  <Home className="w-3.5 h-3.5" />
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Right Column: AI Insights */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary AI Report */}
              <div
                className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${showFeedback
                    ? "bg-slate-900/60 border-blue-500/20 shadow-2xl backdrop-blur-2xl"
                    : "bg-slate-900/40 border-white/5 hover:border-blue-500/20"
                  }`}
                onClick={() => setShowFeedback(true)}
              >
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/10 transition-all" />

                <div className="relative z-10 flex gap-5">
                  <div className={`p-3 h-fit rounded-xl transition-all duration-500 ${showFeedback ? "bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "bg-white/5 text-slate-600"
                    }`}>
                    <Sparkles className={`w-6 h-6 ${showFeedback ? "animate-pulse" : ""}`} />
                  </div>

                  <div className="flex-1 space-y-2">
                    {!showFeedback ? (
                      <>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">AI Cognitive Analysis</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Processing conceptual breakdown and decision patterns...
                        </p>
                        <div className="flex items-center gap-2 pt-0.5 text-blue-500 text-[9px] font-bold uppercase tracking-[0.2em]">
                          <span>Analyzing</span>
                          <div className="w-3.5 h-3.5 rounded-full border border-blue-500/30 border-t-blue-500 animate-spin" />
                        </div>
                      </>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-right-3 duration-500">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">AI ENGINE INSIGHT</h3>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                          {typedFeedback}
                          {isTyping && <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse rounded-full" />}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Detail Grids */}
              <div className="flex flex-col gap-5">
                <div
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden relative ${showStrengths ? "bg-emerald-500/5 border-emerald-500/10 shadow-2xl backdrop-blur-2xl" : "bg-slate-900/40 border-white/5 hover:border-emerald-500/10"
                    }`}
                  onClick={() => setShowStrengths(true)}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`p-2 rounded-lg ${showStrengths ? "bg-emerald-100/10 text-emerald-400" : "bg-white/5 text-slate-700"}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Core Mastery Areas</span>
                    </div>
                    {!showStrengths ? (
                      <p className="text-xs text-slate-700 italic">Identifying mastery areas...</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {typedStrengths.map((s, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5 animate-in slide-in-from-bottom-2 duration-300 hover:border-emerald-500/10 transition-all">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-slate-300">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden relative ${showWeaknesses ? "bg-rose-500/5 border-rose-500/10 shadow-2xl backdrop-blur-2xl" : "bg-slate-900/40 border-white/5 hover:border-rose-500/10"
                    }`}
                  onClick={() => setShowWeaknesses(true)}
                >
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`p-2 rounded-lg ${showWeaknesses ? "bg-rose-100/10 text-rose-400" : "bg-white/5 text-slate-700"}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Conceptual Growth Gaps</span>
                    </div>
                    {!showWeaknesses ? (
                      <p className="text-xs text-slate-700 italic">Analyzing growth gaps...</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {typedWeaknesses.map((w, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5 animate-in slide-in-from-bottom-2 duration-300 hover:border-rose-500/10 transition-all">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-slate-300">{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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