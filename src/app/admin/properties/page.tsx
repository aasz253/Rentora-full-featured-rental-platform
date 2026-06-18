'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Edit, Loader2, Search, MapPin, Plus, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Property } from '@/lib/types'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editAvailability, setEditAvailability] = useState<'available' | 'booked'>('available')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setProperties(data)
      setLoading(false)
    }
    fetchProperties()
  }, [])

  const startEdit = (property: Property) => {
    setEditingId(property.id)
    setEditPrice(property.price.toString())
    setEditAvailability(property.availability)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditPrice('')
    setEditAvailability('available')
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    await supabase
      .from('properties')
      .update({ price: parseFloat(editPrice), availability: editAvailability })
      .eq('id', id)
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: parseFloat(editPrice), availability: editAvailability } : p
      )
    )
    setSaving(false)
    cancelEdit()
  }

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
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
          <Building2 className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">All Properties</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 w-48"
            />
          </div>
          <a href="/dashboard/properties/new" className="gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&q=60'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                        loading="lazy"
                        decoding="async"
                        width={40}
                        height={40}
                      />
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">{property.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs">{property.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-xs text-gray-600">{property.property_type}</td>
                  <td className="px-4 py-3">
                    {editingId === property.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                      />
                    ) : (
                      <span className="font-semibold gradient-text">{formatPrice(property.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === property.id ? (
                      <select
                        value={editAvailability}
                        onChange={(e) => setEditAvailability(e.target.value as 'available' | 'booked')}
                        className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                      </select>
                    ) : (
                      <span className={`flex items-center gap-1 w-fit text-xs font-medium px-2 py-0.5 rounded-full ${
                        property.availability === 'available'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {property.availability === 'available' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {property.availability}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === property.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => saveEdit(property.id)}
                          disabled={saving}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(property)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">No properties found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
