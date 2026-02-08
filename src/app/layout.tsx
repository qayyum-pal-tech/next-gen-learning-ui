'use client'
import './globals.css'
import SwrProvider from '@/utils/providers/SwrProvider'
import { Sidebar } from '@/components/Sidebar'
import Chatbot from '@/components/Chatbot'
import './globals.css'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { usePathname } from 'next/navigation'

const PUBLIC_ROUTES = ['/auth/login', '/auth/register']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useProtectedRoute()

  const pathname = usePathname()
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  return (
    <html lang="en">
      <body className="bg-gray-50">
        {isPublicRoute ? (
          children
        ) : (
          <SwrProvider>
            <Sidebar>
              {children}
              <Chatbot />{' '}
            </Sidebar>
          </SwrProvider>
        )}
      </body>
    </html>
  )
}
