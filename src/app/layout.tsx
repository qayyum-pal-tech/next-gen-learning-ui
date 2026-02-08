'use client';

import Chatbot from '@/components/Chatbot';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { usePathname } from 'next/navigation';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useProtectedRoute();

  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        {isPublicRoute ? (
          children
        ) : (
          <Sidebar>
            {children}
            <Chatbot />
          </Sidebar>
        )}
      </body>
    </html>
  );
}
