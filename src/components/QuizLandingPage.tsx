"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowRight, CheckCircle, Clock, Brain, BarChart } from "lucide-react";
export type AssessmentType = 'PRE_ASSESSMENT' | 'SKILL_CHECK';
export interface QuizLandingProps {
  pathId: string;
  userId: string;
  assessmentType: AssessmentType;

  categoryTitle?: string;   
  courseTitle?: string;     

  stepId?: string;
  subtopicId?: string;
  subtopicTitle?: string;
}


export default function QuizLanding({
  pathId,
  userId,
  assessmentType,
  categoryTitle,
  courseTitle,
  stepId,
  subtopicId,
  subtopicTitle,
}: QuizLandingProps) {
  const router = useRouter();
  const [isHoveringStart, setIsHoveringStart] = useState(false);
  const [isHoveringHome, setIsHoveringHome] = useState(false);

  const displayTitle = courseTitle || categoryTitle || "Your Topic";
  
  const backendCategoryTitle = categoryTitle || courseTitle || "General";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleStartQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload: any = {
        userId,
        assessmentType,
        pathId,
        categoryId: backendCategoryTitle.toLowerCase().replace(/\s+/g, '-'),
        categoryTitle: backendCategoryTitle,
      };

      if (stepId) payload.stepId = stepId;
      
      if (assessmentType === 'SKILL_CHECK') {
        if (subtopicTitle) {
          payload.subtopicTitle = subtopicTitle;
        }
        if (subtopicId) payload.subtopicId = subtopicId;
      }

      const res = await fetch(`http://localhost:5000/quiz/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to start quiz");
      }

      const data = await res.json();
      const quizId = data.data.quizId;

      router.push(`/quiz/${quizId}`);
    } catch (err: any) {
      console.error("Start quiz error:", err);
      alert(`Could not start quiz: ${err.message}`);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          <div className="lg:w-3/5 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">
                  {assessmentType === 'SKILL_CHECK' ? 'Focused Skill Check' : 'Broad Knowledge Assessment'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Let&apos;s Test Your Knowledge!
                <span className="block text-blue-600 mt-2 text-xl md:text-2xl font-semibold">
                  {displayTitle}
                  {assessmentType === 'SKILL_CHECK' && subtopicTitle && (
                    <span className="block text-slate-700 text-lg font-normal mt-1">
                      Focus: {subtopicTitle}
                    </span>
                  )}
                </span>
              </h1>
              
              <p className="text-slate-600 text-sm">
                {assessmentType === 'SKILL_CHECK'
                  ? "Deep dive into a specific concept to validate your understanding"
                  : "A personalized assessment that adapts to your skill level across the topic"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                How it works
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <p className="text-slate-700 text-sm">
                    {assessmentType === 'SKILL_CHECK'
                      ? "Questions focus deeply on one concept"
                      : "Questions adapt across subtopics based on your answers"}
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <p className="text-slate-700 text-sm">Mix of formats: multiple choice, written answers, and real scenarios</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <p className="text-slate-700 text-sm">No time pressure — answer at your own pace</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">4</span>
                  </div>
                  <p className="text-slate-700 text-sm">
                    {assessmentType === 'SKILL_CHECK'
                      ? "Get targeted feedback on this specific skill"
                      : "Receive a detailed report with strengths and areas to improve"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs text-slate-600">Time</span>
                </div>
                <p className="text-base font-semibold text-slate-800 mt-1">~5 min</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs text-slate-600">Questions</span>
                </div>
                <p className="text-base font-semibold text-slate-800 mt-1">15</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <BarChart className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs text-slate-600">Style</span>
                </div>
                <p className="text-base font-semibold text-slate-800 mt-1">
                  {assessmentType === 'SKILL_CHECK' ? 'Focused' : 'Adaptive'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleGoHome}
                onMouseEnter={() => setIsHoveringHome(true)}
                onMouseLeave={() => setIsHoveringHome(false)}
                className="group bg-white text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-sm transition-all duration-300 sm:w-auto"
              >
                <div className="flex items-center justify-center gap-2">
                  <Home className={`w-4 h-4 transition-transform duration-300 ${
                    isHoveringHome ? '-translate-x-0.5' : ''
                  }`} />
                  <span className="whitespace-nowrap">Back to Home</span>
                </div>
              </button>
              
              <button
                onClick={handleStartQuiz}
                onMouseEnter={() => setIsHoveringStart(true)}
                onMouseLeave={() => setIsHoveringStart(false)}
                className="group flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 min-w-[200px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base">
                    {assessmentType === 'SKILL_CHECK' ? 'Start Skill Check' : 'Start Assessment'}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                    isHoveringStart ? 'translate-x-1' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>

          <div className="lg:w-2/5 flex items-center justify-center">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 shadow-inner overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-0">
                <div className="relative w-full h-full">
                  <img
                    src={"/quiz.png"}
                    alt={"quiz illustration"}
                    className="w-full h-full object-contain p-4 md:p-6"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center">
                          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
                            <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <p class="text-slate-600 text-center max-w-xs">
                            Ready for your ${assessmentType === 'SKILL_CHECK' ? 'focused skill check' : 'adaptive assessment'} on<br/>
                            <span class="font-semibold">${displayTitle}</span>
                            ${assessmentType === 'SKILL_CHECK' && subtopicTitle ? `<br/>(${subtopicTitle})` : ''}
                          </p>
                        </div>
                      `;
                    }}
                  />
                </div>
                
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-lg shadow-sm border border-blue-100/50 backdrop-blur-sm flex items-center justify-center transform rotate-3">
                  <span className="text-sm font-bold text-blue-500">?</span>
                </div>
                
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/80 rounded-full shadow-sm border border-blue-100/50 backdrop-blur-sm flex items-center justify-center transform -rotate-3">
                  <span className="text-sm font-bold text-blue-500">✓</span>
                </div>
                
                <div className="absolute top-1/2 right-8 w-8 h-8 bg-white/80 rounded-lg shadow-sm border border-blue-100/50 backdrop-blur-sm flex items-center justify-center transform -rotate-12">
                  <span className="text-xs font-bold text-blue-500">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        .absolute.top-4 {
          animation: float 7s ease-in-out infinite;
        }
        
        .absolute.bottom-4 {
          animation: float 9s ease-in-out infinite 1s;
        }
        
        .absolute.right-8 {
          animation: float-slow 8s ease-in-out infinite 0.5s;
        }
        
        .bg-gradient-to-br {
          animation: pulse-subtle 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}