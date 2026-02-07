'use client'

import { useState } from 'react'
import {
  X,
  Clock,
  Zap,
  Target,
  GraduationCap,
  Rocket,
  Moon,
  Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PathCreationModalProps {
  courseTitle: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    courseTitle: string
    duration: number
    speed: string
    depth: string
    goal: string
  }) => void
}

const DURATION_MARKS = [4, 10, 20, 40, 80, 100]
const SPEED_OPTIONS = ['Deep Dive', 'Fast Track', 'Slow & Steady', 'Flexible']
const DEPTH_OPTIONS = ['Basic', 'Intermediate', 'Advanced', 'Expert']
const GOAL_OPTIONS = [
  'Interview Preparation',
  'Project Ready',
  'Foundation Building',
  'Rapid Skill',
  'Creative Exploration',
]

export default function PathCreationModal({
  courseTitle,
  isOpen,
  onClose,
  onSubmit,
}: PathCreationModalProps) {
  const [durationIndex, setDurationIndex] = useState(3) // Index 3 corresponds to 40h
  const [speed, setSpeed] = useState('Fast Track')
  const [depth, setDepth] = useState('Intermediate')
  const [goal, setGoal] = useState('Project Ready')
  const [isDarkMode, setIsDarkMode] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit({
      courseTitle,
      duration: DURATION_MARKS[durationIndex],
      speed,
      depth,
      goal,
    })
  }

  const themeClasses = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    bgSecondary: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgButton: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',

    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textBlue: isDarkMode ? 'text-blue-400' : 'text-blue-600',

    border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    borderBlue: isDarkMode ? 'border-blue-500/30' : 'border-blue-400',

    shadow: isDarkMode
      ? 'shadow-2xl shadow-black/70'
      : 'shadow-2xl shadow-gray-400/20',

    hoverButton: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    selectedButton: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
    sliderTrack: isDarkMode ? 'bg-gray-800' : 'bg-gray-200',
  }

  return (
    <>
      <div
        className="overlay-animate fixed inset-0 z-50 cursor-pointer bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
        <div
          className={`relative w-full max-w-md ${themeClasses.bg} rounded-2xl border ${themeClasses.border} modal-animate-in shadow-2xl`}
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

          <div className={`border-b p-4 ${themeClasses.border} relative`}>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <img
                  src="/brain.png"
                  alt="Brain Icon"
                  className="h-18 w-18 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between pt-4">
                  <div>
                    <h2
                      className={`text-base font-bold ${themeClasses.text} tracking-tight`}
                    >
                      Let's make this path just as you need
                    </h2>
                    <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
                      Customize{' '}
                      <span className={`${themeClasses.textBlue} font-medium`}>
                        {courseTitle}
                      </span>{' '}
                      journey
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className={`h-8 w-8 ${themeClasses.textMuted} hover:${themeClasses.textBlue} hover:${themeClasses.hoverButton} cursor-pointer`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`h-5 w-5 ${themeClasses.textBlue}`} />
                  <label
                    className={`text-sm font-semibold ${themeClasses.text}`}
                  >
                    Total time you can spend on this course?
                  </label>
                </div>
                <span
                  className={`text-2xl font-bold ${themeClasses.textBlue} ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-lg border px-4 py-1.5 ${themeClasses.borderBlue}`}
                >
                  {DURATION_MARKS[durationIndex]}h
                </span>
              </div>

              <Slider
                defaultValue={[3]}
                min={0}
                max={DURATION_MARKS.length - 1}
                step={1}
                value={[durationIndex]}
                onValueChange={(vals) => setDurationIndex(vals[0])}
                className={`[&>span:first-child]:h-1 [&>span:first-child]:${themeClasses.sliderTrack} cursor-pointer [&_[role=slider]]:border-blue-500 [&_[role=slider]]:bg-blue-500`}
              />

              <div className="flex justify-between">
                {DURATION_MARKS.map((mark, index) => (
                  <button
                    key={mark}
                    onClick={() => setDurationIndex(index)}
                    className={`cursor-pointer text-xs font-medium transition-all ${
                      durationIndex === index
                        ? `${themeClasses.textBlue} ${themeClasses.selectedButton} rounded border px-2 py-1 ${themeClasses.borderBlue}`
                        : `${themeClasses.textMuted} hover:${themeClasses.text}`
                    }`}
                  >
                    {mark}h
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className={`h-5 w-5 ${themeClasses.textBlue}`} />
                <label className={`text-sm font-semibold ${themeClasses.text}`}>
                  How would you like to pace your learning?
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SPEED_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSpeed(option)}
                    className={`cursor-pointer rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                      speed === option
                        ? `${themeClasses.selectedButton} ${themeClasses.textBlue} border-blue-400 shadow-lg shadow-blue-500/10`
                        : `${themeClasses.bgButton} border-gray-300 ${themeClasses.textMuted} hover:${themeClasses.textBlue} hover:border-blue-400`
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <GraduationCap className={`h-5 w-5 ${themeClasses.textBlue}`} />
                <label className={`text-sm font-semibold ${themeClasses.text}`}>
                  How deep would you like to go?
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {DEPTH_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDepth(option)}
                    className={`cursor-pointer rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                      depth === option
                        ? `${themeClasses.selectedButton} ${themeClasses.textBlue} border-blue-400 shadow-lg shadow-blue-500/10`
                        : `${themeClasses.bgButton} border-gray-300 ${themeClasses.textMuted} hover:${themeClasses.textBlue} hover:border-blue-400`
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Rocket className={`h-5 w-5 ${themeClasses.textBlue}`} />
                <label className={`text-sm font-semibold ${themeClasses.text}`}>
                  What's your main reason for learning this?
                </label>
              </div>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger
                  className={`w-full ${themeClasses.bgButton} border-gray-300 ${themeClasses.text} cursor-pointer hover:border-blue-400 focus:border-blue-500`}
                >
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent
                  className={`${themeClasses.bg} border-gray-300 shadow-lg shadow-gray-400/20`}
                >
                  {GOAL_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className={`${themeClasses.textMuted} hover:${themeClasses.selectedButton} hover:${themeClasses.textBlue} focus:${themeClasses.selectedButton} focus:${themeClasses.textBlue} data-[state=checked]:${themeClasses.textBlue} data-[state=checked]:${themeClasses.selectedButton} cursor-pointer`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${isDarkMode ? 'bg-blue-500/50' : 'bg-blue-400'}`}
                        ></div>
                        {option}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`border-t p-6 ${themeClasses.border}`}>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={onClose}
                className={`border-gray-300 ${isDarkMode ? 'bg-blue-500/5 hover:bg-blue-500/5' : ''} ${themeClasses.textMuted} hover:${themeClasses.textBlue} hover:border-blue-400 hover:${themeClasses.hoverButton} cursor-pointer`}
              >
                Cancel
              </Button>
              <div className="group relative">
                <Button
                  onClick={handleSubmit}
                  className={`cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 pr-12 pl-6 font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform duration-200 group-hover:translate-x-2 hover:from-blue-700 hover:to-blue-600`}
                >
                  Create Learning Path
                  <span className="absolute right-8 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
