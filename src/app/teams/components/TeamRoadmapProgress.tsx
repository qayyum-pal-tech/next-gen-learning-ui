'use client';

import { useEffect, useState } from 'react';
import { fetchTeamRoadmapProgress } from '@/utils/apis/roadmapApi';
import RoadmapPath from '@/app/components/RoadmapPath';
import PlanetNode from '@/app/components/PlanetNode';
import { Sparkles, ChevronLeft } from 'lucide-react';

interface TeamRoadmapProgressProps {
    teamId: string;
    roadmapId: string;
    onBack: () => void;
}

export default function TeamRoadmapProgress({ teamId, roadmapId, onBack }: TeamRoadmapProgressProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchTeamRoadmapProgress(teamId, roadmapId);
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [teamId, roadmapId]);

    /* star animation tick */
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 2000);
        return () => clearInterval(id);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                <p className="text-cyan-400 font-mono text-sm">Synchronizing Team Data...</p>
            </div>
        );
    }

    if (!data?.roadmap) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-center">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Roadmap Not Found</h3>
                <p className="text-gray-400 mb-6">Unable to load the shared roadmap progress data.</p>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors border border-gray-700"
                >
                    Return to List
                </button>
            </div>
        );
    }

    const { roadmap, membersProgress } = data;

    // Node Calculation (Mirrors RoadmapPage.tsx)
    const SPACING = 120;
    const START_Y = 100;
    const AMPLITUDE = 25;

    const nodes = roadmap.topics.map((topic: any, index: number) => {
        const x = 50 + Math.sin((index * Math.PI) / 1.5) * AMPLITUDE;

        // Find members at this topic
        const membersAtThisTopic = membersProgress.filter(
            (m: any) => m.currentTopicOrder === topic.order
        );

        return {
            topic,
            x,
            y: START_Y + index * SPACING,
            members: membersAtThisTopic,
        };
    });

    const totalHeight = START_Y + nodes.length * SPACING + 200;

    return (
        <div className="min-h-screen bg-[#050510] relative overflow-hidden font-sans rounded-2xl border border-gray-800">
            <button
                onClick={onBack}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
            >
                <ChevronLeft className="w-5 h-5" />
                Back to List
            </button>

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto min-h-screen pt-20" style={{ height: totalHeight }}>
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
                        {roadmap.subject.toUpperCase()}
                    </h1>
                    <p className="text-gray-400 mt-2">Team Progress Tracking</p>
                </div>

                {/* The Path */}
                <div className="absolute inset-x-0 top-0 h-full">
                    <RoadmapPath
                        points={nodes.map((n: any) => ({ x: n.x, y: n.y }))}
                        height={totalHeight}
                    />
                </div>

                {/* Nodes */}
                <div className="absolute inset-x-0 top-0 h-full">
                    {nodes.map((node: any, i: number) => (
                        <PlanetNode
                            key={node.topic._id || i}
                            topic={node.topic}
                            index={i}
                            x={node.x}
                            y={node.y}
                            isSelected={false}
                            isLocked={false} // Managers see all nodes
                            onClick={() => { }} // Interaction disabled as per request
                            hideProgress={true}
                            memberIcons={node.members.map((m: any) => ({
                                username: m.username,
                                userId: m.userId,
                            }))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
