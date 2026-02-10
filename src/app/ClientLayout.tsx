'use client'

import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { usePathname } from 'next/navigation'
import SwrProvider from '@/utils/providers/SwrProvider'
import { Sidebar } from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'

const PUBLIC_ROUTES = ['/auth/login', '/auth/register']

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useProtectedRoute()

    const pathname = usePathname()
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (isPublicRoute) {
        return <>{children}</>
    }

    return (
        <SwrProvider>
            <Sidebar>
                {children}
                <Chatbot />
            </Sidebar>
        </SwrProvider>
    )
}