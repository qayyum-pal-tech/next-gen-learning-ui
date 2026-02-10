"use client"
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Target, 
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Code,
  Database,
  Cloud,
  Cpu,
  Brain,
  LineChart as LineChartIcon,
  History,
  Layers
} from 'lucide-react';
import { getQuizAnalytics, getAppAnalytics } from '@/utils/apis/analyticsApi';
import { useAuthStore } from '@/store/auth.store';

interface AnalyticsData {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  quizHistory: Array<{
    id: string;
    date: string;
    category: string;
    questionsCount: number;
    score: number;
    status: 'completed' | 'in-progress';
  }>;
}

interface AppAnalyticsData {
  pathsCompleted: number;
  totalLearningHours: number;
  pathsInProgress: number;
  domains: {
    name: string;
    count: number;
    description: string;
  }[];
  recentActivity: {
    id: string;
    pathTitle: string;
    progress: number;
    lastActivity: string;
    estimatedCompletion: string;
    quizTrend: number[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
  skillInsights: {
    skill: string;
    level: number;
    progress: number;
    projects: number;
  }[];
}

const generateColors = (count: number) => {
  const baseColors = ['#8B5CF6', '#3B82F6', '#10B981']
  return baseColors.slice(0, count)
}

export default function AnalyticsPage() {
  /* ── dependencies ── */
  const { user } = useAuthStore();
  const USER_ID = user?._id || user?.id;

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [appAnalytics, setAppAnalytics] = useState<AppAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true) // Start loading true
  const [error, setError] = useState<string | null>(null)

  const [animatedValues, setAnimatedValues] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    pathsCompleted: 0,
    totalLearningHours: 0,
    pathsInProgress: 0
  })
  const [expandedPath, setExpandedPath] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'quizHistory' | 'skillInsights'>('quizHistory')

  useEffect(() => {
    const fetchData = async () => {
      if (!USER_ID) return;
      
      try {
        setLoading(true);
        const [quizData, appData] = await Promise.all([
          getQuizAnalytics(USER_ID),
          getAppAnalytics(USER_ID)
        ]);
        
        setAnalytics(quizData);
        setAppAnalytics(appData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [USER_ID]);

  useEffect(() => {
    if (analytics && appAnalytics && !loading) {
      animateNumbers()
    }
  }, [analytics, appAnalytics, loading])

  const animateNumbers = () => {
    if (!analytics || !appAnalytics) return

    const duration = 800
    const steps = 40
    const stepDuration = duration / steps

    const increments = {
      totalQuizzes: analytics.totalQuizzes / steps,
      averageScore: analytics.averageScore / steps,
      highestScore: analytics.highestScore / steps,
      pathsCompleted: appAnalytics.pathsCompleted / steps,
      totalLearningHours: appAnalytics.totalLearningHours / steps,
      pathsInProgress: appAnalytics.pathsInProgress / steps
    }

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setAnimatedValues({
        totalQuizzes: Math.min(Math.floor(increments.totalQuizzes * currentStep), analytics.totalQuizzes),
        averageScore: Math.min(increments.averageScore * currentStep, analytics.averageScore),
        highestScore: Math.min(increments.highestScore * currentStep, analytics.highestScore),
        pathsCompleted: Math.min(Math.floor(increments.pathsCompleted * currentStep), appAnalytics.pathsCompleted),
        totalLearningHours: Math.min(increments.totalLearningHours * currentStep, appAnalytics.totalLearningHours),
        pathsInProgress: Math.min(Math.floor(increments.pathsInProgress * currentStep), appAnalytics.pathsInProgress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          totalQuizzes: analytics.totalQuizzes,
          averageScore: analytics.averageScore,
          highestScore: analytics.highestScore,
          pathsCompleted: appAnalytics.pathsCompleted,
          totalLearningHours: appAnalytics.totalLearningHours,
          pathsInProgress: appAnalytics.pathsInProgress
        })
      }
    }, stepDuration)
  }

  const renderMiniLineGraph = (scores: number[], color: string) => {
    if (scores.length === 0) return null

    return (
      <div className="h-8 w-full">
        <svg viewBox="0 0 100 15" className="w-full h-full">
          <polyline
            points={scores.map((score, i) => {
              const x = scores.length === 1 ? 50 : (i / (scores.length - 1)) * 100
              const y = 15 - (score / 100) * 12
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  if (!analytics || !appAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const dynamicColors = generateColors(appAnalytics.domains.length)
  const pieData = appAnalytics?.domains.map((domain, index) => ({
    name: domain.name,
    value: domain.count,
    color: dynamicColors[index],
    description: domain.description
  })) || []


  const getSkillIcon = (skillName: string) => {
    switch(skillName.toLowerCase()) {
      case 'react': return <Code className="w-4 h-4" />
      case 'typescript': return <Brain className="w-4 h-4" />
      case 'node.js': return <Cpu className="w-4 h-4" />
      case 'python': return <Database className="w-4 h-4" />
      default: return <Cloud className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8 rounded">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 relative z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-gray-400 mt-2">Track your learning progress and performance</p>
          </div>
          <div className="relative">
            <div className="relative group">
              <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700">
                <LineChartIcon className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Learning Overview */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            <h3 className="text-base font-semibold text-gray-100 mb-4">Overview</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-900/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <div className="text-xl font-bold text-gray-100">{animatedValues.pathsCompleted}</div>
                </div>
                <div className="p-3 bg-gray-900/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Active</span>
                  </div>
                  <div className="text-xl font-bold text-gray-100">{animatedValues.pathsInProgress}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-900/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-gray-400">Quizzes</span>
                  </div>
                  <div className="text-xl font-bold text-gray-100">{animatedValues.totalQuizzes}</div>
                </div>
                <div className="p-3 bg-gray-900/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-400">Avg Score</span>
                  </div>
                  <div className="text-xl font-bold text-gray-100">{animatedValues.averageScore.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-900/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-gray-400">Highest</span>
                  </div>
                  <div className="text-xl font-bold text-gray-100">{animatedValues.highestScore.toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-gray-900/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-gray-400">Hours</span>
                  </div>
                  <div className="text-xl font-bold text-gray-100">{animatedValues.totalLearningHours.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Analytics */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-100">Domains</h3>
              <div className="text-xs text-gray-400">{appAnalytics.domains.reduce((sum, d) => sum + d.count, 0)} total</div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={dynamicColors[index]}
                        stroke="#1F2937"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value || 0} paths`, name]}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#F3F4F6'
                    }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 mt-3">
              {pieData.map((domain, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: dynamicColors[index] }}
                  />
                  <span className="text-xs text-gray-400">{domain.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Paths - Independent Height */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 lg:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-100">Active Paths</h3>
              <div className="text-xs text-gray-400">{appAnalytics.recentActivity.length} active</div>
            </div>
            <div className="space-y-3">
              {appAnalytics.recentActivity.map((path) => {
                const isExpanded = expandedPath === path.id
                const latestScore = path.quizTrend[path.quizTrend.length - 1]
                const scoreChange = latestScore - path.quizTrend[0]
                const trendColor = scoreChange >= 0 ? '#10B981' : '#EF4444'
                
                return (
                  <div 
                    key={path.id} 
                    className="group"
                    onMouseEnter={() => setExpandedPath(path.id)}
                    onMouseLeave={() => setExpandedPath(null)}
                  >
                    <div className={`p-3 border rounded-lg transition-all duration-200 ${
                      isExpanded ? 'border-purple-500/50 bg-gray-800/40' : 'border-gray-700/50 group-hover:border-gray-600/50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs text-gray-400">{path.lastActivity}</span>
                          </div>
                          <h3 className="font-medium text-gray-100 text-sm truncate">
                            {path.pathTitle}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-100">{path.progress}%</div>
                          <div className="text-xs text-gray-400">{path.estimatedCompletion}</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-900/50 rounded-full h-1.5 mb-2">
                        <div 
                          className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-2 pt-2 border-t border-gray-700/30">
                          {renderMiniLineGraph(path.quizTrend, trendColor)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="border-b border-gray-700/50">
              <div className="flex">
                <button
                  className={`flex-1 py-3 text-sm font-medium transition-all ${
                    activeTab === 'quizHistory'
                      ? 'text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('quizHistory')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <History className="h-4 w-4" />
                    Quiz History
                  </div>
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-medium transition-all ${
                    activeTab === 'skillInsights'
                      ? 'text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('skillInsights')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="h-4 w-4" />
                    Skill Insights
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {activeTab === 'quizHistory' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Date</th>
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Category</th>
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Score</th>
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.quizHistory.map((quiz) => (
                        <tr key={quiz.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="py-2 text-gray-400 text-xs">{quiz.date}</td>
                          <td className="py-2">
                            <span className="font-medium text-gray-200 text-xs">{quiz.category}</span>
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              (quiz.score / (quiz.questionsCount * 10)) >= 80 ? 'bg-emerald-900/30 text-emerald-300' :
                              (quiz.score / (quiz.questionsCount * 10)) >= 0.6 ? 'bg-amber-900/30 text-amber-300' :
                              'bg-red-900/30 text-red-300'
                            }`}>
                              {Math.round((quiz.score / (quiz.questionsCount * 10)) * 100)}%
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              quiz.status === 'completed' ? 'bg-emerald-900/30 text-emerald-300' : 'bg-blue-900/30 text-blue-300'
                            }`}>
                              {quiz.status === 'completed' ? 'Done' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Skill</th>
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Level</th>
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Progress</th>
                        <th className="text-left py-2 text-gray-400 font-medium text-xs">Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appAnalytics.skillInsights.map((skill, index) => (
                        <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-gray-800/50 rounded">
                                {getSkillIcon(skill.skill)}
                              </div>
                              <span className="font-medium text-gray-200 text-xs">{skill.skill}</span>
                            </div>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-gray-300">{skill.level}%</span>
                              <div className="w-12 bg-gray-900/50 rounded-full h-1">
                                <div 
                                  className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center gap-1">
                              {skill.progress > 0 ? (
                                <>
                                  <ArrowUp className="w-3 h-3 text-emerald-400" />
                                  <span className="text-xs text-emerald-400">+{skill.progress}%</span>
                                </>
                              ) : skill.progress < 0 ? (
                                <>
                                  <ArrowDown className="w-3 h-3 text-red-400" />
                                  <span className="text-xs text-red-400">{skill.progress}%</span>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2">
                            <span className="text-xs text-gray-300">{skill.projects}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}