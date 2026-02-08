'use client';

import { useEffect, useState } from 'react';
import {
  getTeamById,
  exitTeam,
  deleteTeam,
  addMembers,
  removeMember,
} from '../services/teams.service';
import { useParams, useRouter } from 'next/navigation';
import EditTeamModal from '../components/EditTeamModal';
import UserMultiSelectDropdown from '../components/UserMultiSelectDropdown';
import { getMe } from '../services/users.service';

export default function TeamDetailsPage() {
  const { teamId } = useParams();
  const router = useRouter();

  const [team, setTeam] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [teamRes, meRes] = await Promise.all([
          getTeamById(teamId as string),
          getMe(),
        ]);

        setTeam(teamRes);
        setCurrentUser(meRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teamId]);

  const fetchTeam = async () => {
    const res = await getTeamById(teamId as string);
    setTeam(res);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="bg-gray-800 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Failed to load data</h3>
          <p className="text-gray-400">Unable to fetch team or user information</p>
        </div>
      </div>
    );
  }

  const createdById =
    typeof team.createdBy === 'string'
      ? team.createdBy
      : team.createdBy?._id;

  const isCreator = createdById === currentUser._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {team.teamName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {team.teamName}
                  </h1>
                  <p className="text-gray-300 text-lg">
                    {team.description || 'No description provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="text-gray-300">
                    {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span className="text-gray-300">
                    {isCreator ? 'Owner' : 'Member'}
                  </span>
                </div>
              </div>
            </div>

            {isCreator && (
              <button
                onClick={() => setShowEdit(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Team
              </button>
            )}
          </div>
        </div>

        {/* Add Member Section */}
        {isCreator && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Add Team Members</h2>
            </div>

            <div className="space-y-6">
              <UserMultiSelectDropdown
                teamId={team._id}
                selectedUsers={selectedUsers}
                onChange={setSelectedUsers}
              />

              <button
                disabled={selectedUsers.length === 0 || adding}
                onClick={async () => {
                  try {
                    setAdding(true);
                    await addMembers(
                      team._id,
                      selectedUsers.map((u) => u._id),
                    );

                    setSelectedUsers([]);
                    fetchTeam();
                  } finally {
                    setAdding(false);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              >
                {adding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Members...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-700 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A5.981 5.981 0 0018 8a4 4 0 10-8 0 5.981 5.981 0 00-3.064 4.197m13 0a5.975 5.975 0 013.064-4.197A5.981 5.981 0 0020 8a5.981 5.981 0 00-8 0 5.975 5.975 0 013.064 4.197"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Team Members</h2>
                <p className="text-gray-400">{team.members.length} members in total</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {team.members.map((m: any, index: number) => (
              <div
                key={m._id}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-cyan-700 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {m.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {m._id === createdById && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Owner
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-white text-lg">{m.username}</h3>
                        {m._id === currentUser._id && (
                          <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400">{m.email}</p>
                    </div>
                  </div>

                  {isCreator && m._id !== createdById && (
                    <button
                      onClick={() => removeMember(team._id, m._id).then(fetchTeam)}
                      className="px-4 py-2 bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-400 hover:text-red-300 border border-red-800/50 hover:border-red-700 rounded-lg transition-all duration-300 flex items-center gap-2 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          {!isCreator && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to exit this team?')) {
                  await exitTeam(team._id);
                  router.replace('/teams');
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-yellow-700 to-amber-700 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Exit Team
            </button>
          )}
          
          {isCreator && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
                  await deleteTeam(team._id);
                  router.replace('/teams');
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Team
            </button>
          )}
        </div>
      </div>

      {showEdit && (
        <EditTeamModal
          team={team}
          onClose={() => setShowEdit(false)}
          onUpdated={fetchTeam}
        />
      )}
    </div>
  );
}