'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, CreditCard, FileText, Wrench, Bell, ChevronRight, Home, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import RentPaymentPortal from '@/components/tenant/RentPaymentPortal'
import type { Property, Booking } from '@/lib/types'

export default function TenantDashboard() {
  const [bookings, setBookings] = useState<(Booking & { properties?: Property })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()
      if (!profile) { setLoading(false); return }

      const { data } = await supabase
        .from('bookings')
        .select('*, properties(*)')
        .eq('guest_email', profile.email)
        .order('created_at', { ascending: false })
      if (data) setBookings(data as any)
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  const activeBooking = bookings.find((b) => b.status === 'confirmed' || b.status === 'pending')
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your rentals, payments, and maintenance</p>
        </div>
      </div>

      {!activeBooking && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 text-center border border-purple-100 mb-8">
          <Home className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No Active Bookings</h2>
          <p className="text-sm text-gray-500 mb-4">Browse properties and find your next home</p>
          <Link href="/" className="inline-block gradient-bg text-white px-6 py-3 rounded-xl font-medium text-sm">Browse Properties</Link>
        </div>
      )}

      {activeBooking && activeBooking.properties && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden mb-8">
          <div className="gradient-bg p-4 text-white">
            <p className="text-xs opacity-80">Active Rental</p>
            <p className="font-semibold">{activeBooking.properties.title}</p>
            <p className="text-xs opacity-80 mt-0.5">
              {new Date(activeBooking.move_in_date).toLocaleDateString()} • Ref: {activeBooking.booking_reference}
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RentPaymentPortal
                bookingId={activeBooking.id}
                property={activeBooking.properties}
                leaseEndDate={activeBooking.lease_end_date || undefined}
              />
              <div className="bg-white rounded-2xl p-6 card-shadow flex flex-col items-center justify-center text-center">
                <Wrench className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">Maintenance</p>
                <p className="text-xs text-gray-500 mb-3">Report an issue with your rental</p>
                <Link href={`/properties/${activeBooking.property_id}`}
                  className="text-xs gradient-text font-semibold hover:opacity-80">
                  Submit Request →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: 'Bookings', value: bookings.length.toString(), href: '#' },
                { icon: CreditCard, label: 'Next Payment', value: formatPrice(activeBooking.properties.price), href: '#' },
                { icon: FileText, label: 'Lease Status', value: 'Active', href: '#' },
                { icon: Bell, label: 'Notifications', value: '0', href: '/admin/notifications' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <item.icon className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Bookings</h2>
          <div className="space-y-3">
            {pastBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl p-4 card-shadow flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.properties?.title || 'Property'}</p>
                  <p className="text-xs text-gray-500">{b.booking_reference} • {new Date(b.move_in_date).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  b.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
