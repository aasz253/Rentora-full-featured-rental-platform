'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, MapPin, School, Users, ArrowLeft, Loader2, UserPlus, Filter } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Property, RoommateRequest } from '@/lib/types'

export default function StudentHousingPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [roommateRequests, setRoommateRequests] = useState<RoommateRequest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [uniFilter, setUniFilter] = useState('')
  const [tab, setTab] = useState<'properties' | 'roommates'>('properties')
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const [propRes, roomRes] = await Promise.all([
        supabase.from('properties').select('*').eq('is_student_housing', true).order('created_at', { ascending: false }),
        supabase.from('roommate_requests').select('*, properties(*)').eq('status', 'open').order('created_at', { ascending: false }),
      ])
      if (propRes.data) setProperties(propRes.data)
      if (roomRes.data) setRoommateRequests(roomRes.data as any)
      setLoading(false)
    }
    fetchData()
  }, [])

  const universities = [...new Set(properties.filter(p => p.university_area).map(p => p.university_area!))]

  const filteredProperties = uniFilter
    ? properties.filter(p => p.university_area?.toLowerCase().includes(uniFilter.toLowerCase()))
    : properties

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Housing</h1>
          <p className="text-gray-500 text-sm">Affordable rentals for university students</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('properties')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'properties' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <School className="w-4 h-4 inline mr-1.5" />
          Properties ({filteredProperties.length})
        </button>
        <button
          onClick={() => setTab('roommates')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'roommates' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4 inline mr-1.5" />
          Roommates ({roommateRequests.length})
        </button>
      </div>

      {showForm && tab === 'roommates' && (
        <RoommateRequestForm onClose={() => setShowForm(false)} onSubmitted={() => { setShowForm(false); window.location.reload() }} />
      )}

      {tab === 'properties' && (
        <>
          {universities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setUniFilter('')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  !uniFilter ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Areas
              </button>
              {universities.map(uni => (
                <button
                  key={uni}
                  onClick={() => setUniFilter(uni)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    uniFilter === uni ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {uni}
                </button>
              ))}
            </div>
          )}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <School className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No student properties found</h3>
              <p className="text-gray-500 text-sm">Check back later for more listings near your campus.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, i) => (
                <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'roommates' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 text-sm">{roommateRequests.length} students looking for roommates</p>
            <button
              onClick={() => setShowForm(true)}
              className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Find Roommate
            </button>
          </div>
          {roommateRequests.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No roommate requests yet</h3>
              <p className="text-gray-500 text-sm">Be the first to post a roommate request!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roommateRequests.map((req, i) => (
                <div key={req.id} className="bg-white rounded-2xl p-6 card-shadow animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">{req.full_name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{req.full_name}</h3>
                      {req.university && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <School className="w-3 h-3" />
                          {req.university}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {req.budget_min && req.budget_max && (
                      <p>Budget: {formatPrice(req.budget_min)} - {formatPrice(req.budget_max)}/mo</p>
                    )}
                    {req.move_in_date && <p>Move-in: {new Date(req.move_in_date).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>}
                    {req.gender_preference && <p>Preference: {req.gender_preference}</p>}
                  </div>
                  {req.bio && (
                    <p className="text-sm text-gray-600 border-t border-gray-100 pt-3 mb-4 line-clamp-3">{req.bio}</p>
                  )}
                  <a
                    href={`mailto:${req.email}`}
                    className="block w-full text-center gradient-bg text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Contact
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RoommateRequestForm({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => void }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    budget_min: '',
    budget_max: '',
    move_in_date: '',
    gender_preference: 'any',
    bio: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('roommate_requests').insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      university: form.university || null,
      budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
      budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
      move_in_date: form.move_in_date || null,
      gender_preference: form.gender_preference,
      bio: form.bio || null,
    })
    setSubmitting(false)
    if (!error) onSubmitted()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Find a Roommate</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <input type="text" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} placeholder="e.g. University of Nairobi"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget (KSH)</label>
              <input type="number" value={form.budget_min} onChange={e => setForm({ ...form, budget_min: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget (KSH)</label>
              <input type="number" value={form.budget_max} onChange={e => setForm({ ...form, budget_max: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
              <input type="date" value={form.move_in_date} onChange={e => setForm({ ...form, move_in_date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
              <select value={form.gender_preference} onChange={e => setForm({ ...form, gender_preference: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell potential roommates about yourself..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Post Roommate Request
          </button>
        </form>
      </div>
    </div>
  )
}
