"use client";

import { Topic } from "@/types/types";
import { Lock, Check } from "lucide-react";
import { motion } from "framer-motion";

interface PlanetNodeProps {
    topic: Topic;
    index: number;
    isSelected: boolean;
    isLocked: boolean;
    onClick: () => void;
    x: number; // percentage (0-100)
    y: number; // absolute pixels from top
}

export default function PlanetNode({
    topic,
    index,
    isSelected,
    isLocked,
    onClick,
    x,
    y,
}: PlanetNodeProps) {
    const completedSubtopics = topic.subtopics.filter((s) => s.isCompleted).length;
    const totalSubtopics = topic.subtopics.length;
    const progress = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;

    // Visual params
    const size = isSelected ? 90 : 80;
    const glowColor = topic.isCompleted ? "#10b981" : isSelected ? "#a855f7" : "#06b6d4";

    return (
        <motion.div
            className="absolute flex flex-col items-center"
            style={{
                left: `${x}%`,
                top: y,
                transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <div
                className={`relative group ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !isLocked && onClick()}
            >
                {/* Planet Orb */}
                <motion.div
                    className={`
            relative rounded-full flex items-center justify-center border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]
            transition-all duration-500
            ${isLocked ? "bg-gray-800 border-gray-700" : "bg-black"}
          `}
                    style={{
                        width: size,
                        height: size,
                        borderColor: isLocked ? "#374151" : glowColor,
                        boxShadow: isSelected || topic.isCompleted ? `0 0 20px ${glowColor}40` : "none"
                    }}
                    whileHover={{ scale: 1.1 }}
                >
                    {/* Inner Content */}
                    {isLocked ? (
                        <Lock className="w-6 h-6 text-gray-500" />
                    ) : topic.isCompleted ? (
                        <Check className="w-8 h-8 text-emerald-400" />
                    ) : (
                        <span className="text-xl font-bold text-white">{index + 1}</span>
                    )}

                    {/* Progress Ring (SVG) */}
                    {!isLocked && !topic.isCompleted && (
                        <svg className="absolute inset-0 -rotate-90 w-full h-full p-1">
                            <circle
                                cx="50%" cy="50%" r="46%"
                                fill="none"
                                stroke="#ffffff20"
                                strokeWidth="3"
                            />
                            <circle
                                cx="50%" cy="50%" r="46%"
                                fill="none"
                                stroke={glowColor}
                                strokeWidth="3"
                                strokeDasharray={`${progress * 2.8} 280`} // approx circ
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </motion.div>

                {/* Label (Always Visible) */}
                <motion.div
                    className={`
                    absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 text-center p-2 rounded-lg
                    backdrop-blur-md border border-white/30 bg-black/40
                    ${isSelected ? "border-cyan-500/50" : ""}
                `}
                    transition={{ duration: 0.2 }}
                >
                    <h3 className={`text-sm font-bold mb-1 ${isLocked ? "text-gray-500" : "text-white"}`}>{topic.title}</h3>
                    <p className="text-xs text-gray-400">{completedSubtopics}/{totalSubtopics} Modules</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
