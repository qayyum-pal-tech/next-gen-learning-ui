'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

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
    path: '/learning',
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

  const handleLogout = () => {
    console.log('Logging out...')
    router.push('/login')
  }

  const isDetailedPath = pathname.startsWith('/learning/') && pathname !== '/learning'

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 ${isDetailedPath ? 'p-0' : 'p-4'}`}>
      <div
        className={`sticky top-4 flex-shrink-0 rounded-2xl bg-gray-800/40 shadow-2xl transition-all duration-300 ${
          sidebarExpanded ? 'w-48' : 'w-16'
        } ${isDetailedPath ? 'ml-4' : ''}`}
        style={{ height: 'calc(100vh - 2rem)' }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="flex h-16 items-center justify-center border-b border-blue-500">
          <div
            className={`font-bold text-white ${sidebarExpanded ? 'text-xl' : 'text-lg'}`}
          >
            {sidebarExpanded ? 'LEARNHUB' : 'L'}
          </div>
        </div>

        <nav className="mt-4 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`my-1 flex w-full items-center rounded-xl px-3 py-3 transition-all duration-200 ${
                  isActive
                    ? 'translate-x-1 transform bg-blue-500 text-white shadow-lg'
                    : 'text-white hover:bg-white/20 hover:text-white'
                } ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarExpanded && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className={`flex min-h-[calc(100vh-2rem)] flex-1 flex-col ${isDetailedPath ? '' : 'ml-4'}`}>
        {!isDetailedPath && (
          <header className="mb-4 flex h-16 items-center justify-between rounded-2xl border-2 border-blue-500 bg-white px-8 shadow-lg">
            <h1 className="text-xl font-semibold text-gray-800">
              {getPageTitle(pathname)}
            </h1>

            <div className="flex items-center space-x-6">
              <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 sm:block">
                Welcome, {userName}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-600 bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
              >
                <LogOut className="mr-2 inline h-4 w-4" />
                Logout
              </button>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-hidden ${isDetailedPath ? '' : 'rounded-2xl border-2 border-blue-500 bg-white shadow-xl'}`}>
          <div className="h-full overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
