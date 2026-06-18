'use client'

import { useState, useEffect } from 'react'
import { Eye, Loader2, Globe, Clock, Monitor } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { VisitorRecord } from '@/lib/types'

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchVisitors = async () => {
      const { data } = await supabase
        .from('visitor_tracking')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100)
      if (data) setVisitors(data)
      setLoading(false)
    }
    fetchVisitors()
  }, [])

  const uniqueVisitors = new Set(visitors.map((v) => v.visitor_id)).size

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Eye className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Visitor Tracking</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2">
          {visitors.length} visits · {uniqueVisitors} unique
        </span>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Visitor ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Page Visited</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Referrer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Device</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-600">{visitor.visitor_id.slice(0, 12)}...</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600">{visitor.page_url}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {visitor.referrer || <span className="text-gray-300">Direct</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {visitor.user_agent
                          ? visitor.user_agent.includes('Mobile')
                            ? 'Mobile'
                            : visitor.user_agent.includes('Tablet')
                            ? 'Tablet'
                            : 'Desktop'
                          : 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(visitor.visited_at).toLocaleString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No visitors tracked yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
