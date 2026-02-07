'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, X, ArrowLeft } from 'lucide-react'

interface QuizAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onTakeQuiz: () => void
  onSkipQuiz: () => void
  onBack?: () => void
}

export default function QuizAssessmentModal({
  isOpen,
  onClose,
  onTakeQuiz,
  onSkipQuiz,
  onBack,
}: QuizAssessmentModalProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  if (!isOpen) return null

  const themeClasses = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    bgButton: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',

    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textBlue: isDarkMode ? 'text-blue-400' : 'text-blue-600',

    border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    borderBlue: isDarkMode ? 'border-blue-500/30' : 'border-blue-400',
  }

  return (
    <>
      <div
        className="overlay-animate fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md rounded-2xl border ${themeClasses.border} ${themeClasses.bg} modal-animate-in shadow-2xl`}
        >
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`absolute -top-3 -right-3 z-10 h-8 w-8 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} flex cursor-pointer items-center justify-center border-2 shadow-lg ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-white" />
            ) : (
              <Moon className="h-4 w-4 text-white" />
            )}
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className={`absolute top-1 left-1 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full`}
            >
              <ArrowLeft
                className={`h-4 w-4 ${themeClasses.textMuted} hover:${themeClasses.textBlue}`}
              />
            </button>
          )}

          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="pl-2">
                <h3 className={`text-xl font-bold ${themeClasses.text}`}>
                  Wait! Want the perfect path?
                </h3>
                <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
                  Take a 5-min quiz to get a journey tailored{' '}
                  <span className={`${themeClasses.textBlue} font-medium`}>
                    just for you
                  </span>
                </p>
              </div>
              <button
                onClick={onClose}
                className={`h-8 w-8 rounded-full ${themeClasses.bgButton} flex items-center justify-center ${themeClasses.textMuted} hover:${themeClasses.textBlue} cursor-pointer`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-8 flex justify-center">
              <img
                src="take-quiz.png"
                alt="Smart Quiz"
                className="h-70 w-70 max-w-full"
              />
            </div>

            <div className="mb-8 text-center">
              <p className={`text-sm ${themeClasses.textMuted}`}>
                Save hours of irrelevant content with a personalized roadmap
              </p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <Button
                  onClick={onTakeQuiz}
                  className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 py-6 text-lg font-semibold text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20 hover:from-blue-700 hover:to-blue-600"
                >
                  <span className="flex items-center justify-center gap-3">
                    Take the Smart Quiz
                    <span className="transform opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>
                  </span>
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={onSkipQuiz}
                className={`w-full border ${themeClasses.border} ${themeClasses.textMuted} hover:${themeClasses.textBlue} cursor-pointer hover:border-blue-400`}
              >
                <span className="flex items-center justify-center gap-2">
                  Skip to generic path
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
