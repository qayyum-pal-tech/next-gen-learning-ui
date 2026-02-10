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
    x: number; 
    y: number; 
    memberIcons?: { username: string; userId: string }[];
    hideProgress?: boolean;
}

export default function PlanetNode({
    topic,
    index,
    isSelected,
    isLocked,
    onClick,
    x,
    y,
    memberIcons = [],
    hideProgress = false,
}: PlanetNodeProps) {
    const completedSubtopics = topic.subtopics.filter((s) => s.isCompleted).length;
    const totalSubtopics = topic.subtopics.length;
    const progress = totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;

    const size = isSelected ? 90 : 80;
    const isTopicCompleted = !hideProgress && topic.isCompleted;
    const glowColor = isTopicCompleted ? "#10b981" : isSelected ? "#a855f7" : "#06b6d4";

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
                        boxShadow: isSelected || isTopicCompleted ? `0 0 20px ${glowColor}40` : "none"
                    }}
                    whileHover={{ scale: 1.1 }}
                >
                    {isLocked ? (
                        <Lock className="w-6 h-6 text-gray-500" />
                    ) : isTopicCompleted ? (
                        <Check className="w-8 h-8 text-emerald-400" />
                    ) : (
                        <span className="text-xl font-bold text-white">{index + 1}</span>
                    )}

                    {memberIcons.length > 0 && (
                        <div className="absolute inset-x-0 -top-6 flex justify-center -space-x-2">
                            {memberIcons.map((member, i) => (
                                <motion.div
                                    key={`${member.userId}-${i}`}
                                    initial={{ scale: 0, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg cursor-help group/member"
                                    title={member.username}
                                >
                                    {member.username.charAt(0).toUpperCase()}
                                    <div className="absolute -bottom-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/member:opacity-100 whitespace-nowrap z-50 pointer-events-none border border-white/20">
                                        {member.username}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLocked && !isTopicCompleted && !hideProgress && (
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
                                strokeDasharray={`${progress * 2.8} 280`}
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </motion.div>

                <motion.div
                    className={`
                    absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 text-center p-2 rounded-lg
                    backdrop-blur-md border border-white/30 bg-black/40
                    ${isSelected ? "border-cyan-500/50" : ""}
                `}
                    transition={{ duration: 0.2 }}
                >
                    <h3 className={`text-sm font-bold ${isLocked ? "text-gray-500" : "text-white"} ${hideProgress ? "" : "mb-1"}`}>{topic.title}</h3>
                    {!hideProgress && <p className="text-xs text-gray-400">{completedSubtopics}/{totalSubtopics} Modules</p>}
                </motion.div>
            </div>
        </motion.div>
    );
}
