'use client';

import { useState } from 'react';
import { createTeam } from '../services/teams.service';
import { useRouter } from 'next/navigation';

export default function CreateTeamPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    await createTeam({ teamName, description });
    router.replace('/teams');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create Team</h1>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <textarea
        className="w-full border p-2 mb-3 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Create Team
      </button>
    </div>
  );
}
