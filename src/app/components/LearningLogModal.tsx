'use client';

import { useState, useEffect } from 'react';
import { X, Clock, BookOpen, Send } from 'lucide-react';
import { postLearningLog } from '@/utils/apis/roadmapApi';

interface LearningLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    roadmapId: string;
    topicTitle: string;
    suggestedMinutes: number;
}

export default function LearningLogModal({ isOpen, onClose, roadmapId, topicTitle, suggestedMinutes }: LearningLogModalProps) {
    const [minutes, setMinutes] = useState<number>(suggestedMinutes || 5);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Sync minutes with suggested value when modal opens
    useEffect(() => {
        if (isOpen) {
            setMinutes(suggestedMinutes || 5);
        }
    }, [isOpen, suggestedMinutes]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await postLearningLog({
                roadmapId,
                topicTitle,
                minutesSpent: minutes,
                trackedMinutes: suggestedMinutes,
                notes,
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setNotes('');
            }, 1500);
        } catch (error) {
            console.error('Failed to log time:', error);
            alert('Failed to log time. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Log Learning Time</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Topic</label>
                        <div className="flex items-center gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span className="truncate">{topicTitle}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 font-mono">
                            Time Spent: <span className="text-blue-400">{minutes} minutes</span>
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="240"
                            step="5"
                            value={minutes}
                            onChange={(e) => setMinutes(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                            <span>5m</span>
                            <span>1h</span>
                            <span>2h</span>
                            <span>3h</span>
                            <span>4h</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What did you learn today?"
                            className="w-full h-24 bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || success}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${success
                            ? 'bg-green-600 text-white'
                            : 'bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg shadow-blue-900/20'
                            } disabled:opacity-50`}
                    >
                        {success ? (
                            'Time Logged Successfully!'
                        ) : isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Entry
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
