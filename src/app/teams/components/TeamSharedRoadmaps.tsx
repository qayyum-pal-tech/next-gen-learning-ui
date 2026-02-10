'use client';

import { useEffect, useState } from 'react';
import { fetchTeamRoadmaps } from '@/utils/apis/roadmapApi';
import { Layout, Users, ChevronRight, Clock, Star } from 'lucide-react';

interface TeamSharedRoadmapsProps {
    teamId: string;
    currentUserId?: string;
    onSelect: (roadmapId: string) => void;
}

export default function TeamSharedRoadmaps({ teamId, currentUserId, onSelect }: TeamSharedRoadmapsProps) {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTeamRoadmaps(teamId, currentUserId);
                setRoadmaps(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [teamId, currentUserId]);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (roadmaps.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-800/50 border border-gray-700 rounded-2xl">
                <Layout className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Shared Roadmaps</h3>
                <p className="text-gray-400">Roadmaps shared with this team will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.map((roadmap) => {
                const isDenied = roadmap.acceptanceStatus === 'denied';

                return (
                    <div
                        key={roadmap.originalRoadmapId}
                        onClick={() => !isDenied && onSelect(roadmap.originalRoadmapId)}
                        className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 border rounded-2xl p-6 transition-all duration-300 shadow-lg ${
                            isDenied 
                            ? 'opacity-70 grayscale-[0.6] border-gray-800 cursor-not-allowed' 
                            : 'border-gray-700 cursor-pointer hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isDenied ? 'bg-gray-700/30' : 'bg-blue-900/30'
                            }`}>
                                <Star className={`w-6 h-6 ${isDenied ? 'text-gray-500' : 'text-blue-400'}`} />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1 text-xs font-medium text-blue-300 bg-blue-900/30 px-2 py-1 rounded-full">
                                    <Users className="w-3 h-3" />
                                    {roadmap.memberCount} Members
                                </div>
                                {isDenied && (
                                    <div className="text-[10px] font-bold text-red-400 bg-red-900/20 px-2 py-0.5 rounded uppercase tracking-wider border border-red-800/20">
                                        Denied by You
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className={`text-xl font-bold mb-2 transition-colors ${
                            isDenied ? 'text-gray-500' : 'text-white group-hover:text-blue-400'
                        }`}>
                            {roadmap.subject}
                        </h3>
                        <p className={`text-sm line-clamp-2 mb-6 ${isDenied ? 'text-gray-600' : 'text-gray-400'}`}>
                            {roadmap.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Clock className="w-4 h-4" />
                                {roadmap.totalEstimatedDuration}
                            </div>
                            {!isDenied && (
                                <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                                    Track Progress
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
