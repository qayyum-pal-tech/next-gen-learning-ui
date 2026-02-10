

'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Clock,
  Zap,
  GraduationCap,
  Rocket,
  Sparkles,
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
  const [durationIndex, setDurationIndex] = useState(3) 
  const [speed, setSpeed] = useState('Fast Track')
  const [depth, setDepth] = useState('Intermediate')
  const [goal, setGoal] = useState('Project Ready')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = () => {
    setIsVisible(false)
    setTimeout(() => {
      onSubmit({
        courseTitle,
        duration: DURATION_MARKS[durationIndex],
        speed,
        depth,
        goal,
      })
    }, 300)
  }

  if (!isOpen && !isVisible) return null

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-lg transform-gpu transition-all duration-300 ${
            isVisible
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-8 opacity-0 scale-95'
          }`}
        >
          <div className="absolute -top-4 -right-4 h-20 w-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-2xl" />

          <div className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl border border-gray-800/50 shadow-2xl shadow-blue-500/10 backdrop-blur-xl overflow-hidden">
            <div className="relative p-6 border-b border-gray-800/50">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-md" />
                    <Sparkles className="relative h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white">
                      Customize Your Journey
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Tailor your learning experience for{' '}
                      <span className="font-medium text-blue-400">
                        {courseTitle}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors ml-2 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <label className="text-sm font-medium text-white">
                      Total time commitment?
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-sm rounded-lg" />
                    <div className="relative px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                      <span className="text-xl font-bold text-white">
                        {DURATION_MARKS[durationIndex]}h
                      </span>
                    </div>
                  </div>
                </div>

                <Slider
                  defaultValue={[3]}
                  min={0}
                  max={DURATION_MARKS.length - 1}
                  step={1}
                  value={[durationIndex]}
                  onValueChange={(vals) => setDurationIndex(vals[0])}
                  className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-gray-800 [&_[role=slider]]:border-blue-400 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-blue-500 [&_[role=slider]]:to-purple-500 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-blue-500/25 cursor-pointer"
                />

                <div className="flex justify-between pt-1">
                  {DURATION_MARKS.map((mark, index) => (
                    <button
                      key={mark}
                      onClick={() => setDurationIndex(index)}
                      className={`text-xs font-medium transition-all duration-200 px-2 py-1 ${
                        durationIndex === index
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {mark}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-green-500/10 rounded-lg">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <label className="text-sm font-medium text-white">
                    Learning pace preference
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SPEED_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSpeed(option)}
                      className={`py-2.5 px-3 rounded-lg border transition-all duration-200 text-xs font-medium ${
                        speed === option
                          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-300 shadow shadow-green-500/10'
                          : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-green-500/30 hover:text-green-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-purple-500/10 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-purple-400" />
                  </div>
                  <label className="text-sm font-medium text-white">
                    Desired depth level
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {DEPTH_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setDepth(option)}
                      className={`py-2 px-2 rounded-lg border transition-all duration-200 text-xs font-medium ${
                        depth === option
                          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-300 shadow shadow-purple-500/10'
                          : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-purple-500/30 hover:text-purple-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg">
                    <Rocket className="h-4 w-4 text-orange-400" />
                  </div>
                  <label className="text-sm font-medium text-white">
                    Primary learning objective
                  </label>
                </div>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="w-full bg-gray-900/50 border-gray-800 text-white hover:border-blue-500/30 focus:border-blue-500 transition-all cursor-pointer py-4 rounded-lg">
                    <SelectValue placeholder="Select a goal">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full" />
                        {goal}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 shadow-2xl backdrop-blur-xl">
                    {GOAL_OPTIONS.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white cursor-pointer py-2.5 px-3 data-[state=checked]:bg-blue-500/10 data-[state=checked]:text-blue-300"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-400 rounded-full" />
                          {option}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800/50 bg-gradient-to-t from-gray-900/50 to-transparent">
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/30 transition-all cursor-pointer px-5 rounded-lg h-9"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer px-6 rounded-lg h-9 group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Create Learning Path
                    <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}