'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminLeasesPage() {
  const [leases, setLeases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('leases').select('*, bookings(guest_name, booking_reference)').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setLeases(data); setLoading(false) })
  }, [])

  const signAsLandlord = async (id: string) => {
    await supabase.from('leases').update({
      signed_by_landlord: true,
      landlord_signed_at: new Date().toISOString(),
      status: 'active',
    }).eq('id', id)
    setLeases((prev) => prev.map((l) => (l.id === id ? { ...l, signed_by_landlord: true, status: 'active' } : l)))
  }

  const filtered = leases.filter((l) =>
    (l as any).bookings?.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    (l as any).bookings?.booking_reference?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Digital Leases</h2>
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
              <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Rent</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Term</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tenant Signed</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Landlord Signed</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-xs font-medium text-gray-900">{(l as any).bookings?.guest_name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{(l as any).bookings?.booking_reference}</td>
                <td className="px-4 py-3 text-xs font-medium gradient-text">${l.monthly_rent?.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{l.lease_start_date} → {l.lease_end_date}</td>
                <td className="px-4 py-3">{l.signed_by_tenant ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="text-xs text-gray-400">Pending</span>}</td>
                <td className="px-4 py-3">{l.signed_by_landlord ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="text-xs text-gray-400">Pending</span>}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    l.status === 'active' ? 'bg-green-50 text-green-600' :
                    l.status === 'signed' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                  }`}>{l.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {l.signed_by_tenant && !l.signed_by_landlord && (
                    <button onClick={() => signAsLandlord(l.id)}
                      className="px-2.5 py-1 gradient-bg text-white rounded-lg text-xs font-medium hover:opacity-90">
                      Sign as Landlord
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No leases found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
