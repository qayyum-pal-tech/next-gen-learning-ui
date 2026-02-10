'use client';

import { useEffect, useRef, useState } from 'react';
import { getAvailableUsers } from '../services/teams.service';
import { useDebounce } from '@/hooks/useDebounce';

type User = {
  _id: string;
  username: string;
  email: string;
};

export default function UserMultiSelectDropdown({
  teamId,
  selectedUsers,
  onChange,
}: {
  teamId: string;
  selectedUsers: User[];
  onChange: (users: User[]) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query);

  /* ---------- fetch users ---------- */
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res: User[] = await getAvailableUsers(
          teamId,
          debouncedQuery,
        );

        // 🔥 filter already selected users
        const filtered = res.filter(
          (u) => !selectedUsers.some((s) => s._id === u._id),
        );

        setUsers(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery, open, selectedUsers, teamId]);

  /* ---------- click outside ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setUsers([]);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handler);
    return () =>
      document.removeEventListener('mousedown', handler);
  }, []);

  const selectUser = (user: User) => {
    onChange([...selectedUsers, user]);
    setQuery('');
    setUsers([]);
  };

  const removeUser = (id: string) => {
    onChange(selectedUsers.filter((u) => u._id !== id));
  };

  return (
    <div ref={wrapperRef} className="relative space-y-4">
      {/* Selected Users Chips */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2 w-full">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A5.981 5.981 0 0018 8a4 4 0 10-8 0 5.981 5.981 0 00-3.064 4.197m13 0a5.975 5.975 0 013.064-4.197A5.981 5.981 0 0020 8a5.981 5.981 0 00-8 0 5.975 5.975 0 013.064 4.197"></path>
              </svg>
            </div>
            <span className="text-gray-300 font-medium text-sm">Selected Members</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <div
                key={u._id}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-900/40 to-cyan-900/30 border border-blue-800/30 text-blue-300 px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {u.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{u.username}</span>
                <button
                  onClick={() => removeUser(u._id)}
                  className="ml-1 text-blue-400 hover:text-red-400 transition-colors duration-200 group-hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 transition-all duration-300"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-2 w-full bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Loading State */}
            {loading && (
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-400 text-sm">Searching users...</p>
              </div>
            )}

            {/* No Results */}
            {!loading && users.length === 0 && debouncedQuery && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-1">No users found</p>
                <p className="text-gray-500 text-sm">Try a different search term</p>
              </div>
            )}

            {/* Empty Search */}
            {!loading && users.length === 0 && !debouncedQuery && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-1">Search for users</p>
                <p className="text-gray-500 text-sm">Start typing to find team members</p>
              </div>
            )}

            {/* User List */}
            {!loading && users.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-700 bg-gray-900/50">
                  <p className="text-xs text-gray-400 font-medium">
                    {users.length} user{users.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="divide-y divide-gray-700/50">
                  {users.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => selectUser(u)}
                      className="w-full text-left p-4 hover:bg-gray-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-cyan-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                              {u.username}
                            </p>
                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                              User
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{u.email}</p>
                        </div>
                        <div className="text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 pt-2">
        Search and select users to add to your team. Selected users will appear above.
      </p>
    </div>
  );
}