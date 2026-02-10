'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, Rocket, Users, Clock, Shield, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const navigation = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Learning',
        path: '/roadmaps',
        icon: Rocket,
    },
    {
        name: 'Teams',
        path: '/teams',
        icon: Users,
    },
    {
        name: 'History',
        path: '/history',
        icon: Clock,
    },
    {
        name: 'Admin',
        path: '/admin',
        adminOnly: true,
        icon: Shield,
    },
]

export function Sidebar({ children }: { children: React.ReactNode }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false)
    const user = useAuthStore((s) => s.user);
    const userName = user?.username || 'User';
    const pathname = usePathname()
    const router = useRouter()
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        console.log('Logging out...')
        logout();
    }

    return (
        <div className="flex min-h-screen bg-[#050510] font-sans text-white">
            {/* Background Ambience (Global for the layout) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Sidebar */}
            <div
                className={`sticky top-0 z-50 flex flex-col h-screen border-r border-white/10 bg-[#050510]/80 backdrop-blur-xl transition-[width] duration-300 ease-in-out ${sidebarExpanded ? 'w-64' : 'w-20'
                    }`}
                style={{ willChange: 'width' }}
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
            >
                {/* Logo Section */}
                <div className="flex h-20 items-center justify-center border-b border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Sparkles className={`w-8 h-8 flex-shrink-0 ${sidebarExpanded ? 'animate-pulse' : ''}`} />
                        {sidebarExpanded && (
                            <span className="font-bold text-xl tracking-wider whitespace-nowrap">
                                LearnHub
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navigation
                        .filter(item => !item.adminOnly || userName === 'admin')
                        .map((item) => {
                            const isActive = pathname === item.path
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => router.push(item.path)}
                                    className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group cursor-pointer ${isActive
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon
                                        className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-200'
                                            }`}
                                    />
                                    {sidebarExpanded && (
                                        <span className="ml-3 font-medium whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                </nav>

                {/* User Profile & Logout Section */}
                <div className="border-t border-white/10 p-4 space-y-3">
                    {/* User Profile */}
                    {sidebarExpanded && (
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-sm">
                                        {userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{userName}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-white transition-colors duration-200 group cursor-pointer ${!sidebarExpanded && 'justify-center'
                            }`}
                    >
                        <LogOut className="w-6 h-6 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
                        {sidebarExpanded && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-[#050510]">
                    {children}
                </main>
            </div>
        </div>
    )
}