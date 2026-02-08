"use client";

import { MessageSquare, MoreVertical, PlayCircle, Trophy, Rocket, Star, ChevronRight, X, Users, UserPlus } from "lucide-react";
import { Roadmap } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoadmapCardProps {
    roadmap: Roadmap;
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
    console.log(roadmap)
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'team' | 'friends'>('team');

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleMenuAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        setShowMenu(false);

        if (action === 'share') {
            setShowShareModal(true);
        } else if (action === 'accept') {
            console.log('Accept clicked for roadmap:', roadmap.id);
            // Add your accept logic here
        }
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const closeModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShareModal(false);
    };

    return (
        <>
            <div
                onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                className="group relative w-[300px] h-[400px] flex-shrink-0 cursor-pointer"
            >
                <div className="absolute inset-0 bg-[#050510]/80 rounded-3xl border border-white/10 backdrop-blur-xl transition-all duration-500 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-visible">

                    {/* Card Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                    {/* Status Badge - Center */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${roadmap.status === 'completed'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : roadmap.status === 'in_progress'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                : 'bg-white/5 text-gray-400 border-white/10'
                            }`}>
                            {roadmap.status === 'completed' ? 'COMPLETED' : roadmap.status === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED'}
                        </div>
                    </div>

                    {/* Kebab Menu Button - Right */}
                    <div className="absolute top-4 right-4 z-20 ">
                        <button
                            onClick={handleMenuClick}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 hover:border-white/20"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute top-10 right-0 w-40 bg-[#0a0a1a]/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl overflow-hidden">
                                <button
                                    onClick={(e) => handleMenuAction(e, 'share')}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={(e) => handleMenuAction(e, 'accept')}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-t border-white/5 cursor-pointer"
                                >
                                    Accept
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-full p-6 flex flex-col relative z-10">
                        {/* Icon/Image Placeholder */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-cyan-500/30 mt-8">
                            <Rocket className="w-6 h-6 text-cyan-400" />
                        </div>

                        {/* Title & Stats */}
                        <div className="space-y-4 mb-auto">
                            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                                {roadmap.subject}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-yellow-500/50" />
                                    <span>{roadmap.topics.length} Modules</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Trophy className="w-4 h-4 text-purple-500/50" />
                                    <span>{roadmap.difficultyLevel || 'Beginner'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-cyan-400 font-mono">{Math.round(roadmap.progressPercentage)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                                    style={{ width: `${roadmap.progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-sm group-hover:border-cyan-500/20 transition-colors">
                            <span className="text-gray-400 group-hover:text-white transition-colors">Continue Journey</span>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <div
                        onClick={handleModalClick}
                        className="bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Share Roadmap</h2>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('team')}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${activeTab === 'team'
                                    ? 'text-cyan-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Share with Team</span>
                                </div>
                                {activeTab === 'team' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('friends')}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${activeTab === 'friends'
                                    ? 'text-cyan-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    <span>Share to Friends</span>
                                </div>
                                {activeTab === 'friends' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'team' ? (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm">Share this roadmap with your team members</p>
                                    <input
                                        type="text"
                                        placeholder="Enter team member email"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                                        Send Invitation
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm">Share this roadmap with your friends</p>
                                    <input
                                        type="text"
                                        placeholder="Enter friend's email"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                    <div className="flex gap-3">
                                        <button className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                                            Copy Link
                                        </button>
                                        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                                            Share
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}