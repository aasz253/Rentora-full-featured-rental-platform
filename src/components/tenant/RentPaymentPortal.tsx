'use client'

import { useState, useEffect } from 'react'
import { Calendar, CreditCard, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import PaymentModal from '@/components/PaymentModal'
import type { Property } from '@/lib/types'

interface RentPaymentPortalProps {
  bookingId: string
  property: Property
  leaseEndDate?: string
}

export default function RentPaymentPortal({ bookingId, property, leaseEndDate }: RentPaymentPortalProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [paidMonths, setPaidMonths] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('rent_payments')
        .select('month, status')
        .eq('booking_id', bookingId)
        .eq('status', 'completed')
      if (data) setPaidMonths(data.map((r) => r.month))
      setLoading(false)
    }
    fetch()
  }, [bookingId])

  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const isPaid = paidMonths.includes(currentMonth)

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  if (loading) return <Loader2 className="w-5 h-5 animate-spin text-purple-600 mx-auto" />

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Rent Payment Portal</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {formatPrice(property.price)}/mo
        </span>
      </div>

      <div className={`p-4 rounded-xl mb-4 ${isPaid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center gap-2">
          {isPaid ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          )}
          <div>
            <p className="text-sm font-medium">{isPaid ? 'Current Month Paid' : 'Payment Due'}</p>
            <p className="text-xs text-gray-500">{currentMonth} — {formatPrice(property.price)}</p>
          </div>
        </div>
      </div>

      <div className="max-h-40 overflow-y-auto space-y-1 mb-4">
        {months.map((m) => {
          const paid = paidMonths.includes(m)
          return (
            <div key={m} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${paid ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <Calendar className={`w-3.5 h-3.5 ${paid ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={paid ? 'text-green-700' : 'text-gray-600'}>{new Date(m + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              </div>
              {paid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <span className="text-xs text-gray-400">{formatPrice(property.price)}</span>
              )}
            </div>
          )
        })}
      </div>

      {!isPaid && (
        <button onClick={() => setShowPayment(true)}
          className="w-full gradient-bg text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
          <CreditCard className="w-4 h-4" />
          Pay {formatPrice(property.price)} for {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </button>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700">Rent payment submitted successfully!</span>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          property={{ ...property, price: property.price }}
          bookingData={{ guestName: '', guestEmail: '', guestPhone: '', moveInDate: '' }}
          bookingId={bookingId}
          bookingRef={`RENT-${currentMonth}`}
          onComplete={() => { setSuccess(true); setShowPayment(false) }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
