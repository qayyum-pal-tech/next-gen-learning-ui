// "use client";

// import { use, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import confetti from "canvas-confetti";
// import { Home, Award, Clock, Target, BarChart3, Sparkles, Eye, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

// const API_URL = "http://localhost:5000";

// interface QuizResult {
//   quizId: string;
//   category: string;
//   subcategory: string;
//   assessmentType: 'PRE_ASSESSMENT' | 'SKILL_CHECK';
//   score: number;
//   totalScore: number;
//   percentage: number;
//   questionsCount: number;
//   performanceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
//   performanceFeedback: string;
//   strengths: string[];
//   weaknesses: string[];
//   areasToImprove: string[];
//   startedAt: string;
//   completedAt: string;
//   duration: number;
// }

// export default function ResultsPage({
//   params,
// }: {
//   params: Promise<{ quizId: string }>;
// }) {
//   const { quizId } = use(params);
//   const router = useRouter();
//   const [result, setResult] = useState<QuizResult | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [animatedScore, setAnimatedScore] = useState(0);
//   const [animatedPercent, setAnimatedPercent] = useState(0);
  
//   // Feedback states
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [typedFeedback, setTypedFeedback] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
  
//   // Insights states
//   const [showStrengths, setShowStrengths] = useState(false);
//   const [typedStrengths, setTypedStrengths] = useState<string[]>([]);
//   const [showWeaknesses, setShowWeaknesses] = useState(false);
//   const [typedWeaknesses, setTypedWeaknesses] = useState<string[]>([]);
//   const [showAreasToImprove, setShowAreasToImprove] = useState(false);
//   const [typedAreasToImprove, setTypedAreasToImprove] = useState<string[]>([]);

//   // Fetch results from backend
//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const userId = localStorage.getItem("userId");
        
//         if (!token || !userId || !quizId) {
//           router.replace("/login");
//           return;
//         }

//         const res = await fetch(`${API_URL}/quiz/results/${quizId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ quizId, userId }),
//         });

//         if (!res.ok) throw new Error("Failed to load results");

//         const response = await res.json();
//         const resultData = response.data;

//         setResult(resultData);
        
//         // Animate score
//         const targetPercent = resultData.percentage;
//         const userScore = resultData.score;
//         const totalScore = resultData.totalScore;

//         let currentScore = 0;
//         let currentPercent = 0;
//         const duration = 1500;
//         const steps = 60;
//         const incrementScore = userScore / steps;
//         const incrementPercent = targetPercent / steps;

//         const timer = setInterval(() => {
//           currentScore += incrementScore;
//           currentPercent += incrementPercent;

//           if (currentScore >= userScore) {
//             currentScore = userScore;
//             currentPercent = targetPercent;
//             clearInterval(timer);
//           }

//           setAnimatedScore(Math.floor(currentScore));
//           setAnimatedPercent(Math.floor(currentPercent));
//         }, duration / steps);

//         setLoading(false);
//       } catch (error: any) {
//         console.error("Results fetch error:", error);
//         alert("Could not load results. Please try again.");
//         router.replace("/history");
//       }
//     };

//     fetchResults();
//   }, [quizId, router]);

//   // Confetti effect
//   useEffect(() => {
//     if (!result) return;

//     confetti({
//       particleCount: 500,
//       spread: 80,
//       origin: { y: 0.3, x: 0.3 },
//       colors: ["#a78bfa", "#60a5fa"],
//       ticks: 200,
//       startVelocity: 70,
//       gravity: 2.0,
//       decay: 0.92,
//     });

//     confetti({
//       particleCount: 500,
//       spread: 80,
//       origin: { y: 0.3, x: 0.7 },
//       ticks: 200,
//       startVelocity: 70,
//       gravity: 2.0,
//       decay: 0.92,
//       colors: ["#60a5fa", "#34d399"],
//     });
//   }, [result]);

//   // Typing animation for feedback
//   useEffect(() => {
//     if (!showFeedback || !result?.performanceFeedback) return;

//     setIsTyping(true);
//     setTypedFeedback("");

//     const feedback = result.performanceFeedback;
//     let i = 0;

