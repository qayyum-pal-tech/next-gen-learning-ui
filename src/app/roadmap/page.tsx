"use client";

import { useRoadmaps } from "@/utils/hooks/useRoadmaps";
import RoadmapCard from "../components/RoadmapCard";
import { Folder } from "lucide-react";
import { useState, useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const USER_ID = user?._id || user?.id;
    console.log("USER_ID", USER_ID);

    const [tick, setTick] = useState(0);

    const { roadmaps, isLoading } = useRoadmaps(USER_ID);

    /* star animation tick */
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 2000);
        return () => clearInterval(id);
    }, []);

    /* ── star field ── */
    const STARS = Array.from({ length: 50 }, (_, i) => ({
        x: (Math.sin(i * 132.5) * 0.5 + 0.5) * 100,
        y: (Math.cos(i * 41.3) * 0.5 + 0.5) * 100,
        size: 1 + (i % 3) * 1.5,
        opacity: 0.1 + (i % 5) * 0.15,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-6 lg:p-8 rounded relative overflow-hidden">
            {/* Background Stars (localized to dashboard area) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
            </div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Learning Roadmaps
                        </h1>
                        <p className="text-gray-400 mt-4">Expand your knowledge with personalized learning paths</p>
                    </div>
                </div>
                {/* Grid Container */}
                <div className="w-full">
                    {isLoading ? (
                        // Loading Skeletons in Grid
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-full h-[400px] bg-white/5 rounded-3xl animate-pulse border border-white/5"
                                />
                            ))}
                        </div>
                    ) : roadmaps.length > 0 ? (
                        // Roadmap Cards in Grid
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {roadmaps.map((roadmap) => (
                                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="group relative w-[300px] h-[400px]">
                                <div className="absolute inset-0 bg-white/5 rounded-3xl border border-white/10 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                                        <Folder className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-gray-400 group-hover:text-white transition-colors">
                                            No Roadmaps Found
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Create your first roadmap to get started
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}