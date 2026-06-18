'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Users, Building2, Calendar, Eye, BarChart3, Wrench, MessageSquare, Bell, CreditCard, FileText, UserCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Landlords', href: '/admin/landlords', icon: Users },
  { label: 'Properties', href: '/admin/properties', icon: Building2 },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Screenings', href: '/admin/screenings', icon: UserCheck },
  { label: 'Leases', href: '/admin/leases', icon: FileText },
  { label: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Visitors', href: '/admin/visitors', icon: Eye },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/auth/login')
    }
  }, [user, profile, loading])

  if (loading || !user || profile?.role !== 'admin') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-600 animate-pulse" />
          <span className="text-gray-500">Verifying access...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50">
      <div className="gradient-bg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-white" />
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-purple-200 text-xs">Full platform control & monitoring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <nav className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl card-shadow p-2 sticky top-20">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "gradient-bg text-white"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
