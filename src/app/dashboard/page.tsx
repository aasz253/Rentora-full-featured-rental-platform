'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building2, Plus, Edit, Trash2, Loader2, Home, LogOut,
  Calendar, DollarSign, Ban, BookOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import type { Property, Booking } from '@/lib/types'

export default function DashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [tab, setTab] = useState<'properties' | 'bookings'>('properties')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (profile?.banned) return
    fetchProperties()
  }, [user, profile, authLoading])

  useEffect(() => {
    if (tab === 'bookings' && bookings.length === 0 && properties.length > 0) {
      fetchBookings()
    }
  }, [tab, properties.length])

  const fetchProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setProperties(data)
    setLoading(false)
  }

  const fetchBookings = async () => {
    if (properties.length === 0) return
    setBookingsLoading(true)
    const propertyIds = properties.map((p) => p.id)
    const { data } = await supabase
      .from('bookings')
      .select('*, properties(*)')
      .in('property_id', propertyIds)
      .order('created_at', { ascending: false })
    if (data) setBookings(data)
    setBookingsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    setDeleting(id)
    await supabase.from('properties').delete().eq('id', id)
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  if (authLoading || (loading && !profile?.banned)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (profile?.banned) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Ban className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Banned</h1>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Your account has been banned by the administrator. You can no longer manage properties.
          Please contact the admin if you believe this is a mistake.
        </p>
        <button
          onClick={signOut}
          className="gradient-bg text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    )
  }

  const stats = {
    total: properties.length,
    available: properties.filter((p) => p.availability === 'available').length,
    booked: properties.filter((p) => p.availability === 'booked').length,
    totalRevenue: properties.filter((p) => p.availability === 'booked').reduce((sum, p) => sum + p.price, 0),
    totalBookings: bookings.length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {profile?.full_name?.split(' ')[0] || profile?.role || 'User'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your rental properties</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="gradient-bg text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Property</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Home className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
              <p className="text-xs text-gray-500">Booked</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('properties')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'properties' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home className="w-4 h-4 inline mr-1.5" />
          Properties
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'bookings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1.5" />
          Bookings
          {stats.totalBookings > 0 && (
            <span className="ml-1.5 bg-purple-100 text-purple-600 text-xs px-1.5 py-0.5 rounded-full">
              {stats.totalBookings}
            </span>
          )}
        </button>
      </div>

      {tab === 'properties' && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No properties yet</h3>
              <p className="text-gray-500 text-sm mb-6">Start by adding your first rental property.</p>
              <Link
                href="/dashboard/properties/new"
                className="gradient-bg text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {properties.map((property) => (
                <div key={property.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=60'}
                    alt={property.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                    width={80}
                    height={80}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{property.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{property.location}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold gradient-text">{formatPrice(property.price)}/mo</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        property.availability === 'available'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {property.availability}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      disabled={deleting === property.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      {deleting === property.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Bookings for Your Properties</h2>
          </div>

          {bookingsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings yet</h3>
              <p className="text-gray-500 text-sm">Bookings will appear here when tenants book your properties.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Booking Ref</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Move-in</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold gradient-text">{booking.booking_reference}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{booking.guest_name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{booking.guest_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {booking.properties?.title || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(booking.move_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold gradient-text text-xs">{formatPrice(booking.total_price)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-50 text-green-600'
                            : booking.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
