'use client'

import { useState, useEffect } from 'react'
import {
  Loader2, CheckCircle, XCircle, Smartphone, Wallet,
  Building2, Copy, Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Property, BankTransferDetails } from '@/lib/types'
import ReceiptCard from '@/components/ReceiptCard'

type PaymentStep = 'select' | 'mpesa' | 'paypal' | 'bank' | 'processing' | 'success' | 'failed'

interface PaymentModalProps {
  property: Property
  bookingData: {
    guestName: string
    guestEmail: string
    guestPhone: string
    moveInDate: string
  }
  bookingId: string
  bookingRef: string
  onComplete: () => void
  onClose: () => void
}

export default function PaymentModal({
  property,
  bookingData,
  bookingId,
  bookingRef,
  onComplete,
  onClose,
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('select')
  const [method, setMethod] = useState<'mpesa' | 'paypal' | 'bank_transfer' | null>(null)
  const [mpesaPhone, setMpesaPhone] = useState(bookingData.guestPhone || '')
  const [mpesaSent, setMpesaSent] = useState(false)
  const [bankDetails, setBankDetails] = useState<BankTransferDetails | null>(null)
  const [bankAccountName, setBankAccountName] = useState('')
  const [bankTransferRef, setBankTransferRef] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const amount = property.price * 1.5

  useEffect(() => {
    if (step === 'bank') {
      fetch('/api/payments/bank/details')
        .then((r) => r.json())
        .then(setBankDetails)
    }
  }, [step])

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleMpesaPay = async () => {
    setProcessing(true)
    setError('')

    const res = await fetch('/api/payments/mpesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: mpesaPhone,
        amount,
        accountRef: bookingRef,
        bookingRef,
      }),
    })

    const data = await res.json()
    setProcessing(false)

    if (data.success) {
      setMpesaSent(true)
      setStep('processing')

      await supabase.from('payments').insert({
        booking_id: bookingId,
        amount,
        type: 'deposit',
        status: data.demo ? 'completed' : 'pending',
        payment_method: 'mpesa',
        mpesa_phone: mpesaPhone,
        mpesa_receipt: data.mpesaReceipt || null,
        payment_ref: data.merchantRequestId,
      })

      if (data.demo) {
        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId)
        await supabase.from('properties').update({ availability: 'booked' }).eq('id', property.id)
        setTimeout(() => setStep('success'), 1500)
      }
    } else {
      setError(data.responseDescription || 'Payment failed')
      setStep('failed')
    }
  }

  const handlePaypalPay = async () => {
    setProcessing(true)
    setError('')

    const res = await fetch('/api/payments/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, bookingRef, bookingId }),
    })

    const data = await res.json()
    setProcessing(false)

    if (data.demo || data.status === 'COMPLETED') {
      setStep('success')
      onComplete()
    } else if (data.approvalUrl) {
      window.open(data.approvalUrl, '_blank')
      setStep('processing')
    } else {
      setError('PayPal checkout failed')
      setStep('failed')
    }
  }

  const handleBankSubmit = async () => {
    if (!bankAccountName || !bankTransferRef) {
      setError('Please fill in your name and transfer reference')
      return
    }
    setProcessing(true)
    setError('')

    const res = await fetch('/api/payments/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        amount,
        bankAccountName,
        bankTransferRef,
      }),
    })

    const data = await res.json()
    setProcessing(false)

    if (data.success) {
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId)
      setStep('success')
    } else {
      setError(data.error || 'Failed to record')
    }
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold text-gray-900">Payment Successful!</h2>
            </div>
            <ReceiptCard
              guestName={bookingData.guestName}
              guestEmail={bookingData.guestEmail}
              guestPhone={bookingData.guestPhone}
              moveInDate={bookingData.moveInDate}
              bookingRef={bookingRef}
              property={property}
              paymentMethod={method || undefined}
              amount={amount}
            />
            <button onClick={onComplete} className="no-print w-full mt-4 gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90">
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Complete Payment</h2>
              <p className="text-xs text-gray-500 mt-0.5">{property.title}</p>
            </div>
            <span className="text-xl font-bold gradient-text">{formatPrice(amount)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Security deposit (1.5x monthly rent)</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 mb-4">{error}</div>
          )}

          {step === 'select' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Choose your preferred payment method:</p>

              <button onClick={() => { setMethod('mpesa'); setStep('mpesa') }} className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-all group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 text-sm">M-Pesa</p>
                  <p className="text-xs text-gray-500">STK Push to your phone</p>
                </div>
                <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">Fast</span>
              </button>

              <button onClick={() => { setMethod('paypal'); setStep('paypal') }} className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 text-sm">PayPal</p>
                  <p className="text-xs text-gray-500">Pay with card or PayPal balance</p>
                </div>
                <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">Global</span>
              </button>

              <button onClick={() => { setMethod('bank_transfer'); setStep('bank') }} className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Bank Transfer</p>
                  <p className="text-xs text-gray-500">Direct bank deposit</p>
                </div>
                <span className="text-purple-600 text-xs font-medium bg-purple-50 px-2 py-1 rounded-full">Manual</span>
              </button>
            </div>
          )}

          {step === 'mpesa' && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">M-Pesa Phone Number</p>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400/30"
              />
              <p className="text-xs text-gray-400">You'll receive an STK Push prompt on your phone</p>
              <div className="flex gap-3">
                <button onClick={() => setStep('select')} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Back</button>
                <button onClick={handleMpesaPay} disabled={processing || mpesaPhone.length < 10} className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                  {processing ? 'Sending...' : `Pay ${formatPrice(amount)}`}
                </button>
              </div>
            </div>
          )}

          {step === 'paypal' && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Wallet className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">PayPal Checkout</p>
                <p className="text-xs text-gray-500 mt-1">You'll be redirected to PayPal to complete payment</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('select')} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Back</button>
                <button onClick={handlePaypalPay} disabled={processing} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                  {processing ? 'Processing...' : `Pay ${formatPrice(amount)}`}
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">Demo: Payment will be simulated</p>
            </div>
          )}

          {step === 'bank' && bankDetails && (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-900">Bank Transfer Details</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Bank', value: bankDetails.bankName, key: 'bank' },
                    { label: 'Account Name', value: bankDetails.accountName, key: 'name' },
                    { label: 'Account Number', value: bankDetails.accountNumber, key: 'acc' },
                    { label: 'Branch Code', value: bankDetails.branchCode, key: 'branch' },
                    { label: 'SWIFT Code', value: bankDetails.swiftCode, key: 'swift' },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{row.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-900 text-xs">{row.value}</span>
                        <button onClick={() => copy(row.value, row.key)} className="text-gray-400 hover:text-purple-600">
                          {copied === row.key ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 mt-2">
                  <p className="text-xs font-medium text-gray-700">Your Reference: <span className="font-bold text-purple-700">{bankDetails.reference}</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Include this reference in your transfer</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Your name as on bank account *"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                />
                <input
                  type="text"
                  value={bankTransferRef}
                  onChange={(e) => setBankTransferRef(e.target.value)}
                  placeholder="Transfer reference from bank *"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('select')} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Back</button>
                <button onClick={handleBankSubmit} disabled={processing || !bankAccountName || !bankTransferRef} className="flex-1 gradient-bg text-white px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {processing ? 'Submitting...' : 'Confirm Transfer'}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              {mpesaSent ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Smartphone className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">STK Push Sent!</h3>
                  <p className="text-sm text-gray-500 mb-2">Please check your phone and enter your M-Pesa PIN</p>
                  <p className="text-xs text-gray-400">Waiting for confirmation...</p>
                  <Loader2 className="w-5 h-5 animate-spin text-green-600 mx-auto mt-4" />
                </>
              ) : (
                <>
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-1">Processing Payment</h3>
                  <p className="text-sm text-gray-500">Please wait while we process your payment...</p>
                </>
              )}
            </div>
          )}

          {step === 'failed' && (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Payment Failed</h3>
              <p className="text-sm text-gray-500 mb-4">{error || 'Something went wrong. Please try again.'}</p>
              <button onClick={() => setStep('select')} className="gradient-bg text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
