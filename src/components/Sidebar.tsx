'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: 'Learning',
    path: '/roadmaps',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    name: 'Teams',
    path: '/teams',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/learning':
      return 'Learning Space'
    case '/teams':
      return 'Teams & Groups'
    default:
      return 'Dashboard'
  }
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [userName] = useState('John Doe')
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    console.log('Logging out...')
    logout();
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-4">
      {/* Sidebar */}
      <div
        className={`sticky top-4 flex-shrink-0 rounded-2xl bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl transition-all duration-300 ${
          sidebarExpanded ? 'w-56' : 'w-20'
        }`}
        style={{ height: 'calc(100vh - 2rem)' }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-center border-b border-gray-700">
          <div className="flex items-center justify-center">
            <div className={`font-bold ${sidebarExpanded ? 'text-2xl' : 'text-xl'}`}>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {sidebarExpanded ? 'LEARNHUB' : 'LH'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`my-2 flex w-full items-center rounded-xl px-4 py-3.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white shadow-lg transform translate-x-1'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                } ${sidebarExpanded ? 'justify-start gap-4' : 'justify-center'}`}
              >
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                {sidebarExpanded && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Profile (Bottom) */}
        {sidebarExpanded && (
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{userName}</p>
                  <p className="text-gray-400 text-xs truncate">Premium Member</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="ml-4 flex min-h-[calc(100vh-2rem)] flex-1 flex-col">
        {/* Header */}
        <header className="mb-4 flex h-20 items-center justify-between rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 px-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-lg flex items-center justify-center">
              {navigation.find(nav => nav.path === pathname)?.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {getPageTitle(pathname)}
              </h1>
              <p className="text-gray-400 text-sm">
                {pathname === '/teams' ? 'Collaborate and manage teams' : 
                 pathname === '/roadmaps' ? 'Expand your knowledge' : 
                 'Monitor your learning progress'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {sidebarExpanded ? null : (
              <div className="hidden md:flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-900/40 to-cyan-900/30 border border-blue-800/30 px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Welcome back,</p>
                  <p className="text-blue-300 text-sm font-semibold">{userName}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="group px-6 py-3 bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="whitespace-nowrap">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl">
          <div className="h-full overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}