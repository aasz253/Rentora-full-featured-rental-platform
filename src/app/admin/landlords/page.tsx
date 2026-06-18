'use client'

import { useState, useEffect } from 'react'
import { Users, Ban, CheckCircle, Loader2, Mail, Phone, Shield, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

export default function AdminLandlordsPage() {
  const [landlords, setLandlords] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchLandlords = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'landlord')
        .order('created_at', { ascending: false })
      if (data) setLandlords(data)
      setLoading(false)
    }
    fetchLandlords()
  }, [])

  const toggleBan = async (id: string, currentlyBanned: boolean) => {
    setToggling(id)
    await supabase
      .from('profiles')
      .update({ banned: !currentlyBanned, banned_at: currentlyBanned ? null : new Date().toISOString() })
      .eq('id', id)
    setLandlords((prev) =>
      prev.map((l) => (l.id === id ? { ...l, banned: !currentlyBanned, banned_at: currentlyBanned ? null : new Date().toISOString() } : l))
    )
    setToggling(null)
  }

  const filtered = landlords.filter(
    (l) =>
      l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone && l.phone.includes(search))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Manage Landlords</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search landlords..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 w-48"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((landlord) => (
                <tr key={landlord.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                        {landlord.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{landlord.full_name}</p>
                        <p className="text-xs text-gray-400">ID: {landlord.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-xs">{landlord.id}@email</span>
                      </div>
                      {landlord.phone && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-xs">{landlord.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(landlord.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                      landlord.banned
                        ? 'bg-red-50 text-red-600'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {landlord.banned ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {landlord.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleBan(landlord.id, landlord.banned)}
                      disabled={toggling === landlord.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        landlord.banned
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      } disabled:opacity-50`}
                    >
                      {toggling === landlord.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : landlord.banned ? (
                        'Unban'
                      ) : (
                        'Ban'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No landlords found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Showing {filtered.length} of {landlords.length} landlords
      </div>
    </div>
  )
}
