"use client";
import { useState, useEffect } from "react";
import { ChevronRight, RefreshCcw, HelpCircle, BarChart2, CheckCircle2, XCircle, MessageSquare, Award } from "lucide-react";

export type QuestionType = 'multiple_choice' | 'descriptive' | 'scenario';

export interface QuestionProps {
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  mode: 'quiz' | 'preview' | 'practice';
  currentQuestion?: number;
  totalQuestions?: number;
  userAnswer?: string;
  onAnswer?: (answer: string) => void;
  onNext?: () => void;
  difficulty?: number;
  correctAnswer?: string;
  explanation?: string;
  score?: number;
}

export default function Question({
  questionText,
  questionType,
  options = [],
  mode,
  currentQuestion = 1,
  totalQuestions = 1,
  userAnswer = "",
  onAnswer,
  onNext,
  difficulty,
  correctAnswer,
  explanation,
  score,
}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState(userAnswer);
  const [textAnswer, setTextAnswer] = useState(userAnswer);

  useEffect(() => {
    setSelectedOption(userAnswer);
    setTextAnswer(userAnswer);
  }, [userAnswer]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer?.(option);
  };

  const handleTextChange = (text: string) => {
    setTextAnswer(text);
    onAnswer?.(text);
  };

  const clearAnswer = () => {
    setSelectedOption("");
    setTextAnswer("");
    onAnswer?.("");
  };

  const showProgress = mode === "quiz" || mode === "preview";

  const getInputPlaceholder = () => {
    if (questionType === "scenario") {
      return "Describe how you would handle this situation...";
    }
    return "Type your answer here...";
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col transition-all duration-300 max-h-[88vh]">
      {/* Header - Reduced padding */}
      <div className="bg-white/5 border-b border-white/5 px-5 md:px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${
              mode === "quiz" ? "bg-red-500/10 border border-red-500/20" : "bg-blue-500/10 border border-blue-500/20"
            }`}>
              <HelpCircle className={`w-3.5 h-3.5 ${
                mode === "quiz" ? "text-red-400 animate-pulse" : "text-blue-400"
              }`} />
            </div>
            <div className="flex flex-col">
             
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Question {currentQuestion}</span>
                <span className="text-slate-500 font-medium">/ {totalQuestions}</span>
              </div>
              {mode === 'preview' && typeof score === 'number' && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    score >= 8 ? "bg-emerald-500/10 text-emerald-400" : 
                    score >= 5 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    Review Score: {score}/10
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode !== 'preview' && (selectedOption || textAnswer) && (
              <button
                onClick={clearAnswer}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
                title="Reset Answer"
              >
                <RefreshCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            {typeof difficulty === 'number' && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border backdrop-blur-md shadow-sm ${
                difficulty <= 2 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : difficulty >= 4
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  difficulty <= 2
                    ? "bg-emerald-400"
                    : difficulty >= 4
                    ? "bg-rose-400"
                    : "bg-blue-400"
                }`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Level {difficulty}</span>
              </div>
            )}
           
          </div>
        </div>

        {showProgress && (
          <div className="relative w-full bg-white/5 rounded-full h-1 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ width: `${totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Question Body - Reduced padding and spacing, handled scroll better */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-0.5 h-full bg-gradient-to-b from-blue-500/50 to-transparent rounded-full opacity-50" />
          <h2 className="text-lg md:text-xl font-bold text-white leading-snug tracking-tight">
            {questionText}
          </h2>
        </div>

        {/* Actionable Content */}
        <div className="space-y-3">
          {/* Multiple Choice - Reduced inner padding */}
          {questionType === "multiple_choice" && options.length > 0 && (
            <div className="grid gap-2.5">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={mode !== 'preview' ? () => handleOptionSelect(option) : undefined}
                  className={`group relative w-full p-3 md:p-4 text-left rounded-xl border transition-all duration-300 ${
                    mode === 'preview'
                      ? option === correctAnswer
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                        : option === userAnswer
                        ? "bg-rose-500/10 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                        : "bg-white/5 border-white/5 opacity-60"
                      : selectedOption === option
                      ? "bg-blue-500/10 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                      : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                  } ${mode === 'preview' ? 'cursor-default' : 'cursor-pointer'} overflow-hidden`}
                >
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        mode === 'preview'
                          ? option === correctAnswer
                            ? "border-emerald-500/50 bg-emerald-500 text-white shadow-lg"
                            : option === userAnswer
                            ? "border-rose-500/50 bg-rose-500 text-white shadow-lg"
                            : "border-white/10 bg-white/5 text-slate-500"
                          : selectedOption === option
                          ? "border-blue-500/50 bg-blue-500 text-white shadow-lg"
                          : "border-white/10 bg-white/5 text-slate-400 group-hover:border-white/30 group-hover:text-slate-200"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={`text-sm md:text-base font-medium transition-colors ${
                        mode === 'preview'
                          ? option === correctAnswer
                            ? "text-white"
                            : option === userAnswer
                            ? "text-rose-200"
                            : "text-slate-500"
                          : selectedOption === option ? "text-white" : "text-slate-300 group-hover:text-white"
                      }`}>
                        {option}
                      </span>
                    </div>

                    {mode === 'preview' && (
                      <div className="flex-shrink-0">
                        {option === correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {option === userAnswer && option !== correctAnswer && <XCircle className="w-5 h-5 text-rose-500" />}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Descriptive or Scenario - Reduced height */}
          {(questionType === "descriptive" || questionType === "scenario") && (
            <div className="group relative space-y-4">
              <div className="relative">
                <textarea
                  value={textAnswer}
                  onChange={mode !== 'preview' ? (e) => handleTextChange(e.target.value) : undefined}
                  readOnly={mode === 'preview'}
                  placeholder={getInputPlaceholder()}
                  className={`w-full h-32 md:h-36 p-4 bg-white/5 border rounded-xl resize-none outline-none transition-all duration-300 shadow-inner ${
                    mode === 'preview'
                      ? score && score >= 7 ? "border-emerald-500/30 text-slate-200" : "border-amber-500/30 text-slate-200"
                      : "border-white/10 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30 text-slate-200 placeholder:text-slate-600"
                  }`}
                />
                <div className="absolute bottom-3 right-3 text-[9px] text-slate-600 font-mono bg-slate-900/50 px-1.5 py-0.5 rounded border border-white/5">
                  {textAnswer.length} chars
                </div>
              </div>

              {mode === 'preview' && correctAnswer && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Model Answer</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">{correctAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Explanation Section */}
        {mode === 'preview' && explanation && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden group/feedback">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl group-hover/feedback:bg-blue-600/10 transition-all" />
              <div className="relative z-10 flex gap-4">
                <div className="p-2.5 h-fit rounded-lg bg-blue-500/10 text-blue-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Personalized Explanation</h4>
                   
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Reduced padding */}
      {mode === "quiz" && onNext && (
        <div className="bg-slate-900/60 backdrop-blur-md border-t border-white/5 px-6 py-4 flex justify-between items-center gap-4 mt-auto">
          <p className="hidden md:block text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
            Take your time. Accuracy counts than speed.
          </p>
          
          <button
            onClick={onNext}
            disabled={!selectedOption && !textAnswer}
            className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-lg font-bold transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-105 transition-transform duration-300" />
            
            <span className="relative z-10 text-white text-sm">
              {currentQuestion === totalQuestions ? "Finish Assessment" : "Next Question"}
            </span>
            <ChevronRight className={`relative z-10 w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:translate-x-1 ${(!selectedOption && !textAnswer) ? '' : 'animate-pulse'}`} />
          </button>
        </div>
      )}
    </div>
  );
}