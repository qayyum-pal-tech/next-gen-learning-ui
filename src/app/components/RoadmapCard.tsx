'use client'

import {
  MessageSquare,
  MoreVertical,
  PlayCircle,
  Trophy,
  Rocket,
  Star,
  ChevronRight,
  X,
  Users,
  UserPlus,
} from 'lucide-react'
import { Roadmap } from '@/types/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMyTeams } from '../teams/services/teampathservice'
import { shareRoadmap } from '../teams/services/teams.service'
import UserSearchMultiSelect from './UserSearchMultiSelect'
import { getMe } from '../teams/services/users.service'

interface RoadmapCardProps {
  roadmap: Roadmap
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  // console.log("roadmap",roadmap);
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'team' | 'friends'>('team')

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [sharing, setSharing] = useState(false)
  const { teams } = useMyTeams();

  const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    console.log("currentuser",currentUser);
  
    useEffect(() => {
      const load = async () => {
        try {
          setLoading(true)
          const  meRes = await getMe();
          setCurrentUser(meRes)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      load()
    }, [])

  console.log('teams', teams)

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleMenuAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation()
    setShowMenu(false)

    if (action === 'share') {
      setShowShareModal(true)
    } else if (action === 'accept') {
      console.log('Accept clicked for roadmap:', roadmap.id)
      // Add your accept logic here
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

 const closeModal = (e?: React.MouseEvent) => {
  e?.stopPropagation()

  setShowShareModal(false)
  setShowMenu(false)

  // reset modal state
  setActiveTab('team')
  setSelectedTeamId(null)
  setSelectedUsers([])
  setSharing(false)
}


  return (
    <>
      <div
        onClick={() => {
          if (showShareModal) return
          router.push(`/roadmap/${roadmap.id}`)
        }}
        className="group relative h-[400px] max-h-[500px] w-[300px] flex-shrink-0 cursor-pointer"
      >
        <div className="absolute inset-0 overflow-visible rounded-3xl border border-white/10 bg-[#050510]/80 backdrop-blur-xl transition-all duration-500 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          {/* Card Background Gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Status Badge - Center */}
          <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2">
            <div
              className={`rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap ${
                roadmap.status === 'completed'
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : roadmap.status === 'in_progress'
                    ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'
                    : 'border-white/10 bg-white/5 text-gray-400'
              }`}
            >
              {roadmap.status === 'completed'
                ? 'COMPLETED'
                : roadmap.status === 'in_progress'
                  ? 'IN PROGRESS'
                  : 'NOT STARTED'}
            </div>
          </div>

          {/* Kebab Menu Button - Right */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleMenuClick}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <MoreVertical className="h-4 w-4 cursor-pointer text-gray-400 hover:text-white" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-10 right-0 w-40 overflow-hidden rounded-lg border border-white/10 bg-[#0a0a1a]/95 shadow-xl backdrop-blur-xl">
                <button
                  onClick={(e) => handleMenuAction(e, 'share')}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Share
                </button>
                <button
                  onClick={(e) => handleMenuAction(e, 'accept')}
                  className="w-full cursor-pointer border-t border-white/5 px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Accept
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 flex h-full flex-col p-6">
            {/* Icon/Image Placeholder */}
            <div className="mt-8 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:border-cyan-500/30">
              <Rocket className="h-6 w-6 text-cyan-400" />
            </div>

            {/* Title & Stats */}
            <div className="mb-auto space-y-4">
              <h3 className="line-clamp-2 text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
                {roadmap.subject}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500/50" />
                  <span>{roadmap.topics.length} Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-purple-500/50" />
                  <span>{roadmap.difficultyLevel || 'Beginner'}</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="font-mono text-cyan-400">
                  {Math.round(roadmap.progressPercentage)}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${roadmap.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6 text-sm transition-colors group-hover:border-cyan-500/20">
              <span className="text-gray-400 transition-colors group-hover:text-white">
                Continue Journey
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all group-hover:bg-cyan-500/20 group-hover:text-cyan-400">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={handleModalClick}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a1a] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-xl font-bold text-white">Share Roadmap</h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('team')}
                className={`relative flex-1 cursor-pointer px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'team'
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Share with Team</span>
                </div>
                {activeTab === 'team' && (
                  <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`relative flex-1 cursor-pointer px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === 'friends'
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Share to Friends</span>
                </div>
                {activeTab === 'friends' && (
                  <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'team' ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Share this roadmap with your team members
                  </p>
                  <select
                    value={selectedTeamId ?? ''}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                  >
                    <option className="bg-[#050510]/80 text-white" value="">
                      Select team
                    </option>
                    {teams.map((team) => (
                      <option
                        className="bg-[#050510]/80 text-white"
                        key={team._id}
                        value={team._id}
                      >
                        {team.teamName}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={!selectedTeamId || sharing}
                    onClick={async (e) => {
                      e.stopPropagation()
                      setSharing(true)
                      await shareRoadmap({
                        roadmapId: roadmap.id,
                        shareType: 'TEAM',
                        teamId: selectedTeamId!,
                        sharedBy: currentUser._id,
                      })
                      setSharing(false)
                      setShowShareModal(false)
                    }}
                    className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-white"
                  >
                    Share with Team
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Share this roadmap with your friends
                  </p>
                  <UserSearchMultiSelect
                    selectedUsers={selectedUsers}
                    onChange={setSelectedUsers}
                  />

                  <button
                    disabled={selectedUsers.length === 0 || sharing}
                    onClick={async (e) => {
                      e.stopPropagation()
                      setSharing(true)
                      await shareRoadmap({
                        roadmapId: roadmap.id,
                        shareType: 'USERS',
                        userIds: selectedUsers.map((u) => u._id),
                        sharedBy: currentUser._id,
                      })
                      setSharing(false)
                      setShowShareModal(false)
                    }}
                    className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-white"
                  >
                    Share with Users
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
