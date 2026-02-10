'use client'

import { Button } from '@/components/ui/button'
import { X, ArrowLeft, Sparkles } from 'lucide-react'

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
  if (!isOpen) return null

  const themeClasses = {
    bg: 'bg-slate-950/95 backdrop-blur-xl bg-gradient-to-br from-slate-900 via-slate-950 to-black',
    bgSecondary: 'bg-slate-900/40 backdrop-blur-sm',
    bgButton: 'bg-slate-900/60 border-slate-800/50 hover:bg-slate-800/80 hover:border-blue-500/50',

    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    textBlue: 'text-blue-400',

    border: 'border-slate-800/60',
    borderBlue: 'border-blue-500/40',

    shadow: 'shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)]',
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md ${themeClasses.bg} rounded-3xl border ${themeClasses.border} ${themeClasses.shadow} overflow-hidden modal-animate-in`}
        >
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-purple-600/10 rounded-full blur-3xl" />

          {onBack && (
            <button
              onClick={onBack}
              className={`absolute top-4 left-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-blue-500/30 hover:bg-slate-800/80 transition-all`}
            >
              <ArrowLeft className={`h-4 w-4 ${themeClasses.textMuted} hover:${themeClasses.textBlue}`} />
            </button>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-8 w-8 rounded-xl bg-slate-900/50 border border-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-8 relative">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-md" />
                  <Sparkles className="relative h-6 w-6 text-blue-400" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text}`}>
                  Wait! Want the perfect path?
                </h3>
              </div>
              <p className={`text-sm ${themeClasses.textMuted} pl-9`}>
                Take a 5-min quiz to get a journey tailored{' '}
                <span className={`${themeClasses.textBlue} font-medium`}>just for you</span>
              </p>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
                <img
                  src="take-quiz.png"
                  alt="Smart Quiz"
                  className="relative h-60 w-60 max-w-full object-contain"
                />
              </div>
            </div>

            <div className="mb-8 text-center">
              <p className={`text-sm ${themeClasses.textMuted} leading-relaxed`}>
                Save hours of irrelevant content with a <br />
                <span className="text-slate-200">personalized roadmap</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
                <Button
                  onClick={onTakeQuiz}
                  className="relative w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold text-white transition-all duration-300 rounded-2xl group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  <span className="flex items-center justify-center gap-3">
                    Take the Smart Quiz
                    <ArrowLeft className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={onSkipQuiz}
                className={`w-full py-6 rounded-2xl border-slate-800/80 bg-slate-900/30 ${themeClasses.textMuted} hover:text-white hover:border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer`}
              >
                Skip to generic path
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}







