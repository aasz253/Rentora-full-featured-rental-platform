'use client'

import { useState, useEffect } from 'react'
import { Users, Building2, Calendar, Eye, DollarSign, TrendingUp, Home, Ban } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { DashboardStats } from '@/lib/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0, totalLandlords: 0, totalBookings: 0,
    totalVisitors: 0, revenue: 0, availableProperties: 0,
    bookedProperties: 0, bannedLandlords: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const [propsRes, profilesRes, bookingsRes, visitorsRes] = await Promise.all([
        supabase.from('properties').select('id, price, availability'),
        supabase.from('profiles').select('id, role, banned'),
        supabase.from('bookings').select('id, total_price'),
        supabase.from('visitor_tracking').select('id', { count: 'exact', head: true }),
      ])

      const properties = propsRes.data || []
      const profiles = profilesRes.data || []
      const bookings = bookingsRes.data || []

      setStats({
        totalProperties: properties.length,
        totalLandlords: profiles.filter((p) => p.role === 'landlord').length,
        totalBookings: bookings.length,
        totalVisitors: visitorsRes.count || 0,
        revenue: bookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
        availableProperties: properties.filter((p) => p.availability === 'available').length,
        bookedProperties: properties.filter((p) => p.availability === 'booked').length,
        bannedLandlords: profiles.filter((p) => p.banned === true).length,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Available', value: stats.availableProperties, icon: Home, color: 'bg-green-100 text-green-600' },
    { label: 'Booked', value: stats.bookedProperties, icon: Calendar, color: 'bg-orange-100 text-orange-600' },
    { label: 'Landlords', value: stats.totalLandlords, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Banned', value: stats.bannedLandlords, icon: Ban, color: 'bg-red-100 text-red-600' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Visitors', value: stats.totalVisitors, icon: Eye, color: 'bg-cyan-100 text-cyan-600' },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl p-4 card-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 card-shadow">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/admin/landlords" className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-sm text-gray-900">Manage Landlords</p>
              <p className="text-xs text-gray-500">Ban, edit, or approve</p>
            </div>
          </a>
          <a href="/admin/properties" className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-sm text-gray-900">All Properties</p>
              <p className="text-xs text-gray-500">Update prices & details</p>
            </div>
          </a>
          <a href="/admin/bookings" className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-sm text-gray-900">View Bookings</p>
              <p className="text-xs text-gray-500">See who booked what</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
