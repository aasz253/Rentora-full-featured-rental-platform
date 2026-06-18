'use client'

import { useState } from 'react'
import { Menu, X, Home, LayoutDashboard, LogOut, Building2, Shield, UserCog, User, GraduationCap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  const isLoggedIn = !!user
  const isAdmin = profile?.role === 'admin'
  const isLandlord = profile?.role === 'landlord'

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="gradient-bg p-2 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Rentora</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </a>
            <a href="/#properties" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Properties
            </a>
            <a href="/student" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              Students
            </a>
            {isLoggedIn && isAdmin && (
              <a
                href="/admin"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </a>
            )}
            {isLoggedIn && isLandlord && (
              <a
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>
            )}
            {isLoggedIn && (
              <a href="/tenant" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <User className="w-4 h-4" />
                My Rentals
              </a>
            )}
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                  <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{profile?.full_name || 'User'}</p>
                    <p className="text-[10px] text-gray-500 capitalize leading-tight">{profile?.role}</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href="/auth/login"
                className="gradient-bg text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Sign In
              </a>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden",
        mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 py-4 space-y-3 border-t border-gray-100">
          <a
            href="/"
            className="block text-sm font-medium text-gray-600 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </a>
          <a
            href="/#properties"
            className="block text-sm font-medium text-gray-600 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Properties
          </a>
          <a
            href="/student"
            className="block text-sm font-medium text-gray-600 py-2"
            onClick={() => setMobileOpen(false)}
          >
            <GraduationCap className="w-4 h-4 inline mr-1" />
            Students
          </a>
          {isLoggedIn && isAdmin && (
            <a
              href="/admin"
              className="block text-sm font-medium text-purple-600 py-2"
              onClick={() => setMobileOpen(false)}
            >
              <Shield className="w-4 h-4 inline mr-1" />
              Admin Panel
            </a>
          )}
          {isLoggedIn && isLandlord && (
            <a
              href="/dashboard"
              className="block text-sm font-medium text-gray-600 py-2"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-1" />
              Dashboard
            </a>
          )}
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 py-2 border-b border-gray-100 mb-2">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                </div>
              </div>
              <button
                onClick={() => { signOut(); setMobileOpen(false) }}
                className="block text-sm font-medium text-red-500 py-2 w-full text-left"
              >
                <LogOut className="w-4 h-4 inline mr-1" />
                Sign Out
              </button>
            </>
          ) : (
            <a
              href="/auth/login"
              className="block gradient-bg text-white px-5 py-2.5 rounded-full text-sm font-semibold text-center"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
