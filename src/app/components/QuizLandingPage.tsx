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

  const catTitle = assessmentType === 'SKILL_CHECK' ? categoryTitle : courseTitle;


  const handleStartQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload:any = {
        userId,
        assessmentType,
        pathId,
        categoryId: catTitle?.toLowerCase().replace(/\s+/g, '-'),
        categoryTitle: catTitle,
      };

      if (stepId) payload.stepId = stepId;
      
   

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/quiz/start`, {
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
    <div className="h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Dedicated Background Layer for Pulsing Gradient - Fixed Shade Issue */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black animate-pulse-intense opacity-100" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="h-full max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 flex flex-col justify-center relative z-10 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center">
          <div className="lg:w-3/5 flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  {assessmentType === 'SKILL_CHECK' ? 'Focused Skill Check' : 'Adaptive Assessment'}
                </span>
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Let&apos;s Test Your &nbsp;
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                     Knowledge!
                  </span>
                </h1>
                
                <div className="flex flex-col gap-0.5 md:gap-1">
                  <span className="text-xl md:text-3xl font-bold text-slate-200">
                    {catTitle}
                  </span>
                  {assessmentType === 'SKILL_CHECK' && subtopicTitle && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm md:text-lg">
                      <div className="h-4 w-px bg-slate-800 mx-1" />
                      <span>Focus: {subtopicTitle}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
                {assessmentType === 'SKILL_CHECK'
                  ? "Take a targeted deep dive into this specific concept to validate your mastery and identify growth areas."
                  : "A personalized, adaptive assessment designed to benchmark your overall skill level across this topic."}
              </p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-2 md:p-2 border border-white/5 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 rounded-2xl pointer-events-none" />
              
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                <div className="p-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                </div>
                How it works
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-400">01</span>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {assessmentType === 'SKILL_CHECK'
                      ? "Questions are focused on one key concept."
                      : "Difficulty adapts based on your performance."}
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-400">02</span>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">Multi-format including scenerios and written inputs.</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-400">03</span>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">Stress-free environment — answer at your own pace.</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-400">04</span>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">Get immediate feedback and actionable insights.</p>
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-slate-900/40 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/5 shadow-lg group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                  <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider">Time</span>
                </div>
                <p className="text-sm md:text-lg font-bold text-white">~5 min</p>
              </div>
              
              <div className="bg-slate-900/40 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/5 shadow-lg group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                  <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider">Items</span>
                </div>
                <p className="text-sm md:text-lg font-bold text-white">
                  {assessmentType === 'SKILL_CHECK' ? '5-10' : '10-15'}
                </p>
              </div>
              
              <div className="bg-slate-900/40 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/5 shadow-lg group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <BarChart className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                  <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider">Format</span>
                </div>
                <p className="text-sm md:text-lg font-bold text-white">
                  {assessmentType === 'SKILL_CHECK' ? 'Focused' : 'Adaptive'}
                </p>
              </div>
            </div> */}

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <button
                onClick={handleGoHome}
                onMouseEnter={() => setIsHoveringHome(true)}
                onMouseLeave={() => setIsHoveringHome(false)}
                className="group bg-slate-900/50 text-slate-300 font-semibold py-3 md:py-4 px-6 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm cursor-pointer sm:w-auto text-sm md:text-base"
              >
                <Home className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${
                  isHoveringHome ? '-translate-y-0.5' : ''
                }`} />
                <span>Back Home</span>
              </button>
              
              <button
                onClick={handleStartQuiz}
                onMouseEnter={() => setIsHoveringStart(true)}
                onMouseLeave={() => setIsHoveringStart(false)}
                className="group relative flex-1 overflow-hidden rounded-xl cursor-pointer"
              >
                <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-3 py-3 md:py-4 px-6 md:px-8 text-white font-bold text-base md:text-lg shadow-[0_0_20px_rgba(37,99,235,0.2)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all">
                  <span>
                    {assessmentType === 'SKILL_CHECK' ? 'Start Skill Check' : 'Begin Assessment'}
                  </span>
                  <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${
                    isHoveringStart ? 'translate-x-1.5' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex lg:w-2/5 items-center justify-center">
            <div className="relative w-full aspect-square max-h-[450px] xl:max-h-[550px] rounded-3xl overflow-hidden group">
              {/* Layered Background Glows */}
              <div className="absolute inset-0 bg-blue-600/5 blur-[100px] group-hover:blur-[80px] transition-all duration-700" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative h-full w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-10 flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                
                <div className="relative w-full h-full">
                  <img
                    src={"/quiz.png"}
                    alt={"quiz illustration"}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.2)] transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center">
                          <div class="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
                            <div class="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-110"></div>
                            <div class="relative w-full h-full rounded-2xl bg-slate-800/50 border border-blue-500/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                              <svg class="w-12 h-12 md:w-16 md:h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                              </svg>
                            </div>
                          </div>
                          <div class="text-center px-4">
                            <h4 class="text-white font-bold text-lg md:text-xl mb-2">Ready?</h4>
                            <p class="text-slate-400 max-w-[200px] mx-auto text-xs leading-relaxed">
                              Get an adaptive path tailored for <span class="text-blue-400 font-semibold">${catTitle}</span>
                            </p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute top-8 left-8 w-10 h-10 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center transform group-hover:translate-y-[-5px] transition-transform duration-500 shadow-xl">
                  <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-400">?</div>
                </div>
                
                <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center transform group-hover:translate-y-[-8px] transition-transform duration-700 delay-75 shadow-xl">
                  <div className="text-lg font-bold text-green-400">✓</div>
                </div>
                
                <div className="absolute top-1/2 right-4 w-9 h-9 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center transform group-hover:translate-x-[5px] transition-transform duration-600 shadow-xl">
                  <div className="text-xs font-bold text-blue-400">15</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(6deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(-6deg); }
        }
        
        @keyframes pulse-intense {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        
        .animate-pulse-intense {
          animation: pulse-intense 12s ease-in-out infinite;
        }
        
        .absolute.top-10, .absolute.top-8 {
          animation: float 7s ease-in-out infinite;
        }
        
        .absolute.bottom-10, .absolute.bottom-8 {
          animation: float-slow 9s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}