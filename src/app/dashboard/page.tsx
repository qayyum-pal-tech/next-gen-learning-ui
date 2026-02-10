
'use client';

import { useState, useEffect } from 'react';
import TopicCard from "@/app/components/TopicCard";
import { ArrowRight, Sparkles, GraduationCap, Rocket, Brain, BookOpen, Loader2 } from 'lucide-react';
import PathCreationModal from "@/app/components/PathCreationModal";
import QuizAssessmentModal from "@/app/components/QuizAssessmentModal";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { useAuthStore } from "@/store/auth.store";
import { createRoadmap } from '@/utils/apis/roadmapApi';

interface TopicCategory {
  id: number;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  borderColor: string;
}

export default function HomePage() {
  const router = useRouter();
  const { setQuizConfig } = useQuiz();
  const [topic, setTopic] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { user } = useAuthStore();
  const USER_ID = user?._id || user?.id;

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (topic.trim().length > 1) {
        setIsLoadingSuggestions(true);
        setShowSuggestions(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/suggestions?query=${encodeURIComponent(topic)}`, {
            headers: {
              'Accept': 'application/json'
            }
          });

          if (!res.ok) {
            throw new Error('Failed to fetch suggestions');
          }

          const data = await res.json();
          setSuggestions(data.suggestions || data || []);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [topic]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [modalType, setModalType] = useState<'pathCreation' | 'quizAssessment'>('pathCreation');
  const [customizationData, setCustomizationData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const openModal = (title: string) => {
    setTimeout(() => {
      setIsModalOpen(true);
      setCourseTitle(title);
      setModalType('pathCreation');
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (topic.trim()) {
      setIsSubmitted(true);

      openModal(topic);

      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleTopicCardClick = (title: string) => {
    openModal(title);
  };

  const topicCategories: TopicCategory[] = [
    {
      id: 1,
      title: 'React Development',
      icon: <Rocket className="w-9 h-9 text-white" />,
      gradient: 'from-blue-500 to-cyan-400',
      description: 'Master React',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#60a5fa',
      borderColor: '#3b82f6'
    },
    {
      id: 2,
      title: 'Python Programming',
      icon: <Brain className="w-9 h-9 text-white" />,
      gradient: 'from-emerald-500 to-green-400',
      description: 'Code Smart',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#34d399',
      borderColor: '#10b981'
    },
    {
      id: 3,
      title: 'Web Design',
      icon: <BookOpen className="w-9 h-9 text-white" />,
      gradient: 'from-purple-500 to-fuchsia-400',
      description: 'Create Beautiful',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#c084fc',
      borderColor: '#a855f7'
    },
    {
      id: 4,
      title: 'Data Science',
      icon: <GraduationCap className="w-9 h-9 text-white" />,
      gradient: 'from-amber-500 to-orange-400',
      description: 'Analyze Data',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#fbbf24',
      borderColor: '#f59e0b'
    },
    {
      id: 5,
      title: 'JavaScript',
      icon: <Sparkles className="w-9 h-9 text-white" />,
      gradient: 'from-yellow-500 to-amber-400',
      description: 'Full Stack',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#facc15',
      borderColor: '#eab308'
    },
    {
      id: 6,
      title: 'Next.js',
      icon: <Rocket className="w-9 h-9 text-white" />,
      gradient: 'from-indigo-500 to-violet-400',
      description: 'Modern Web',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#a78bfa',
      borderColor: '#8b5cf6'
    },
    {
      id: 7,
      title: 'TypeScript',
      icon: <Brain className="w-9 h-9 text-white" />,
      gradient: 'from-cyan-500 to-sky-400',
      description: 'Type Safe',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#5eead4',
      borderColor: '#06b6d4'
    },
    {
      id: 8,
      title: 'UI/UX Design',
      icon: <BookOpen className="w-9 h-9 text-white" />,
      gradient: 'from-pink-500 to-rose-400',
      description: 'Design Pro',
      bgColor: '#1e293b',
      hoverBgColor: '#1a2233',
      textColor: '#fda4af',
      borderColor: '#f43f5e'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delay"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float-reverse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <header className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up animation-delay-100">
            Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Learning Journey</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Generate personalized, comprehensive video courses on any topic with our AI-powered platform
          </p>
        </header>

        <section className="max-w-3xl mx-auto mb-24 animate-fade-in-up animation-delay-300">
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="relative bg-gray-800 rounded-3xl shadow-2xl border border-gray-700"
              aria-label="Course generation form"
            >
              <div className="p-6 md:p-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onFocus={() => {
                      setIsFocused(true);
                      if (topic.length > 1) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder="What would you like to learn today?"
                    className="w-full pl-12 pr-40 py-4 text-lg rounded-2xl border-2 border-gray-700 bg-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 placeholder-gray-500 font-medium text-white"
                    aria-label="Course topic input"
                  />

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                    <button
                      type="submit"
                      disabled={!topic.trim()}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${topic.trim()
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg hover:shadow-2xl hover:shadow-indigo-500/50'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      aria-label="Generate course"
                    >
                      <span>Generate</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {showSuggestions && (isLoadingSuggestions || suggestions.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                {isLoadingSuggestions ? (
                  <div className="p-4 flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-sm">Finding topics...</span>
                  </div>
                ) : (
                  <div className="py-2">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="w-full text-left px-6 py-3 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3 group cursor-pointer relative"
                        onMouseDown={(e) => {
                          if (!(e.target as HTMLElement).closest('.arrow-button')) {
                            e.preventDefault();
                            setTimeout(() => {
                              openModal(suggestion);
                            }, 150);
                          }
                        }}
                      >
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="font-medium flex-1">{suggestion}</span>

                        <button
                          type="button"
                          className="arrow-button p-1.5 rounded-lg hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTopic(suggestion);
                            setShowSuggestions(false);
                          }}
                          title="Fill input"
                        >
                          <svg className="w-4 h-4 text-gray-400 hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isSubmitted && (
              <div
                className="mt-6 text-center text-indigo-400 font-medium flex items-center justify-center gap-3 animate-fade-in"
                role="status"
                aria-live="polite"
              >
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Creating your personalized learning path...</span>
              </div>
            )}
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up animation-delay-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/70 to-indigo-900/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-blue-800/50 hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-blue-300">AI-Powered</h3>
              <p className="text-gray-400 text-sm">Smart content generation</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/70 to-emerald-900/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-800/50 hover:border-green-600 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-green-300">Comprehensive</h3>
              <p className="text-gray-400 text-sm">Complete learning paths</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/70 to-pink-900/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-purple-800/50 hover:border-purple-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-purple-300">Engaging</h3>
              <p className="text-gray-400 text-sm">Interactive content</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="popular-topics" className="animate-fade-in-up animation-delay-500">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Popular Learning Paths</h2>
            <p className="text-gray-400">Explore trending topics and skill sets</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {topicCategories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleTopicCardClick(category.title)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
              >
                <TopicCard
                  title={category.title}
                  icon={category.icon}
                  gradient={category.gradient}
                  description={category.description}
                  delay={index * 100}
                  bgColor={category.bgColor}
                  hoverBgColor={category.hoverBgColor}
                  textColor={category.textColor}
                  borderColor={category.borderColor}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mt-32 text-center animate-fade-in-up animation-delay-600">
          <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm rounded-3xl p-12 border border-indigo-800/50 shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl mb-6 mx-auto shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Learning?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their skills with our AI-powered courses
            </p>
            <button
              onClick={() => document.querySelector('input')?.focus()}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
              aria-label="Start creating your course"
            >
              Create Your First Course
            </button>
          </div>
        </section>
      </div>

      <PathCreationModal
        courseTitle={courseTitle}
        isOpen={isModalOpen && modalType === 'pathCreation'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          setCustomizationData(data);
          setModalType('quizAssessment');
        }}
      />
      <QuizAssessmentModal
        isOpen={isModalOpen && modalType === 'quizAssessment'}
        onClose={() => setIsModalOpen(false)}
        onTakeQuiz={() => {
          console.log("quiz starting",courseTitle,USER_ID)
          setQuizConfig({
            pathId: 'learning-path-default',
            userId: USER_ID,
            assessmentType: 'PRE_ASSESSMENT',
            courseTitle: courseTitle,
            customizationData: customizationData,
          });
          router.push('/quiz');
          setIsModalOpen(false);
        }}
        onSkipQuiz={async () => {
          if (!USER_ID) return;

          setIsGenerating(true);
          try {
            const newRoadmap = await createRoadmap({
              subject: courseTitle,
              userId: USER_ID,
              difficultyLevel: customizationData?.depth?.toLowerCase(),
              additionalContext: `Goal: ${customizationData?.goal}, Time: ${customizationData?.duration}h, Pace: ${customizationData?.speed}`
            });

            router.push(`/roadmap/${newRoadmap.id}`);
          } catch (err) {
            console.error("Failed to generate roadmap:", err);
            alert("Failed to generate roadmap. Please try again.");
          } finally {
            setIsGenerating(false);
            setIsModalOpen(false);
          }
        }}
        onBack={() => setModalType('pathCreation')}
      />

      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-xl font-bold text-white">Synthesizing Your Learning Path...</p>
            <p className="text-gray-400">Our AI is mapping out your journey based on your goals.</p>
          </div>
        </div>
      )}
    </div>
  );
}














