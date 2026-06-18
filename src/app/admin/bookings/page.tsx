'use client'

import { useState, useEffect } from 'react'
import { Calendar, Loader2, Search, Mail, Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Booking } from '@/lib/types'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, properties(*)')
        .order('created_at', { ascending: false })
      if (data) setBookings(data)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const filtered = bookings.filter(
    (b) =>
      b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      b.guest_email.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_reference.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or ref..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Booking Ref</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Move-in</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold gradient-text">{booking.booking_reference}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-xs">{booking.guest_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{booking.guest_email}</span>
                      </div>
                      {booking.guest_phone && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{booking.guest_phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {booking.properties ? (
                      <Link
                        href={`/properties/${booking.property_id}`}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-xs font-medium"
                      >
                        {booking.properties.title}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">Unknown</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {new Date(booking.move_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold gradient-text text-xs">{formatPrice(booking.total_price)}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Showing {filtered.length} of {bookings.length} bookings
      </div>
    </div>
  )
}