//     const typingInterval = setInterval(() => {
//       if (i < feedback.length) {
//         setTypedFeedback(feedback.substring(0, i + 1));
//         i++;
//       } else {
//         setIsTyping(false);
//         clearInterval(typingInterval);
//       }
//     }, 30);

//     return () => clearInterval(typingInterval);
//   }, [showFeedback, result?.performanceFeedback]);

//   // Typing animation for strengths
//   useEffect(() => {
//     if (!showStrengths || !result?.strengths.length) return;

//     const typeStrengths = async () => {
//       const newTyped: string[] = [];
//       for (let i = 0; i < result.strengths.length; i++) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         newTyped.push(result.strengths[i]);
//         setTypedStrengths([...newTyped]);
//       }
//     };
//     typeStrengths();
//   }, [showStrengths, result?.strengths]);

//   // Typing animation for weaknesses
//   useEffect(() => {
//     if (!showWeaknesses || !result?.weaknesses.length) return;

//     const typeWeaknesses = async () => {
//       const newTyped: string[] = [];
//       for (let i = 0; i < result.weaknesses.length; i++) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         newTyped.push(result.weaknesses[i]);
//         setTypedWeaknesses([...newTyped]);
//       }
//     };
//     typeWeaknesses();
//   }, [showWeaknesses, result?.weaknesses]);

//   // Typing animation for areas to improve
//   useEffect(() => {
//     if (!showAreasToImprove || !result?.areasToImprove.length) return;

//     const typeAreas = async () => {
//       const newTyped: string[] = [];
//       for (let i = 0; i < result.areasToImprove.length; i++) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         newTyped.push(result.areasToImprove[i]);
//         setTypedAreasToImprove([...newTyped]);
//       }
//     };
//     typeAreas();
//   }, [showAreasToImprove, result?.areasToImprove]);

//   const getPerformanceData = () => {
//     if (!result) return {
//       emoji: "💪",
//       message: "Keep practicing!",
//       color: "from-rose-400 to-pink-400",
//       bgColor: "bg-rose-50",
//       textColor: "text-rose-700"
//     };

//     const percent = result.percentage;
//     if (percent >= 90) {
//       return {
//         emoji: "🎯",
//         message: "Outstanding!",
//         color: "from-emerald-400 to-teal-400",
//         bgColor: "bg-emerald-50",
//         textColor: "text-emerald-700"
//       };
//     } else if (percent >= 70) {
//       return {
//         emoji: "🌟",
//         message: "Excellent work!",
//         color: "from-blue-400 to-cyan-400",
//         bgColor: "bg-blue-50",
//         textColor: "text-blue-700"
//       };
//     } else if (percent >= 50) {
//       return {
//         emoji: "👍",
//         message: "Good job!",
//         color: "from-amber-400 to-yellow-400",
//         bgColor: "bg-amber-50",
//         textColor: "text-amber-700"
//       };
//     } else {
//       return {
//         emoji: "💪",
//         message: "Keep practicing!",
//         color: "from-rose-400 to-pink-400",
//         bgColor: "bg-rose-50",
//         textColor: "text-rose-700"
//       };
//     }
//   };

//   const performance = getPerformanceData();

//   const goToHome = () => router.push("/home");
//   const goToHistory = () => router.push("/history");
//   const goToPreview = () => router.push(`/preview/${quizId}`);
//   const generatePath = () => router.push(`/learning-path/${quizId}`);

//   const generateFeedback = () => setShowFeedback(true);
//   const toggleStrengths = () => setShowStrengths(!showStrengths);
//   const toggleWeaknesses = () => setShowWeaknesses(!showWeaknesses);
//   const toggleAreasToImprove = () => setShowAreasToImprove(!showAreasToImprove);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"></div>
//           <p className="mt-3 text-slate-600 text-sm">Loading your results...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!result) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-slate-600 text-sm">Results not found</p>
//           <button 
//             onClick={goToHistory}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
//           >
//             Go to History
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 p-4">
//       <div className="fixed inset-0 pointer-events-none z-40" id="confetti-container" />

//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-3 shadow-sm">
//             <Sparkles className="h-4 w-4 text-amber-500" />
//             <span className="text-sm font-medium text-slate-700">Quiz Completed</span>
//           </div>
//           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-2">
//             Amazing Work!
//           </h1>
//           <p className="text-slate-600 text-sm">Here&apos;s how you performed</p>
//         </div>

