import type { Metadata } from 'next'
import './globals.css'
import { QuizProvider } from '@/context/QuizContext'
import ClientLayout from './ClientLayout'

export const metadata: Metadata = {
  title: 'LearnHub',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <QuizProvider>
          <ClientLayout>{children}</ClientLayout>
        </QuizProvider>
      </body>
    </html>
  )
}