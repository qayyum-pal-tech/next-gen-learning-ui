'use client';

import { useEffect, useState } from 'react';
import {
  getCreatedTeams,
  getJoinedTeams,
} from './services/teams.service';
import { useRouter } from 'next/navigation';
import CreateTeamModal from './components/CreateTeamModal';

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');
  const [teams, setTeams] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTeams();
  }, [activeTab]);

  const loadTeams = async () => {
    const res =
      activeTab === 'created'
        ? await getCreatedTeams()
        : await getJoinedTeams();

    setTeams(res);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 sm:p-6 lg:p-8 rounded">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Teams
          </h1>
          <p className="text-gray-400 mt-2">Manage your teams and collaborations</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl cursor-pointer focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 focus:outline-none"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Team
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-8 py-4 font-bold transition-all duration-300 border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'created'
              ? 'text-blue-400 border-blue-400 bg-blue-400/5'
              : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Created by Me
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`px-8 py-4 font-bold transition-all duration-300 border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'joined'
              ? 'text-blue-400 border-blue-400 bg-blue-400/5'
              : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Joined Teams
        </button>
      </div>

      {/* Teams Grid */}
      {teams && teams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
          <p className="text-gray-400 max-w-md">
            {activeTab === 'created' 
              ? "You haven't created any teams yet. Start by creating your first team!" 
              : "You haven't joined any teams yet."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams && teams.map((team) => (
          <div
            key={team._id}
            onClick={() => router.push(`/teams/${team._id}`)}
            className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
                  {team.teamName}
                </h2>
                <p className="text-gray-300 mt-2 text-sm line-clamp-2 min-h-[40px]">
                  {team.description || 'No description provided'}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-cyan-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">
                    {team.teamName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A5.981 5.981 0 0018 8a4 4 0 10-8 0 5.981 5.981 0 00-3.064 4.197m13 0a5.975 5.975 0 013.064-4.197A5.981 5.981 0 0020 8a5.981 5981 0 00-8 0 5.975 5.975 0 013.064 4.197"></path>
                </svg>
                <span className="text-gray-300 font-medium">
                  {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-blue-400 group-hover:text-cyan-300 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <CreateTeamModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={loadTeams}
      />
    </div>
  );
}