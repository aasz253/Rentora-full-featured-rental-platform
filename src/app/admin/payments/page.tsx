'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Loader2, CheckCircle, XCircle, Smartphone, Wallet, Building2, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Payment } from '@/lib/types'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('payments')
        .select('*, bookings!inner(guest_name, booking_reference, properties(title))')
        .order('created_at', { ascending: false })
      if (data) setPayments(data as any)
      setLoading(false)
    }
    fetch()
  }, [])

  const confirmPayment = async (id: string) => {
    await supabase.from('payments').update({ status: 'completed' }).eq('id', id)
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'completed' as const } : p)))
  }

  const refundPayment = async (id: string) => {
    await supabase.from('payments').update({ status: 'refunded' }).eq('id', id)
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'refunded' as const } : p)))
  }

  const methodIcons: Record<string, any> = { mpesa: Smartphone, paypal: Wallet, bank_transfer: Building2 }

  const filtered = payments.filter((p) =>
    (p as any).bookings?.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.payment_ref?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Payments</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {payments.filter((p) => p.status === 'pending').length} pending
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 w-48" />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Method</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Ref</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((payment) => {
                const Icon = methodIcons[payment.payment_method] || CreditCard
                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-900">{(payment as any).bookings?.guest_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{(payment as any).bookings?.booking_reference}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs capitalize">{payment.payment_method?.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-500">{payment.payment_ref?.slice(0, 16) || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold gradient-text">{formatPrice(payment.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                        payment.status === 'completed' ? 'bg-green-50 text-green-600' :
                        payment.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                        payment.status === 'failed' ? 'bg-red-50 text-red-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {payment.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                         payment.status === 'pending' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                         <XCircle className="w-3 h-3" />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {payment.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => confirmPayment(payment.id)}
                            className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                            Confirm
                          </button>
                          <button onClick={() => refundPayment(payment.id)}
                            className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                            Refund
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
