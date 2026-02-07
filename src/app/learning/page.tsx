"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Clock, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_PATHS = [
  {
    id: "path_nodejs_mastery_001",
    title: "Node.js Mastery",
    description: "Master the event-driven, non-blocking I/O model and build scalable network applications.",
    level: "Intermediate",
    duration: "12h 30m",
    progress: 75,
    color: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-500",
    borderColor: "group-hover:border-emerald-500/50"
  },
  {
    id: "path_react_pro_002",
    title: "React Architecture",
    description: "Deep dive into design patterns, performance optimization, and custom hooks.",
    level: "Advanced",
    duration: "15h 45m",
    progress: 30,
    color: "from-blue-500/20 to-blue-500/5",
    accent: "text-blue-500",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    id: "path_typescript_003",
    title: "TypeScript Deep Dive",
    description: "Leverage the full power of static typing to build robust and maintainable apps.",
    level: "Beginner",
    duration: "8h 20m",
    progress: 0,
    color: "from-indigo-500/20 to-indigo-500/5",
    accent: "text-indigo-500",
    borderColor: "group-hover:border-indigo-500/50"
  }
];

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2 text-white">Learning Paths</h1>
          <p className="text-slate-400">Select a path to continue your journey.</p>
        </header>

        <div className="space-y-4">
          {ALL_PATHS.map((path) => (
            <Link 
              key={path.id} 
              href={`/learning/${path.id}`}
              className="block group"
            >
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl hover:bg-slate-900/60 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {path.title}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{path.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{path.level}</span>
                    <div className="text-xs text-indigo-500 mt-1 font-bold">{path.progress}% Complete</div>
                  </div>
                </div>
                
                {/* Minimal Progress Bar */}
                <div className="h-1 w-full bg-slate-800 rounded-full mt-3">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
