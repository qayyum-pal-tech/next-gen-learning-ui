'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { searchUsers } from '../teams/services/teams.service';

interface Props {
  selectedUsers: any[];
  onChange: (users: any[]) => void;
}

export default function UserSearchMultiSelect({
  selectedUsers,
  onChange,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetch = async () => {
      const users = await searchUsers(query);
      setResults(
        users.filter(
          (u: any) =>
            !selectedUsers.some((s) => s._id === u._id),
        ),
      );
    };

    fetch();
  }, [query, selectedUsers]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addUser = (user: any) => {
    onChange([...selectedUsers, user]);
    setQuery('');
    setOpen(false);
  };

  const removeUser = (id: string) => {
    onChange(selectedUsers.filter((u) => u._id !== id));
  };

  return (
    <div ref={ref} className="relative space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map((user) => (
          <span
            key={user._id}
            className="flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300"
          >
            {user.username || user.email}
            <button onClick={() => removeUser(user._id)}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder="Search users by email or username"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
      />

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-white/10 bg-[#050510] shadow-xl">
          {results.map((user) => (
            <button
              key={user._id}
              onClick={() => addUser(user)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {user.username} ({user.email})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
