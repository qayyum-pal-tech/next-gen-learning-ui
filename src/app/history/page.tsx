"use client"
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Sector } from 'recharts'
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle, 
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Brain,
  Code,
  Database,
  Cloud,
  Cpu,
  HelpCircle,
  LineChart as LineChartIcon,
  History
} from 'lucide-react';

interface AnalyticsData {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  quizHistory: Array<{
    id: string;
    date: string;
    category: string;
    questionsCount: number;
    score: number;
    status: 'completed' | 'in-progress';
  }>;
  categoryProgress: Array<{
    category: string;
    scores: number[];
    dates: string[];
  }>;
}

interface AppAnalyticsData {
  pathsCompleted: number;
  totalLearningHours: number;
  pathsInProgress: number;
  averageCompletionRate: number;
  pathsByDomain: {
    domain: string;
    count: number;
    color: string;
    description: string;
  }[];
  recentActivity: {
    id: string;
    pathTitle: string;
    progress: number;
    lastActivity: string;
    estimatedCompletion: string;
    quizTrend: number[];
    domain: string;
  }[];
  skillProgress: {
    skill: string;
    icon: React.ReactNode;
    level: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const generateColors = (count: number) => {
  const baseColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']
  if (count <= baseColors.length) {
    return baseColors.slice(0, count)
  }

  const colors = [...baseColors]
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137.508) % 360
    colors.push(`hsl(${hue}, 70%, 65%)`)
  }
  return colors
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [appAnalytics, setAppAnalytics] = useState<AppAnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    pathsCompleted: 0,
    totalLearningHours: 0,
    pathsInProgress: 0
  })
  const [expandedPath, setExpandedPath] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'quizHistory' | 'skillLevels'>('quizHistory')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const router = useRouter();

  // Dummy analytics data
  const dummyAnalytics: AnalyticsData = {
    totalQuizzes: 24,
    averageScore: 76.5,
    highestScore: 95,
    categoryDistribution: [
      { category: 'react', count: 8 },
      { category: 'javascript', count: 6 },
      { category: 'python', count: 5 },
      { category: 'nextjs', count: 3 },
      { category: 'typescript', count: 2 },
    ],
    quizHistory: [
      { id: '1', date: '2024-01-15', category: 'react', questionsCount: 10, score: 85, status: 'completed' },
      { id: '2', date: '2024-01-12', category: 'javascript', questionsCount: 8, score: 72, status: 'completed' },
      { id: '3', date: '2024-01-10', category: 'python', questionsCount: 12, score: 90, status: 'completed' },
      { id: '4', date: '2024-01-08', category: 'nextjs', questionsCount: 15, score: 65, status: 'in-progress' },
      { id: '5', date: '2024-01-05', category: 'typescript', questionsCount: 10, score: 88, status: 'completed' },
      { id: '6', date: '2024-01-03', category: 'react', questionsCount: 8, score: 94, status: 'completed' },
    ],
    categoryProgress: [
      { category: 'react', scores: [65, 70, 75, 80, 85, 94], dates: ['Dec', 'Jan'] },
      { category: 'javascript', scores: [60, 65, 68, 72, 72], dates: ['Dec', 'Jan'] },
      { category: 'python', scores: [70, 75, 82, 88, 90], dates: ['Dec', 'Jan'] },
      { category: 'nextjs', scores: [50, 55, 60, 65], dates: ['Dec', 'Jan'] },
    ]
  };

  // Dummy app analytics data
  const dummyAppAnalytics: AppAnalyticsData = {
    pathsCompleted: 8,
    totalLearningHours: 156,
    pathsInProgress: 4,
    averageCompletionRate: 78,
    pathsByDomain: [
      { domain: "Frontend", count: 3, color: "bg-blue-500", description: "UI/UX Development" },
      { domain: "Backend", count: 2, color: "bg-emerald-500", description: "Server-side Development" },
      { domain: "Full-Stack", count: 2, color: "bg-purple-500", description: "End-to-End Development" },
      { domain: "Data Science", count: 1, color: "bg-amber-500", description: "Data Analysis & ML" },
    ],
    recentActivity: [
      { 
        id: "1", 
        pathTitle: "React Full-Stack Mastery", 
        progress: 85, 
        lastActivity: "2 hours ago", 
        estimatedCompletion: "3 days",
        quizTrend: [65, 72, 80, 75, 85, 82, 88],
        domain: "Full-Stack"
      },
      { 
        id: "2", 
        pathTitle: "Python Data Analysis", 
        progress: 65, 
        lastActivity: "1 day ago", 
        estimatedCompletion: "1 week",
        quizTrend: [55, 60, 65, 68, 70, 72, 65],
        domain: "Data Science"
      },
      { 
        id: "3", 
        pathTitle: "Node.js Backend Development", 
        progress: 30, 
        lastActivity: "3 days ago", 
        estimatedCompletion: "2 weeks",
        quizTrend: [40, 45, 50, 55, 60, 58, 62],
        domain: "Backend"
      },
      { 
        id: "4", 
        pathTitle: "AWS Cloud Fundamentals", 
        progress: 45, 
        lastActivity: "Yesterday", 
        estimatedCompletion: "10 days",
        quizTrend: [35, 40, 45, 42, 50, 55, 53],
        domain: "Backend"
      },
    ],
    skillProgress: [
      { skill: "React", icon: <Code className="w-4 h-4" />, level: 85, target: 100, trend: 'up' },
      { skill: "TypeScript", icon: <Brain className="w-4 h-4" />, level: 70, target: 100, trend: 'up' },
      { skill: "Node.js", icon: <Cpu className="w-4 h-4" />, level: 60, target: 100, trend: 'stable' },
      { skill: "Python", icon: <Database className="w-4 h-4" />, level: 75, target: 100, trend: 'up' },
      { skill: "AWS", icon: <Cloud className="w-4 h-4" />, level: 45, target: 100, trend: 'down' },
    ],
  };

  useEffect(() => {
    // Use dummy data
    setAnalytics(dummyAnalytics)
    setAppAnalytics(dummyAppAnalytics)
    
    // Animate numbers after a short delay
    setTimeout(() => {
      if (dummyAnalytics && dummyAppAnalytics) {
        animateNumbers()
      }
    }, 300)
  }, [])

  useEffect(() => {
    if (analytics && appAnalytics && !loading) {
      animateNumbers()
    }
  }, [analytics, appAnalytics, loading])

  const animateNumbers = () => {
    if (!analytics || !appAnalytics) return

    const duration = 1000
    const steps = 60
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

  const handlePreview = (quizId: string) => {
    console.log("Preview quiz with id:", quizId);
  }

  const handleContinue = (quizId: string) => {
    console.log("Continue quiz with id:", quizId);
  }

  const renderLineGraph = (scores: number[], color: string) => {
    if (scores.length === 0) return null

    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    const range = maxScore - minScore || 1

    return (
      <div className="h-16 w-full">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <polyline
            points={scores.map((score, i) => {
              const x = scores.length === 1 ? 50 : (i / (scores.length - 1)) * 100
              const y = 40 - ((score - minScore) / range) * 35
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {scores.map((score, i) => {
            const x = scores.length === 1 ? 50 : (i / (scores.length - 1)) * 100
            const y = 40 - ((score - minScore) / range) * 35
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill={color}
              />
            )
          })}
        </svg>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start: {scores[0]}%</span>
          <span>Latest: {scores[scores.length - 1]}%</span>
        </div>
      </div>
    )
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#666" className="text-xs">
          {`${value} paths (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  if (!analytics || !appAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const categoryCount = analytics?.categoryDistribution.length || 0
  const dynamicColors = generateColors(categoryCount)

  const pieData = appAnalytics?.pathsByDomain.map((domain, index) => ({
    name: domain.domain,
    value: domain.count,
    color: dynamicColors[index],
    description: domain.description
  })) || []

  // Fixed Tooltip formatter for BarChart
  const tooltipFormatter = (value: number | undefined) => {
    if (value === undefined) return '0 hours'
    return `${value.toFixed(1)} hours`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Time Graph Icon */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Analytics</h1>
              <p className="text-gray-600 mt-1">Track your progress and performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Last updated: Today</span>
              </div>
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <LineChartIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white rounded-lg shadow-xl border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Weekly Learning Hours</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { day: "Mon", hours: 3.5 },
                        { day: "Tue", hours: 4.2 },
                        { day: "Wed", hours: 2.8 },
                        { day: "Thu", hours: 5.1 },
                        { day: "Fri", hours: 3.9 },
                        { day: "Sat", hours: 6.2 },
                        { day: "Sun", hours: 4.5 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="day" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} />
                        <Tooltip formatter={tooltipFormatter} />
                        <Bar dataKey="hours" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Total: 30.2 hours this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Combined Stats & Pie Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Side - Combined Learning & Quiz Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Overview</h3>
            <div className="space-y-4">
              {/* Path Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Paths Completed</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{animatedValues.pathsCompleted}</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Active Paths</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{animatedValues.pathsInProgress}</div>
                </div>
              </div>
              
              {/* Quiz Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-gray-600">Total Quizzes</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{animatedValues.totalQuizzes}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Avg. Score</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{animatedValues.averageScore.toFixed(1)}%</div>
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Highest Score</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{animatedValues.highestScore.toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-gray-600">Learning Hours</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{animatedValues.totalLearningHours.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Interactive Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Path Domain Distribution</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hidden sm:inline">Hover for details</span>
                <HelpCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              {appAnalytics.pathsByDomain.length ? (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="70%"
                        paddingAngle={2}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={dynamicColors[index]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => {
                          const description = props.payload?.description || '';
                          return [
                            <div key="tooltip">
                              <div className="font-medium">{name}: {value} paths</div>
                              {description && (
                                <div className="text-xs text-gray-500 mt-1">{description}</div>
                              )}
                            </div>
                          ];
                        }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <p>No domain data</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - At a Glance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">At a Glance</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Completion Rate</p>
                      <p className="text-xs text-gray-600">Across all paths</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{appAnalytics.averageCompletionRate}%</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Score Improvement</p>
                      <p className="text-xs text-gray-600">Last 30 days</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">+12.5%</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Active Days</p>
                      <p className="text-xs text-gray-600">Learning streak</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600">14</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Target className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Next Goal</p>
                      <p className="text-xs text-gray-600">Complete 10 paths</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-600">2 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tabbed Section: Quiz History / Skill Levels */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'quizHistory'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('quizHistory')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <History className="h-4 w-4" />
                    Quiz History
                  </div>
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'skillLevels'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('skillLevels')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="h-4 w-4" />
                    Skill Levels
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'quizHistory' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-600 font-medium text-sm">Date</th>
                        <th className="text-left py-2 text-gray-600 font-medium text-sm">Category</th>
                        <th className="text-left py-2 text-gray-600 font-medium text-sm">Questions</th>
                        <th className="text-left py-2 text-gray-600 font-medium text-sm">Score</th>
                        <th className="text-left py-2 text-gray-600 font-medium text-sm">Status</th>
                        <th className="text-left py-2 text-gray-600 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.quizHistory.map((quiz) => (
                        <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 text-gray-600 text-sm">{quiz.date}</td>
                          <td className="py-3">
                            <span className="font-medium text-gray-900 text-sm">{toTitleCase(quiz.category)}</span>
                          </td>
                          <td className="py-3 text-gray-600 text-sm">{quiz.questionsCount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${(quiz.score / (quiz.questionsCount * 10)) >= 80 ? 'bg-green-100 text-green-800' :
                              (quiz.score / (quiz.questionsCount * 10)) >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {Math.round((quiz.score / (quiz.questionsCount * 10)) * 100)}%
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${quiz.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {quiz.status === 'completed' ? 'Completed' : 'In Progress'}
                            </span>
                          </td>
                          <td className="py-3">
                            {quiz.status === 'completed' ? (
                              <button
                                onClick={() => handlePreview(quiz.id)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
                                Preview
                              </button>
                            ) : (
                              <button
                                onClick={() => handleContinue(quiz.id)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                              >
                                Continue
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4">
                  {appAnalytics.skillProgress.map((skill, index) => {
                    const levelLabels = [
                      { label: "Novice", threshold: 0 },
                      { label: "Learner", threshold: 40 },
                      { label: "Proficient", threshold: 70 },
                      { label: "Expert", threshold: 90 }
                    ]
                    
                    const currentLevel = levelLabels.reduce((acc, level, i) => {
                      if (skill.level >= level.threshold) return i
                      return acc
                    }, 0)
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {skill.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{skill.skill}</p>
                              <p className="text-xs text-gray-500">{levelLabels[currentLevel]?.label || "Beginner"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">{skill.level}%</span>
                            {skill.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500" />}
                            {skill.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                            {skill.trend === 'stable' && <div className="w-3 h-0.5 bg-gray-400"></div>}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Active Paths Progress with Quiz Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Paths</h3>
              <button 
                onClick={() => console.log("Navigate to learning space")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {appAnalytics.recentActivity.map((path) => {
                const isExpanded = expandedPath === path.id
                const latestScore = path.quizTrend[path.quizTrend.length - 1]
                const firstScore = path.quizTrend[0]
                const scoreChange = latestScore - firstScore
                const trendColor = scoreChange >= 0 ? '#10B981' : '#EF4444'
                
                return (
                  <div 
                    key={path.id} 
                    className="group relative"
                    onMouseEnter={() => setExpandedPath(path.id)}
                    onMouseLeave={() => setExpandedPath(null)}
                  >
                    <div className={`p-4 border rounded-lg transition-all duration-300 ${
                      isExpanded ? 'border-blue-300 bg-blue-50' : 'border-gray-200 group-hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {path.pathTitle}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {path.domain}
                            </span>
                            <span className="text-xs text-gray-500">{path.lastActivity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{path.progress}%</span>
                          {scoreChange !== 0 && (
                            <div className={`flex items-center gap-1 text-xs ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scoreChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                              {Math.abs(scoreChange)}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${path.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Est. completion: {path.estimatedCompletion}</span>
                      </div>

                      {/* Quiz Trend Graph - Shows on hover */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-500">Quiz Performance Trend</div>
                            <div className="text-xs text-gray-600">
                              Latest: <span className="font-medium">{latestScore}%</span>
                            </div>
                          </div>
                          {renderLineGraph(path.quizTrend, trendColor)}
                          <div className="mt-2 text-xs text-gray-500">
                            {path.quizTrend.length} quizzes attempted in this path
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {!appAnalytics.recentActivity.length && (
                <div className="text-center py-8 text-gray-500">
                  No active paths
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}