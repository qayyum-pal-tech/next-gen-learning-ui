'use client';

import { useEffect, useState } from 'react';
import { getCreatedTeams, getJoinedTeams } from './teams.service';

export function useMyTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const [created, joined] = await Promise.all([
          getCreatedTeams(),
          getJoinedTeams(),
        ]);

        // 🔥 merge & remove duplicates
        const map = new Map();
        [...created, ...joined].forEach((t) =>
          map.set(t._id, t),
        );

        setTeams(Array.from(map.values()));
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, loading };
}