//         <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm mb-6">
//           <div className={`${performance.bgColor} rounded-xl p-4 text-center mb-6 border ${performance.textColor} border-opacity-20`}>
//             <div className="text-3xl mb-2">{performance.emoji}</div>
//             <p className="text-sm font-medium">{performance.message}</p>
//           </div>

//           <div className="text-center mb-6">
//             <span className="inline-block px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full border border-slate-200">
//               {result.subcategory}
//             </span>
//           </div>

//           <div className="grid grid-cols-4 gap-4 mb-6">
//             <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
//               <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
//               <div className="text-lg font-bold text-slate-800">{result.questionsCount}</div>
//               <div className="text-xs text-slate-600 font-medium">Questions</div>
//             </div>
//             <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
//               <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
//               <div className="text-lg font-bold text-slate-800">{result.totalScore}</div>
//               <div className="text-xs text-slate-600 font-medium">Total Score</div>
//             </div>
//             <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
//               <BarChart3 className="h-6 w-6 text-amber-600 mx-auto mb-2" />
//               <div className="text-lg font-bold text-slate-800">{animatedScore}</div>
//               <div className="text-xs text-slate-600 font-medium">Your Score</div>
//             </div>
//             <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl border border-violet-200 shadow-sm">
//               <TrendingUp className="h-6 w-6 text-violet-600 mx-auto mb-2" />
//               <div className="text-lg font-bold text-slate-800">{animatedPercent}%</div>
//               <div className="text-xs text-slate-600 font-medium">Accuracy</div>
//             </div>
//           </div>

//           {/* AI Feedback Section */}
//           <div className="mb-6">
//             <div 
//               className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
//                 showFeedback
//                   ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm"
//                   : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:border-blue-300"
//               }`}
//               onClick={generateFeedback}
//             >
//               <div className="flex items-center gap-3">
//                 <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                   showFeedback ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
//                 }`}>
//                   <Sparkles className="h-5 w-5" />
//                 </div>
//                 <div className="flex-1 min-h-[60px] flex items-center">
//                   {!showFeedback ? (
//                     <div>
//                       <p className="text-sm font-medium text-slate-800">Get AI Performance Feedback</p>
//                       <p className="text-xs text-slate-600 mt-1">Click to generate personalized insights about your performance</p>
//                     </div>
//                   ) : (
//                     <div className="w-full">
//                       <p className="text-sm font-medium text-slate-800 mb-2">AI Feedback</p>
//                       <p className="text-sm text-slate-700 leading-relaxed">
//                         {typedFeedback}
//                         {isTyping && (
//                           <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></span>
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Strengths Section */}
//           {result.strengths.length > 0 && (
//             <div className="mb-6">
//               <div 
//                 className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
//                   showStrengths
//                     ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm"
//                     : "bg-gradient-to-br from-slate-50 to-green-50 border-slate-200 hover:border-green-300"
//                 }`}
//                 onClick={toggleStrengths}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                     showStrengths ? "bg-emerald-100 text-emerald-600" : "bg-green-100 text-green-600"
//                   }`}>
//                     <CheckCircle className="h-5 w-5" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-slate-800 mb-2">Your Strengths</p>
//                     {showStrengths && (
//                       <ul className="space-y-2">
//                         {typedStrengths.map((strength, index) => (
//                           <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
//                             <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
//                             <span>{strength}</span>
//                           </li>
//                         ))}
//                         {result.strengths.length > typedStrengths.length && (
//                           <li className="text-sm text-slate-500 italic">Loading more...</li>
//                         )}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Weaknesses Section */}
//           {result.weaknesses.length > 0 && (
//             <div className="mb-6">
//               <div 
//                 className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
//                   showWeaknesses
//                     ? "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-sm"
//                     : "bg-gradient-to-br from-slate-50 to-rose-50 border-slate-200 hover:border-rose-300"
//                 }`}
//                 onClick={toggleWeaknesses}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                     showWeaknesses ? "bg-rose-100 text-rose-600" : "bg-red-100 text-red-600"
//                   }`}>
//                     <AlertTriangle className="h-5 w-5" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-slate-800 mb-2">Areas to Improve</p>
//                     {showWeaknesses && (
//                       <ul className="space-y-2">
//                         {typedWeaknesses.map((weakness, index) => (
//                           <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
//                             <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
//                             <span>{weakness}</span>
//                           </li>
//                         ))}
//                         {result.weaknesses.length > typedWeaknesses.length && (
//                           <li className="text-sm text-slate-500 italic">Loading more...</li>
//                         )}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Areas to Improve Section */}
//           {result.areasToImprove.length > 0 && (
//             <div className="mb-6">
//               <div 
//                 className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
//                   showAreasToImprove
//                     ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm"
//                     : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:border-blue-300"
//                 }`}
//                 onClick={toggleAreasToImprove}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                     showAreasToImprove ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
//                   }`}>
//                     <Lightbulb className="h-5 w-5" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-slate-800 mb-2">Recommended Focus Areas</p>
//                     {showAreasToImprove && (
//                       <ul className="space-y-2">
//                         {typedAreasToImprove.map((area, index) => (
//                           <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
//                             <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
//                             <span>{area}</span>
//                           </li>
//                         ))}
//                         {result.areasToImprove.length > typedAreasToImprove.length && (
//                           <li className="text-sm text-slate-500 italic">Loading more...</li>
//                         )}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="space-y-2">
//           <div className="grid grid-cols-3 gap-3">
//             <button
//               onClick={goToHistory}
//               className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all border border-slate-200 text-sm shadow-sm hover:shadow-md"
//             >
//               <Clock className="h-4 w-4" />
//               History
//             </button>
//             <button
//               onClick={goToPreview}
//               className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-medium rounded-xl transition-all border border-blue-200 text-sm shadow-sm hover:shadow-md"
//             >
//               <Eye className="h-4 w-4" />
//               Preview
//             </button>
//             <button
//               onClick={generatePath}
//               className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium rounded-xl transition-all border border-purple-200 text-sm shadow-sm hover:shadow-md"
//             >
//               <Target className="h-4 w-4" />
//               Generate Path
//             </button>
//           </div>
//           <button
//             onClick={goToHome}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 font-medium rounded-xl transition-all border border-emerald-200 text-sm shadow-sm hover:shadow-md"
//           >
//             <Home className="h-4 w-4" />
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }







