'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface TenantScreeningProps {
  bookingId: string
  onComplete: () => void
}

export default function TenantScreening({ bookingId, onComplete }: TenantScreeningProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [ssnLast4, setSsnLast4] = useState('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [employer, setEmployer] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('tenant_screenings').insert({
      booking_id: bookingId,
      full_name: fullName,
      email,
      phone,
      date_of_birth: dob || null,
      ssn_last_four: ssnLast4,
      current_address: currentAddress,
      employer,
      annual_income: annualIncome ? parseFloat(annualIncome) : null,
    })
    setLoading(false)
    setDone(true)
    onComplete()
  }

  if (done) return null

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Tenant Screening</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">Free identity & income verification (demo)</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name *" required
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email *" required
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
          <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" placeholder="Date of Birth"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
          <input value={ssnLast4} onChange={(e) => setSsnLast4(e.target.value)} maxLength={4} placeholder="SSN Last 4"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
          <input value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} type="number" placeholder="Annual Income ($)"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
        </div>
        <input value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder="Employer"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
        <input value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} placeholder="Current Address"
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
        <button type="submit" disabled={loading}
          className="w-full gradient-bg text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {loading ? 'Submitting...' : 'Submit Screening'}
        </button>
      </form>
    </div>
  )
}
