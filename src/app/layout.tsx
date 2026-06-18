import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LiveChat from '@/components/LiveChat'
import VisitorTracker from '@/components/VisitorTracker'
import PWARegister from '@/components/PWARegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rentora | Find Your Perfect Home',
  description: 'Discover amazing rental properties. Browse houses, apartments, and more. Your dream home is just a click away.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=75" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            <VisitorTracker />
            <PWARegister />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <LiveChat />
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
