'use client'

import { useState } from 'react'
import { Loader2, Calendar, User, Mail, Phone, CheckCircle, X, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice, generateBookingReference } from '@/lib/utils'
import type { Property } from '@/lib/types'
import PaymentModal from '@/components/PaymentModal'
import ReceiptCard from '@/components/ReceiptCard'

interface BookingFormProps {
  property: Property
  onClose: () => void
}

export default function BookingForm({ property, onClose }: BookingFormProps) {
  const [step, setStep] = useState<'form' | 'receipt' | 'payment'>('form')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [moveInDate, setMoveInDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (property.availability !== 'available') {
      setError('This property is no longer available.')
      setLoading(false)
      return
    }

    const bookingRef = generateBookingReference()

    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        property_id: property.id,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        move_in_date: moveInDate,
        total_price: property.price,
        booking_reference: bookingRef,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingError) {
      setError(bookingError.message)
      setLoading(false)
      return
    }

    setBookingId(bookingData.id)
    setBookingRef(bookingRef)
    setStep('payment')
    setShowPayment(true)
    setLoading(false)
  }

  if (step === 'receipt') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-bold text-gray-900">Booking Confirmed!</h2>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <ReceiptCard
              guestName={guestName}
              guestEmail={guestEmail}
              guestPhone={guestPhone}
              moveInDate={moveInDate}
              bookingRef={bookingRef}
              property={property}
              paymentMethod="card"
            />
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">A confirmation email has been sent to {guestEmail}</p>
            </div>
            <button
              onClick={onClose}
              className="no-print w-full mt-4 gradient-bg text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Book This Property</h2>
              <p className="text-sm text-gray-500 mt-0.5">{property.title} - {formatPrice(property.price)}/mo</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">{error}</div>
            )}

            {property.availability !== 'available' && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                This property is currently booked and unavailable.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1" /> Full Name
              </label>
              <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Jane Smith" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Mail className="w-3.5 h-3.5 inline mr-1" /> Email
              </label>
              <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="jane@example.com" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Phone className="w-3.5 h-3.5 inline mr-1" /> Phone
              </label>
              <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+1 (555) 123-4567" required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all" />
              <p className="text-xs text-gray-400 mt-1">For M-Pesa: use 2547XXXXXXXX format</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Move-in Date
              </label>
              <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all" />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100">
              <p className="text-xs text-gray-500 mb-1">Payment Required: Security deposit (1.5x monthly rent)</p>
              <p className="text-lg font-bold gradient-text">{formatPrice(property.price * 1.5)}</p>
              <p className="text-xs text-gray-400 mt-1">Pay via M-Pesa, PayPal, or Bank Transfer</p>
            </div>

            <button type="submit" disabled={loading || property.availability !== 'available'}
              className="w-full gradient-bg text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {loading ? 'Creating booking...' : `Continue to Payment - ${formatPrice(property.price * 1.5)}`}
            </button>
          </form>
        </div>
      </div>

      {showPayment && bookingId && bookingRef && (
        <PaymentModal
          property={property}
          bookingData={{ guestName, guestEmail, guestPhone, moveInDate }}
          bookingId={bookingId}
          bookingRef={bookingRef}
          onComplete={() => { setStep('receipt'); setShowPayment(false) }}
          onClose={() => { setShowPayment(false); onClose() }}
        />
      )}
    </>
  )
}
