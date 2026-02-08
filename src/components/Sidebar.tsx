'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Rocket, LayoutDashboard, Users, Sparkles } from 'lucide-react'

const navigation = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Learning',
        path: '/learning',
        icon: Rocket,
    },
    {
        name: 'Teams',
        path: '/teams',
        icon: Users,
    },
]

const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/roadmap/')) return 'Start Learning';
    switch (pathname) {
        case '/dashboard':
            return 'Mission Control'
        case '/learning':
            return 'Learning Space'
        case '/teams':
            return 'Squadron'
        default:
            return 'Mission Control'
    }
}

export function Sidebar({ children }: { children: React.ReactNode }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false)
    const [userName] = useState('John')
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        console.log('Logging out...')
        router.push('/login')
    }

    return (
        <div className="flex min-h-screen bg-[#050510] font-sans text-white">
            {/* Background Ambience (Global for the layout) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div
                className={`sticky top-0 z-50 flex flex-col h-screen transition-all duration-300 border-r border-white/10 bg-[#050510]/80 backdrop-blur-xl ${sidebarExpanded ? 'w-64' : 'w-20'
                    }`}
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
            >
                <div className="flex h-20 items-center justify-center border-b border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Sparkles className={`w-8 h-8 ${sidebarExpanded ? 'animate-pulse' : ''}`} />
                        {sidebarExpanded && <span className="font-bold text-xl tracking-wider">Next-Gen-Learning</span>}
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.path
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.path)}
                                className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-200'}`} />
                                <span
                                    className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group ${!sidebarExpanded && 'justify-center'}`}
                    >
                        <LogOut className="w-6 h-6 flex-shrink-0" />
                        <span
                            className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'
                                }`}
                        >
                            Logout
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <header className="h-20 flex items-center justify-end px-8 border-b border-white/10 bg-[#050510]/80 backdrop-blur-md sticky top-0 z-40">


                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-sm font-mono">
                            {userName}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-[#050510]">
                    {/* The page content lives here.
                         IMPORTANT: Pages like RoadmapPage create their own container systems.
                         We simply provide the slot. */}
                    {children}
                </main>
            </div>
        </div>
    )
}