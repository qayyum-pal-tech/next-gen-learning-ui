'use client';

import { useState } from 'react';
import { updateTeam } from '@/app/teams/services/teams.service';

export default function EditTeamModal({
  team,
  onClose,
  onUpdated,
}: {
  team: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [teamName, setTeamName] = useState(team.teamName);
  const [description, setDescription] = useState(team.description || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateTeam(team._id, { teamName, description });
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Edit Team</h2>

        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Team name"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Description"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
