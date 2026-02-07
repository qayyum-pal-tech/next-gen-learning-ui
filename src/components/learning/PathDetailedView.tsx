"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Lock,
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

// --- Types ---
export interface SubTopic {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  type: "subtopic";
}

export interface PathNode {
  type: "topic" | "quiz";
  id: string; 
  order: number;
  title: string;
  description: string;
  estimatedDuration?: string;
  isCompleted: boolean;
  points: number;
  score?: number | null;
  subtopics?: SubTopic[];
}

export interface PathData {
  _id: string;
  subject: string;
  status: "not_started" | "in_progress" | "completed";
  difficultyLevel: string;
  topics: PathNode[];
  progressPercentage: number;
}

// --- Dummy Data ---
const MOCK_PATH_DATA: PathData = {
  _id: "path_nodejs_mastery_001",
  subject: "Node.js Mastery",
  status: "in_progress",
  difficultyLevel: "Intermediate",
  progressPercentage: 75,
  topics: [
    {
      type: "topic",
      id: "t1",
      order: 1,
      title: "Node.js Architecture",
      description: "Understanding the V8 engine, Libuv, and the event-driven non-blocking I/O model.",
      isCompleted: true,
      points: 50,
      subtopics: [
         { id: "s1-1", title: "V8 Engine", description: "How Google's engine compiles JavaScript into machine code.", isCompleted: true, type: "subtopic" },
         { id: "s1-2", title: "Libuv Library", description: "The C library that handles the event loop and thread pool.", isCompleted: true, type: "subtopic" },
         { id: "s1-3", title: "Event Loop Phases", description: "Timers, I/O callbacks, idle, poll, check, and close callbacks.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t2",
      order: 2,
      title: "Modules and Packages",
      description: "Working with CommonJS, ES Modules, and the npm ecosystem.",
      isCompleted: true,
      points: 40,
      subtopics: [
         { id: "s2-1", title: "CommonJS vs ESM", description: "Comparing require/exports with import/export syntax.", isCompleted: true, type: "subtopic" },
         { id: "s2-2", title: "Semantic Versioning", description: "Understanding semver: major.minor.patch versioning rules.", isCompleted: true, type: "subtopic" },
         { id: "s2-3", title: "npm Scripts", description: "Automating tasks with custom scripts in package.json.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t3",
      order: 3,
      title: "Async Fundamentals",
      description: "Mastering callbacks, promises, and the async/await pattern for efficient code.",
      isCompleted: true,
      points: 50,
      subtopics: [
         { id: "s3-1", title: "Callback Patterns", description: "The error-first callback convention used in many Node.js APIs.", isCompleted: true, type: "subtopic" },
         { id: "s3-2", title: "Promise API", description: "Wrapping legacy code into promises and using Promise.all/allSettled.", isCompleted: true, type: "subtopic" },
         { id: "s3-3", title: "Async/Await Best Practices", description: "Avoiding common pitfalls like unhandled rejections and try/catch blocks.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t4",
      order: 4,
      title: "Data Handling & Buffers",
      description: "Reading and writing binary data using Buffer and Stream APIs.",
      isCompleted: true,
      points: 40,
      subtopics: [
         { id: "s4-1", title: "Buffer Class", description: "Handling raw binary data outside the V8 heap memory.", isCompleted: true, type: "subtopic" },
         { id: "s4-2", title: "Piping Streams", description: "Connecting read and write streams for memory-efficient data transfer.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "quiz",
      id: "q1",
      order: 5,
      title: "Checkpoint: Core APIs",
      description: "Assessment covering architecture, modules, and data handling fundamentals.",
      isCompleted: true,
      points: 100,
      score: 95,
      subtopics: [
          { id: "s5-1", title: "Review Core Concepts", description: "Quick recap of Event Loop and Buffer basics.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t5",
      order: 6,
      title: "Express.js Mastery",
      description: "Building robust RESTful APIs using the Express framework and middleware.",
      isCompleted: true,
      points: 60,
      subtopics: [
         { id: "s6-1", title: "Routing Logic", description: "Organizing complex URL patterns and parameter handling.", isCompleted: true, type: "subtopic" },
         { id: "s6-2", title: "Custom Middleware", description: "Intercepting requests for logging, auth, and data validation.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t6",
      order: 7,
      title: "Security & Auth",
      description: "Implementing JWT, session management, and protecting against common vulnerabilities.",
      isCompleted: true,
      points: 70,
      subtopics: [
         { id: "s7-1", title: "JWT Strategy", description: "Stateless authentication using JSON Web Tokens and refresh tokens.", isCompleted: true, type: "subtopic" },
         { id: "s7-2", title: "Helmet & CORS", description: "Setting secure HTTP headers and managing cross-origin requests.", isCompleted: true, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t7",
      order: 8,
      title: "Advanced Database Patterns",
      description: "Scalable data modeling with MongoDB, indexing, and aggregation pipelines.",
      isCompleted: false, // Progress starts here
      points: 80,
      subtopics: [
         { id: "s8-1", title: "Aggregation Framework", description: "Processing data deeply on the server side using the pipeline operator.", isCompleted: false, type: "subtopic" },
         { id: "s8-2", title: "Schema Optimization", description: "Designing schemas for high-performance reads and writes.", isCompleted: false, type: "subtopic" },
      ]
    },
    {
      type: "topic",
      id: "t7_duplicate", // Fixed ID collision if any
      order: 9,
      title: "Performance & Scaling",
      description: "Monitoring, profiling, and scaling Node.js applications using Clustering and PM2.",
      isCompleted: false,
      points: 90,
      subtopics: [
         { id: "s9-1", title: "Clustering Protocol", description: "Utilizing multiple CPUs by creating child processes.", isCompleted: false, type: "subtopic" },
         { id: "s9-2", title: "Memory Leak Analysis", description: "Using heap dumps to identify and fix memory retention issues.", isCompleted: false, type: "subtopic" },
      ]
    },
    {
      type: "quiz",
      id: "q2",
      order: 10,
      title: "Full-Stack Node.js Finale",
      description: "Final comprehensive assessment covering databases, security, and scaling.",
      isCompleted: false,
      points: 250,
      score: null,
      subtopics: [
          { id: "s10-1", title: "Final Review", description: "Comprehensive wrap-up of all professional practices learned.", isCompleted: false, type: "subtopic" },
      ]
    },
  ],
};

const PathDetailedView = ({ 
  pathData: initialPathData = MOCK_PATH_DATA, 
  activeStepId: initialActiveStepId = "t7" 
}: { 
  pathData?: PathData, 
  activeStepId?: string 
}) => {
  const router = useRouter();
  const [activeStepId, setActiveStepId] = useState<string>(initialActiveStepId);
  const [pathData] = useState<PathData>(initialPathData);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Toggle expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Flatten the node tree
  const flattenedNodes = useMemo(() => {
    const list: (PathNode | (SubTopic & { parentId: string; isHidden: boolean }))[] = [];
    
    pathData.topics.forEach((node) => {
      list.push(node);
      
      if (node.subtopics) {
        const isParentExpanded = expandedNodes.has(node.id);
        node.subtopics.forEach((sub) => {
          list.push({ 
              ...sub, 
              parentId: node.id,
              isHidden: !isParentExpanded 
          });
        });
      }
    });
    return list;
  }, [pathData, expandedNodes]);

  // Scroll to active step on mount
  useEffect(() => {
    if (activeNodeRef.current) {
        setTimeout(() => {
            activeNodeRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 100)
    }
  }, []);

  // --- Map Generation Config ---
  const SVG_WIDTH = 800;
  const STEP_HEIGHT = 150; 
  const AMPLITUDE = 240; 
  const CENTER_X = SVG_WIDTH / 2;

  // Calculate coordinates
  let currentVisualIndex = 0;
  let currentY = 100;
  
  let lastValidX = CENTER_X;
  let lastValidY = 100;
  let lastValidSide = "right";

  const visibleNodesWithPos = flattenedNodes.map((node, index) => {
     const isHidden = 'isHidden' in node && node.isHidden;
     const isSubtopic = 'type' in node && node.type === 'subtopic';

     let stepLabel = "";
     if (!isSubtopic) {
         stepLabel = String((node as PathNode).order);
     } else {
         const parent = pathData.topics.find(t => t.id === (node as any).parentId);
         if (parent) {
             const subIndex = parent.subtopics?.findIndex(s => s.id === node.id) ?? 0;
             stepLabel = `${parent.order}.${subIndex + 1}`;
         }
     }
     
     let x, y, side;

     if (!isHidden) {
         x = CENTER_X + Math.sin(currentVisualIndex * 2.5) * AMPLITUDE;
         y = currentY;
         side = x > CENTER_X ? "left" : "right";
         
         lastValidX = x;
         lastValidY = y;
         lastValidSide = side; 
         
         currentVisualIndex++;
         currentY += STEP_HEIGHT;
     } else {
         x = lastValidX;
         y = lastValidY;
         side = lastValidSide;
     }

    return { ...node, x, y, side, index, stepLabel }; 
  });

  const generatePathString = () => {
    if (visibleNodesWithPos.length === 0) return "";
    let path = `M ${visibleNodesWithPos[0].x} ${visibleNodesWithPos[0].y}`;
    
    for (let i = 0; i < visibleNodesWithPos.length - 1; i++) {
        const current = visibleNodesWithPos[i];
        const next = visibleNodesWithPos[i+1];
        
        const distY = next.y - current.y;
        const cpOffset = distY * 0.5;

        const cp1x = current.x;
        const cp1y = current.y + cpOffset;
        const cp2x = next.x;
        const cp2y = next.y - cpOffset;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  return (
    <div className="relative overflow-hidden text-slate-200 font-sans">
      
      {/* Dynamic Background - now absolute to contain within component flow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Base Layer */}
          <div className="absolute inset-0 bg-slate-950" />
          
          {/* Animated Mesh Gradients (Nebula Effect) */}
          <div 
             className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] overflow-hidden opacity-40 transition-transform duration-300 ease-out"
             style={{ 
                 transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` 
             }}
          >
              <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[120px] animate-[pulse_8s_infinite]" />
              <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px] animate-[pulse_12s_infinite_1s]" />
              <div className="absolute bottom-[20%] left-[15%] w-[450px] h-[450px] bg-blue-600/25 rounded-full blur-[130px] animate-[pulse_10s_infinite_2s]" />
              <div className="absolute bottom-[10%] right-[30%] w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-[110px] animate-[pulse_15s_infinite_0.5s]" />
          </div>

          {/* Noise/Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <filter id="noiseFilter">
                      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noiseFilter)" />
              </svg>
          </div>

          {/* Enhanced Grid with Radial Mask */}
          <div 
             className="absolute inset-0 opacity-[0.05] transition-transform duration-500 ease-out" 
             style={{ 
                backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', 
                backgroundSize: '80px 80px',
                maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`
             }} 
          />

          {/* Floating Particles (Space Dust) */}
          <div 
             className="absolute inset-0 transition-transform duration-200 ease-out"
             style={{ 
                 transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` 
             }}
          >
            {[...Array(100)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute rounded-full bg-white animate-float"
                    style={{
                        width: Math.random() * 4 + 1 + 'px',
                        height: Math.random() * 4 + 1 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                        opacity: Math.random() * 0.4 + 0.2,
                        boxShadow: Math.random() > 0.8 ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
                        animationDelay: Math.random() * 10 + 's',
                        animationDuration: Math.random() * 10 + 10 + 's'
                    }}
                />
            ))}
          </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
          50% { transform: translateY(-40px) translateX(20px); opacity: 0.3; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center pb-32 pt-10">
        
        <div className="fixed top-6 left-6 z-50">
           <Button 
             variant="ghost" 
             size="icon" 
             className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full"
             onClick={() => router.back()}
           >
             <ChevronLeft className="w-6 h-6" />
           </Button>
        </div>

        {/* Path Container */}
        <div 
            className="relative transition-all duration-700 ease-in-out" 
            style={{ width: SVG_WIDTH, height: currentY + 200 }}
        >
             
             {/* SVG Path */}
             <svg 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
            >
                <path 
                    d={generatePathString()} 
                    stroke="url(#pathGradient)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-700 ease-in-out"
                    style={{ transitionProperty: 'd' }}
                />
                
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#334155" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
             </svg>

             {/* Nodes */}
             {visibleNodesWithPos.map((node, i) => {
                 const isSubtopic = 'type' in node && node.type === 'subtopic';
                 const isHidden = 'isHidden' in node && node.isHidden;
                 const isMainNode = !isSubtopic;
                 const mainNode = isMainNode ? (node as PathNode) : null;
                 const subtopicNode = isSubtopic ? (node as SubTopic) : null;
                 
                 const isActive = node.id === activeStepId;
                 const isCompleted = node.isCompleted;
                 const isLocked = !isCompleted && !isActive;

                 const size = isSubtopic ? 40 : 56;
                 
                 const textStyles = node.side === 'right' 
                    ? { left: size + 24, textAlign: 'left' as const, alignItems: 'flex-start' }
                    : { right: size + 24, textAlign: 'right' as const, alignItems: 'flex-end' };

                 const borderClass = node.side === 'right' ? "border-l-2 pl-4" : "border-r-2 pr-4";

                 return (
                     <div 
                        key={node.id} 
                        className={cn(
                            "absolute flex items-center justify-center transition-all duration-700 ease-in-out group",
                            isHidden ? "opacity-0 pointer-events-none scale-50" : "opacity-100 scale-100"
                        )}
                        style={{ 
                            left: node.x, 
                            top: node.y,
                            width: 0, 
                            height: 0,
                            zIndex: isHidden ? 0 : 20
                        }}
                        ref={isActive ? activeNodeRef : null}
                     >
                         {/* 1. HOVER NUMBER INDICATOR */}
                        <div 
                           className={cn(
                               "absolute z-40 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center",
                               isActive ? "group-hover:-translate-y-8" : "group-hover:-translate-y-2"
                           )}
                           style={{
                               top: isActive ? -120 : -60, 
                               left: '50%',
                               transform: 'translateX(-50%)' 
                           }}
                        >
                            <div className="animate-bounce flex items-center justify-center bg-slate-800 border border-slate-700 text-white font-bold rounded-full shadow-xl px-3 py-1 text-sm whitespace-nowrap min-w-[32px]">
                                {node.stepLabel}
                            </div>
                        </div>


                        {/* 2. THE NODE ITSELF */}
                        <div 
                           className={cn(
                             "relative flex items-center justify-center rounded-full transition-all duration-300 z-20 border-2 aspect-square shrink-0 cursor-pointer hover:scale-110",
                             isSubtopic 
                                ? "bg-slate-900 border-slate-700 text-slate-400" 
                                : isLocked 
                                    ? "bg-slate-900 border-slate-700 text-slate-600" 
                                    : isActive 
                                        ? "bg-slate-950 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110" 
                                        : isCompleted && mainNode?.type === 'quiz'
                                            ? "bg-slate-900 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                            : "bg-slate-900 border-emerald-500 text-emerald-500"
                           )}
                           style={{
                               width: size,
                               height: size,
                               minWidth: size,
                               minHeight: size,
                               left: -size / 2,
                               top: -size / 2,
                           }}
                           onClick={() => isMainNode && toggleNode(node.id)}
                        >
                            {/* Inner Icon */}
                            {isCompleted ? (
                                isMainNode && mainNode?.type === 'quiz' ? (
                                    <Award className={cn("w-full h-full p-2.5", isSubtopic && "p-2")} />
                                ) : (
                                    <Check className={cn("w-full h-full p-2.5", isSubtopic && "p-2")} />
                                )
                            ) : isLocked ? (
                                isMainNode && mainNode?.type === 'quiz' ? (
                                    <HelpCircle className={cn("w-full h-full p-3", isSubtopic && "p-2.5")} />
                                ) : (
                                    <Lock className={cn("w-full h-full p-3", isSubtopic && "p-2.5")} />
                                )
                            ) : (
                                <div className="flex items-center justify-center w-full h-full rounded-full bg-indigo-500/10">
                                   {isMainNode && mainNode?.type === 'quiz' ? (
                                       <HelpCircle className={cn("fill-current", isSubtopic ? "w-3 h-3" : "w-5 h-5")} />
                                   ) : (
                                       <Play className={cn("fill-current", isSubtopic ? "w-3 h-3" : "w-5 h-5")} />
                                   )}
                                </div>
                            )}

                             {/* Pulse Ring */}
                            {isActive && (
                                <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20 aspect-square"></span>
                            )}
                        </div>

                        {/* 3. AVATAR (Floating marker) */}
                        {isActive && (
                            <div className="absolute z-30 opacity-100 transition-opacity duration-300 pointer-events-none" style={{ top: isSubtopic ? -50 : -70 }}>
                                <div className="animate-bounce">
                                    <Avatar className={cn(
                                        "border-2 border-slate-950 ring-2 ring-indigo-500 shadow-xl aspect-square shrink-0",
                                        isSubtopic ? "w-10 h-10" : "w-12 h-12"
                                    )}>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>ME</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        )}

                        {/* 4. TEXT LABEL */}
                        <div 
                           className={cn(
                               "absolute w-72 flex flex-col justify-center top-0 -translate-y-1/2 pointer-events-none transition-all duration-300",
                               isLocked ? "opacity-50" : "opacity-100"
                           )}
                           style={textStyles}
                        >
                             <div className={cn(
                                 "pointer-events-auto border-indigo-500/30 transition-colors duration-300 group-hover:border-indigo-500",
                                 borderClass
                             )}>
                                <h3 className={cn(
                                    "font-semibold leading-tight transition-colors flex items-center gap-2",
                                    isActive ? "text-indigo-400" : "text-slate-200 group-hover:text-white",
                                    isSubtopic ? "text-sm" : "text-base",
                                    node.side === 'right' ? "justify-start" : "justify-end"
                                )}
                                    onClick={() => isMainNode && toggleNode(node.id)}
                                >
                                    {node.title} 
                                    {isMainNode && mainNode?.subtopics && mainNode.subtopics.length > 0 && (
                                        <span className="text-slate-500 hover:text-white cursor-pointer p-0.5 rounded-full hover:bg-slate-800 transition-colors">
                                            {expandedNodes.has(node.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </span>
                                    )}
                                </h3>
                                
                                {isMainNode && mainNode?.estimatedDuration && (
                                    <div className={cn("mt-1 px-1 flex", node.side === 'right' ? "justify-start" : "justify-end")}>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {mainNode.estimatedDuration}
                                        </span>
                                    </div>
                                )}

                                <p className={cn(
                                    "mt-2 text-slate-400 leading-relaxed block px-1",
                                    isSubtopic ? "text-xs italic" : "text-sm",
                                    node.side === 'right' ? "text-left" : "text-right"
                                )}>
                                    {isSubtopic ? subtopicNode?.description : mainNode?.description}
                                </p>
                             </div>
                        </div>

                     </div>
                 );
             })}
        </div>
      </div>
    </div>
  );
};

export default PathDetailedView;
