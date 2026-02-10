'use client';

import { useState } from 'react';
import { createTeam } from '../services/teams.service';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MessageSquare, Plus, Loader2 } from 'lucide-react';

export default function CreateTeamModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!teamName.trim()) return;

    try {
      setLoading(true);
      await createTeam({ teamName, description });
      setTeamName('');
      setDescription('');
      onCreated();
      onClose();
    } catch (error) {
        console.error("Failed to create team", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/5 bg-white/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Project Nucleus</h2>
                            <p className="text-xs text-gray-400">Assemble your stellar team</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-6">
                {/* Team Name Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                        Team Identity
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        <input
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all focus:bg-white/[0.08]"
                            placeholder="e.g. Frontend Avengers"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                        Mission Statement
                    </label>
                    <div className="relative group">
                        <div className="absolute top-3 left-3 pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all focus:bg-white/[0.08] min-h-[100px] resize-none"
                            placeholder="Briefly describe your team's goal..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 hover:text-white transition"
                    >
                        Recall
                    </button>

                    <button
                        onClick={handleCreate}
                        disabled={loading || !teamName.trim()}
                        className={`flex-[2] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            teamName.trim() && !loading
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                        }`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                        {loading ? 'Initializing...' : 'Establish Team'}
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
