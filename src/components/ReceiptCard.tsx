'use client'

import { useRef } from 'react'
import { Home, Printer, CheckCircle, User, Mail, Phone, MapPin, Bed, Bath, Square } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Property } from '@/lib/types'

interface ReceiptCardProps {
  guestName: string
  guestEmail: string
  guestPhone: string
  moveInDate: string
  bookingRef: string
  property: Property
  paymentMethod?: string
  amount?: number
}

export default function ReceiptCard({
  guestName,
  guestEmail,
  guestPhone,
  moveInDate,
  bookingRef,
  property,
  paymentMethod,
  amount,
}: ReceiptCardProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const depositAmount = amount || property.price * 1.5

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-card, #receipt-card * { visibility: visible; }
          #receipt-card { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          @page { margin: 0.5in; size: auto; }
        }
      `}</style>

      <div className="space-y-4">
        <button
          onClick={handlePrint}
          className="no-print w-full gradient-bg text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Download / Print Receipt
        </button>

        <div
          id="receipt-card"
          ref={printRef}
          className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden shadow-lg"
        >
          <div className="gradient-bg p-5 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Booking Confirmed</h2>
            <p className="text-purple-200 text-xs mt-0.5">Rentora Rental Receipt</p>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
              <p className="text-xs text-gray-500 mb-0.5">Booking Reference</p>
              <p className="text-xl font-bold gradient-text tracking-wider">{bookingRef}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <User className="w-3 h-3" /> Tenant Details
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <User className="w-3 h-3 text-purple-500" />
                    <span className="font-medium text-gray-900">{guestName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Mail className="w-3 h-3 text-purple-500" />
                    <span>{guestEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3 h-3 text-purple-500" />
                    <span>{guestPhone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Home className="w-3 h-3" /> Property Details
                </p>
                <div className="space-y-1.5 text-xs">
                  <p className="font-medium text-gray-900">{property.title}</p>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin className="w-3 h-3 text-purple-500" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 mt-1">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {property.bedrooms} bed</span>
                    <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.bathrooms} bath</span>
                    {property.area_sqft && (
                      <span className="flex items-center gap-1"><Square className="w-3 h-3" /> {property.area_sqft} sqft</span>
                    )}
                  </div>
                  <p className="text-gray-500 capitalize mt-1">Type: {property.property_type}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Move-in Date</span>
                <span className="font-semibold text-gray-900">{new Date(moveInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-gray-500">Monthly Rent</span>
                <span className="font-semibold gradient-text">{formatPrice(property.price)}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-gray-500">Security Deposit Paid</span>
                <span className="font-semibold gradient-text">{formatPrice(depositAmount)}</span>
              </div>
              {paymentMethod && (
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold text-gray-900 capitalize">{paymentMethod.replace('_', ' ')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-500">Booking Date</span>
                <span className="font-semibold text-gray-900">{formatDate(new Date().toISOString())}</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Payment Confirmed</span>
              </div>
              <p className="text-xs text-gray-500">
                Present this card to your landlord as proof of booking and payment.
              </p>
            </div>

            <div className="text-center border-t border-gray-100 pt-3">
              <p className="text-[10px] text-gray-400">
                Rentora &mdash; Verified Rental Platform &bull; Ref: {bookingRef}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                For verification, contact admin at hello@rentora.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
