"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Topic } from "@/types/types";
import { X, ChevronRight, CheckCircle, Sparkles, BookOpen } from "lucide-react";

interface SideDrawerProps {
    topic: Topic | null;
    isOpen: boolean;
    onClose: () => void;
    onSubtopicClick: (topicOrder: number, subtopicOrder: number) => void;
    onTakeQuiz: () => void;
}

export default function SideDrawer({
    topic,
    isOpen,
    onClose,
    onSubtopicClick,
    onTakeQuiz,
}: SideDrawerProps) {

    const allSubtopicsCompleted = topic?.subtopics.every((s) => s.isCompleted) ?? false;

    return (
        <AnimatePresence>
            {isOpen && topic && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-gray-900 border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">
                                        Station {topic.order}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {topic.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm">{topic.description}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                                    Learning Modules
                                </h3>
                                {topic.subtopics.map((subtopic) => (
                                    <button
                                        key={subtopic.order}
                                        onClick={() => onSubtopicClick(topic.order, subtopic.order)}
                                        className="w-full group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all text-left cursor-pointer"
                                    >
                                        <div className="flex-shrink-0">
                                            {subtopic.isCompleted ? (
                                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                            ) : (
                                                <BookOpen className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4
                                                className={`font-medium truncate ${subtopic.isCompleted ? "text-emerald-200" : "text-white"
                                                    }`}
                                            >
                                                {subtopic.title}
                                            </h4>
                                            {subtopic.estimatedDuration && (
                                                <span className="text-xs text-gray-500">
                                                    {subtopic.estimatedDuration}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400" />
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={onTakeQuiz}
                                    disabled={!allSubtopicsCompleted}
                                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all  ${allSubtopicsCompleted
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] cursor-pointer"
                                        : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                                        }`}
                                >
                                    <Sparkles className={`w-5 h-5 ${allSubtopicsCompleted ? "animate-pulse" : ""}`} />
                                    {allSubtopicsCompleted ? "Take Quiz to Unlock Next" : "Complete All Modules to Unlock Quiz"}
                                </button>
                                {!allSubtopicsCompleted && (
                                    <p className="text-center text-xs text-gray-600 mt-2">
                                        Finish all {topic.subtopics.length} learning modules to proceed.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
