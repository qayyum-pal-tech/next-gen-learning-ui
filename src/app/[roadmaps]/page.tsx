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

    // console.log("roadmaps",roadmaps);
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
        <div className="min-h-full w-full relative p-8">
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

            <div className="relative z-10 space-y-8">
                {/* Horizontal Scroll Container */}
                <div className="w-full overflow-x-auto pb-12 pt-4 px-2 custom-scrollbar">
                    <div className="flex gap-8 min-w-min">

                        {/* Add New Card */}


                        {isLoading ? (
                            // Loading Skeletons
                            [1, 2, 3].map((i) => (
                                <div key={i} className="w-[300px] h-[400px] flex-shrink-0 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
                            ))
                        ) : (
                            roadmaps.length > 0 ? roadmaps.map((roadmap) => (
                                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                            )) : (
                                <div className="group relative w-[300px] h-[400px] flex-shrink-0">
                                    <div className="absolute inset-0 bg-white/5 rounded-3xl border border-white/10 border-dashed flex flex-col items-center justify-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                                            <Folder className="w-8 h-8 text-gray-400 group-hover:text-cyan-400" />
                                        </div>
                                        <span className="font-bold text-gray-400 group-hover:text-white">No Roadmaps Found</span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.3);
                }
            `}</style>
        </div>
    );
}
