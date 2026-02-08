'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SwrProvider from "@/utils/providers/SwrProvider";
import { Sidebar } from "@/components/Sidebar";
import Chatbot from "@/components/Chatbot";
import './globals.css';
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SwrProvider><Sidebar>{children}<Chatbot /> </Sidebar></SwrProvider>
      </body>
    </html>
  );
}
