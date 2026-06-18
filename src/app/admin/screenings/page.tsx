'use client'

import { useState, useEffect } from 'react'
import { Shield, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminScreeningsPage() {
  const [screenings, setScreenings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('tenant_screenings').select('*, bookings(guest_name, booking_reference)').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setScreenings(data); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('tenant_screenings').update({ screening_status: status }).eq('id', id)
    setScreenings((prev) => prev.map((s) => (s.id === id ? { ...s, screening_status: status } : s)))
  }

  const filtered = screenings.filter((s) =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Tenant Screenings</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{screenings.length} total</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 w-48" />
        </div>
      </div>
      <div className="bg-white rounded-2xl card-shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Income</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Employer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-xs font-medium text-gray-900">{s.full_name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{s.email}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{s.annual_income ? `$${s.annual_income.toLocaleString()}` : '-'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{s.employer || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    s.screening_status === 'approved' ? 'bg-green-50 text-green-600' :
                    s.screening_status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>{s.screening_status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => updateStatus(s.id, 'approved')}
                      className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100">
                      Approve
                    </button>
                    <button onClick={() => updateStatus(s.id, 'rejected')}
                      className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No screenings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