// src/app/results/[quizId]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Home, Award, Clock, Target, BarChart3, Sparkles, Eye, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

const API_URL = "http://localhost:5000";

interface QuizResult {
  quizId: string;
  category: string;
  subcategory: string;
  assessmentType: 'PRE_ASSESSMENT' | 'SKILL_CHECK';
  score: number;
  totalScore: number;
  percentage: number;
  questionsCount: number;
  performanceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  performanceFeedback: string;
  strengths: string[];
  weaknesses: string[];
  areasToImprove: string[];
  startedAt: string;
  completedAt: string;
  duration: number;
}

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
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [typedFeedback, setTypedFeedback] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Insights states
  const [showStrengths, setShowStrengths] = useState(false);
  const [typedStrengths, setTypedStrengths] = useState<string[]>([]);
  const [showWeaknesses, setShowWeaknesses] = useState(false);
  const [typedWeaknesses, setTypedWeaknesses] = useState<string[]>([]);
  const [showAreasToImprove, setShowAreasToImprove] = useState(false);
  const [typedAreasToImprove, setTypedAreasToImprove] = useState<string[]>([]);

  // Fetch results from backend
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId || !quizId) {
          router.replace("/login");
          return;
        }

        const res = await fetch(`${API_URL}/quiz/results/${quizId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quizId, userId }),
        });

        if (!res.ok) throw new Error("Failed to load results");

        const response = await res.json();
        const resultData = response.data;

        setResult(resultData);
        
        // Animate score
        const targetPercent = resultData.percentage;
        const userScore = resultData.score;
        const totalScore = resultData.totalScore;

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
      } catch (error: any) {
        console.error("Results fetch error:", error);
        alert("Could not load results. Please try again.");
        router.replace("/history");
      }
    };

    fetchResults();
  }, [quizId, router]);

  // Confetti effect
  useEffect(() => {
    if (!result) return;

    confetti({
      particleCount: 500,
      spread: 80,
      origin: { y: 0.3, x: 0.3 },
      colors: ["#a78bfa", "#60a5fa"],
      ticks: 200,
      startVelocity: 70,
      gravity: 2.0,
      decay: 0.92,
    });

    confetti({
      particleCount: 500,
      spread: 80,
      origin: { y: 0.3, x: 0.7 },
      ticks: 200,
      startVelocity: 70,
      gravity: 2.0,
      decay: 0.92,
      colors: ["#60a5fa", "#34d399"],
    });
  }, [result]);

  // Typing animation for feedback
  useEffect(() => {
    if (!showFeedback || !result?.performanceFeedback) return;

    setIsTyping(true);
    setTypedFeedback("");

    const feedback = result.performanceFeedback;
    let i = 0;

    const typingInterval = setInterval(() => {
      if (i < feedback.length) {
        setTypedFeedback(feedback.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [showFeedback, result?.performanceFeedback]);

  // Typing animation for strengths
  useEffect(() => {
    if (!showStrengths || !result?.strengths.length) return;

    const typeStrengths = async () => {
      const newTyped: string[] = [];
      for (let i = 0; i < result.strengths.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        newTyped.push(result.strengths[i]);
        setTypedStrengths([...newTyped]);
      }
    };
    typeStrengths();
  }, [showStrengths, result?.strengths]);

  // Typing animation for weaknesses
  useEffect(() => {
    if (!showWeaknesses || !result?.weaknesses.length) return;

    const typeWeaknesses = async () => {
      const newTyped: string[] = [];
      for (let i = 0; i < result.weaknesses.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        newTyped.push(result.weaknesses[i]);
        setTypedWeaknesses([...newTyped]);
      }
    };
    typeWeaknesses();
  }, [showWeaknesses, result?.weaknesses]);

  // Typing animation for areas to improve
  useEffect(() => {
    if (!showAreasToImprove || !result?.areasToImprove.length) return;

    const typeAreas = async () => {
      const newTyped: string[] = [];
      for (let i = 0; i < result.areasToImprove.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        newTyped.push(result.areasToImprove[i]);
        setTypedAreasToImprove([...newTyped]);
      }
    };
    typeAreas();
  }, [showAreasToImprove, result?.areasToImprove]);

  const getPerformanceData = () => {
    if (!result) return {
      emoji: "💪",
      message: "Keep practicing!",
      color: "from-rose-400 to-pink-400",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700"
    };

    const percent = result.percentage;
    if (percent >= 90) {
      return {
        emoji: "🎯",
        message: "Outstanding!",
        color: "from-emerald-400 to-teal-400",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700"
      };
    } else if (percent >= 70) {
      return {
        emoji: "🌟",
        message: "Excellent work!",
        color: "from-blue-400 to-cyan-400",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700"
      };
    } else if (percent >= 50) {
      return {
        emoji: "👍",
        message: "Good job!",
        color: "from-amber-400 to-yellow-400",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700"
      };
    } else {
      return {
        emoji: "💪",
        message: "Keep practicing!",
        color: "from-rose-400 to-pink-400",
        bgColor: "bg-rose-50",
        textColor: "text-rose-700"
      };
    }
  };

  const performance = getPerformanceData();

  const goToHome = () => router.push("/home");
  const goToHistory = () => router.push("/history");
  const goToPreview = () => router.push(`/preview/${quizId}`);
  const generatePath = () => router.push(`/learning-path/${quizId}`);

  const generateFeedback = () => setShowFeedback(true);
  const toggleStrengths = () => setShowStrengths(!showStrengths);
  const toggleWeaknesses = () => setShowWeaknesses(!showWeaknesses);
  const toggleAreasToImprove = () => setShowAreasToImprove(!showAreasToImprove);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"></div>
          <p className="mt-3 text-slate-600 text-sm">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-sm">Results not found</p>
          <button 
            onClick={goToHistory}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Go to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 p-4">
      <div className="fixed inset-0 pointer-events-none z-40" id="confetti-container" />

      {/* Header - Centered */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-3 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">Quiz Completed</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-2">
            Amazing Work!
          </h1>
          <p className="text-slate-600 text-sm">Here&apos;s how you performed</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Metrics & Navigation */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className={`${performance.bgColor} rounded-xl p-4 text-center mb-6 border ${performance.textColor} border-opacity-20`}>
              <div className="text-3xl mb-2">{performance.emoji}</div>
              <p className="text-sm font-medium">{performance.message}</p>
            </div>

            <div className="text-center mb-6">
              <span className="inline-block px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full border border-slate-200">
                {result.subcategory}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-slate-800">{result.questionsCount}</div>
                <div className="text-xs text-slate-600 font-medium">Questions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
                <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-slate-800">{result.totalScore}</div>
                <div className="text-xs text-slate-600 font-medium">Total Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
                <BarChart3 className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-slate-800">{animatedScore}</div>
                <div className="text-xs text-slate-600 font-medium">Your Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl border border-violet-200 shadow-sm">
                <TrendingUp className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-slate-800">{animatedPercent}%</div>
                <div className="text-xs text-slate-600 font-medium">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">What's Next?</h3>
            <div className="space-y-3">
              <button
                onClick={goToHistory}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all border border-slate-200 text-sm shadow-sm hover:shadow-md"
              >
                <Clock className="h-4 w-4" />
                View History
              </button>
              <button
                onClick={goToPreview}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-medium rounded-xl transition-all border border-blue-200 text-sm shadow-sm hover:shadow-md"
              >
                <Eye className="h-4 w-4" />
                Preview Quiz
              </button>
              <button
                onClick={generatePath}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium rounded-xl transition-all border border-purple-200 text-sm shadow-sm hover:shadow-md"
              >
                <Target className="h-4 w-4" />
                Generate Learning Path
              </button>
              <button
                onClick={goToHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 font-medium rounded-xl transition-all border border-emerald-200 text-sm shadow-sm hover:shadow-md"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - AI Insights */}
        <div className="space-y-6">
          {/* AI Feedback Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div 
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                showFeedback
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm"
                  : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:border-blue-300"
              }`}
              onClick={generateFeedback}
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  showFeedback ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                }`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 min-h-[60px] flex items-center">
                  {!showFeedback ? (
                    <div>
                      <p className="text-sm font-medium text-slate-800">Get AI Performance Feedback</p>
                      <p className="text-xs text-slate-600 mt-1">Click to generate personalized insights about your performance</p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="text-sm font-medium text-slate-800 mb-2">AI Feedback</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {typedFeedback}
                        {isTyping && (
                          <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"></span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Strengths Section */}
          {result.strengths.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div 
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  showStrengths
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm"
                    : "bg-gradient-to-br from-slate-50 to-green-50 border-slate-200 hover:border-green-300"
                }`}
                onClick={toggleStrengths}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    showStrengths ? "bg-emerald-100 text-emerald-600" : "bg-green-100 text-green-600"
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-2">Your Strengths</p>
                    {showStrengths && (
                      <ul className="space-y-2">
                        {typedStrengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                        {result.strengths.length > typedStrengths.length && (
                          <li className="text-sm text-slate-500 italic">Loading more...</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weaknesses Section */}
          {result.weaknesses.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div 
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  showWeaknesses
                    ? "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-sm"
                    : "bg-gradient-to-br from-slate-50 to-rose-50 border-slate-200 hover:border-rose-300"
                }`}
                onClick={toggleWeaknesses}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    showWeaknesses ? "bg-rose-100 text-rose-600" : "bg-red-100 text-red-600"
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-2">Areas to Improve</p>
                    {showWeaknesses && (
                      <ul className="space-y-2">
                        {typedWeaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                            <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                        {result.weaknesses.length > typedWeaknesses.length && (
                          <li className="text-sm text-slate-500 italic">Loading more...</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Areas to Improve Section */}
          {result.areasToImprove.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div 
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  showAreasToImprove
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm"
                    : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:border-blue-300"
                }`}
                onClick={toggleAreasToImprove}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    showAreasToImprove ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
                  }`}>
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-2">Recommended Focus Areas</p>
                    {showAreasToImprove && (
                      <ul className="space-y-2">
                        {typedAreasToImprove.map((area, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                            <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{area}</span>
                          </li>
                        ))}
                        {result.areasToImprove.length > typedAreasToImprove.length && (
                          <li className="text-sm text-slate-500 italic">Loading more...</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}