"use client";
import { useState, useEffect } from "react";


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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPreview = mode === "preview";
  const showProgress = mode === "quiz" || mode === "preview";

  // Determine input label based on type
  const getInputPlaceholder = () => {
    if (questionType === "scenario") {
      return "Describe how you would handle this situation...";
    }
    return "Type your answer here...";
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              mode === "quiz" ? "bg-red-500 animate-pulse" :
              mode === "preview" ? "bg-blue-500" : "bg-green-500"
            }`} />
            <div className="text-lg font-semibold text-gray-800">
              {showProgress ? (
                <span>Question {currentQuestion} of {totalQuestions}</span>
              ) : (
                <span>Question {currentQuestion}</span>
              )}
            </div>
          </div>

          {/* <div className="flex gap-4">
            {hasQuestionTimer && (
              <div className="text-sm font-mono font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                Q: {formatTime(timeSettings.questionTimeLimit!)}
              </div>
            )}
            {hasTotalTimer && (
              <div className="text-sm font-mono font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                T: {formatTime(timeSettings.totalTimeLimit!)}
              </div>
            )}
          </div> */}
        </div>

        {showProgress && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Question Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {questionText}
          </h2>
        </div>

        {/* Multiple Choice */}
        {questionType === "multiple_choice" && options.length > 0 && (
          <div className="space-y-3 mb-6">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedOption === option
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold mr-4 ${
                    selectedOption === option
                      ? "border-blue-500 text-blue-700 bg-blue-100"
                      : "border-gray-400 text-gray-600 bg-white"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Descriptive or Scenario */}
        {(questionType === "descriptive" || questionType === "scenario") && (
          <div className="mb-6">
            <textarea
              value={textAnswer}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
            />
          </div>
        )}

        {/* Current Answer Preview */}
        {(selectedOption || textAnswer) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Your Answer</p>
                <p className="text-blue-900">{selectedOption || textAnswer}</p>
              </div>
              <button
                onClick={clearAnswer}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      {mode === "quiz" && onNext && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onNext}
              disabled={!selectedOption && !textAnswer}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
            >
              {currentQuestion === totalQuestions ? "Finish" : "Next"} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}