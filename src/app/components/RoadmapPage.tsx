"use client";

import { useState, useEffect } from "react";
import { useRoadmap } from "@/utils/hooks/useRoadmap";
import { useRouter, usePathname } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import RoadmapPath from "./RoadmapPath";
import PlanetNode from "./PlanetNode";
import SideDrawer from "./SideDrawer";
import { Topic } from "@/types/types";
import { Shell } from "@/utils/svgs/Shell";
import { Rocket, Sparkles } from "lucide-react";

/* ───────────────────────────────────────────────
   Page
   ─────────────────────────────────────────────── */
interface RoadmapPageProps {
  roadmapId: string;
  userId: string | null | undefined;
  onSubtopicOpen?: (topicOrder: number, subtopicOrder: number) => void;
}

export default function RoadmapPage({
  roadmapId,
  userId,
  onSubtopicOpen,
}: RoadmapPageProps) {
  /* ── data ── */
  const { roadmap, isLoading, error, markTopicDone } = useRoadmap(roadmapId, userId);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [tick, setTick] = useState(0);
  const { setQuizConfig } = useQuiz();

  const router = useRouter();
  const pathname = usePathname();

  const handleSubtopicOpen = (topicOrder: number, subtopicOrder: number) => {
    if (onSubtopicOpen) {
      onSubtopicOpen(topicOrder, subtopicOrder);
    } else {
      router.push(`${pathname}/topic/${topicOrder}/subtopic/${subtopicOrder}`);
    }
  };

  const onTakeQuiz = (topicOrder: number) => {
    const topic = safeRoadmap.topics.find(t => t.order === topicOrder);
    if (!topic) return;

    // Set quiz configuration in context
    setQuizConfig({
      pathId: roadmapId,
      userId: userId || '',
      stepId: topic.order.toString(),
      assessmentType: 'SKILL_CHECK',
      categoryTitle: topic.title,
    });

    // Navigate to quiz page
    router.push('/quiz');
  };

  /* star animation tick */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const safeRoadmap = roadmap ?? {
    _id: "",
    subject: "",
    userId: userId ?? "",
    topics: [],
    status: "not_started" as const,
    progressPercentage: 0,
    difficultyLevel: "",
    totalEstimatedDuration: "",
  };

  // Node Calculation
  const SPACING = 120; // Reduced spacing
  const START_Y = 150; // Increased padding to account for header
  const AMPLITUDE = 25; // How wide the zig-zag is (from center: 50 +/- 25)

  const nodes = safeRoadmap.topics.map((topic, index) => {
    // Sinusoidal Zig-Zag
    const x = 50 + Math.sin(index * Math.PI / 1.5) * AMPLITUDE;
    return {
      topic,
      x,
      y: START_Y + index * SPACING,
    };
  });

  const totalHeight = START_Y + nodes.length * SPACING + 200;

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <p className="text-cyan-400 font-mono text-sm animate-pulse">Initializing Navigation Systems...</p>
        </div>
      </div>
    )
  }

  /* ── error ── */
  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-bold">Signal Lost</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-cyan-400 hover:underline">
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  /* ── star field ── */
  const STARS = Array.from({ length: 150 }, (_, i) => ({
    x: (Math.sin(i * 132.5) * 0.5 + 0.5) * 100,
    y: (Math.cos(i * 41.3) * 0.5 + 0.5) * 100,
    size: 1 + (i % 3) * 1.5,
    opacity: 0.1 + (i % 5) * 0.15,
  }));

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Stars */}
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white transition-opacity duration-[3000ms]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity + (i % 7 === tick % 7 ? 0.4 : 0),
            }}
          />
        ))}

        {/* Nebulas */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto min-h-screen" style={{ height: totalHeight }}>
        <div className="sticky top-0 z-30 pt-6 pb-10 pointer-events-none">
          <div className="absolute"
            style={{ height: '180px' }} />

          <div className="absolute"
            style={{ height: '140px' }} />

          <div className="relative text-center pointer-events-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent leading-tight mx-auto max-w-3xl break-words">
              {roadmap.subject.toUpperCase()}
            </h1>

            {/* Optional: Progress indicator */}
            <div className="mt-3 flex items-center justify-center gap-2 text-cyan-400/80 text-sm">
              <Rocket className="w-4 h-4" />
              <span>{safeRoadmap.progressPercentage}% Complete</span>
            </div>
          </div>
        </div>

        {/* The Path */}
        <div className="absolute inset-0 top-[0px]">
          {/* Offset logic is inside the path/node coords */}
          <RoadmapPath
            points={nodes.map(n => ({ x: n.x, y: n.y }))}
            height={totalHeight}
          />
        </div>

        {/* Nodes */}
        <div className="absolute inset-0 top-[0px]">
          {nodes.map((node, i) => (
            <PlanetNode
              key={node.topic._id || i}
              topic={node.topic}
              index={i}
              x={node.x}
              y={node.y}
              isSelected={selectedTopic === node.topic}
              isLocked={i > 0 && !safeRoadmap.topics[i - 1].isCompleted && !node.topic.isCompleted}
              onClick={() => setSelectedTopic(node.topic)}
            />
          ))}
        </div>
      </div>

      {/* Side Drawer */}
      <SideDrawer
        topic={selectedTopic}
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onSubtopicClick={handleSubtopicOpen}
        onTakeQuiz={() => {
          if (selectedTopic) {
            if (onTakeQuiz) {
              onTakeQuiz(selectedTopic.order);
            } else {
              // Default behavior if no prop passed: mark done immediately (simulated quiz pass)
              markTopicDone(selectedTopic.order, true);
              setSelectedTopic(null); // Close drawer after action
            }
          }
        }}
      />
    </div>
  );
}