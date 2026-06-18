'use client'

import { useState, useEffect } from 'react'
import { Wrench, Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { MaintenanceRequest } from '@/lib/types'

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('maintenance_requests')
        .select('*, properties(title)')
        .order('created_at', { ascending: false })
      if (data) setRequests(data as any)
      setLoading(false)
    }
    fetch()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('maintenance_requests').update({ status }).eq('id', id)
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: status as any } : r)))
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  const statusColors: Record<string, string> = {
    open: 'bg-red-50 text-red-600',
    in_progress: 'bg-yellow-50 text-yellow-600',
    resolved: 'bg-green-50 text-green-600',
    closed: 'bg-gray-50 text-gray-600',
  }

  const priorityIcons: Record<string, any> = {
    low: Clock, medium: AlertTriangle, high: AlertTriangle, emergency: AlertTriangle,
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Maintenance Requests</h2>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Issue</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-xs truncate max-w-[200px]">{req.issue_description}</p>
                    {req.guest_email && <p className="text-xs text-gray-400">{req.guest_email}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{(req as any).properties?.title || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      req.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                      req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{req.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[req.status]}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No maintenance requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
