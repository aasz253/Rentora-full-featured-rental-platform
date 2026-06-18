'use client'

import { useState } from 'react'
import { Bell, BellOff, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { PropertyFilters } from '@/lib/types'

interface SavedSearchBarProps {
  filters: PropertyFilters
}

export default function SavedSearchBar({ filters }: SavedSearchBarProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const saveSearch = async () => {
    if (!user) return
    setSaving(true)

    await supabase.from('saved_searches').insert({
      user_id: user.id,
      search_params: filters,
      email_alerts: true,
    })

    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) return null

  return (
    <button
      onClick={saveSearch}
      disabled={saving || saved}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
        saved
          ? 'bg-green-50 text-green-600'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      {saving ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : saved ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Bell className="w-3.5 h-3.5" />
      )}
      {saved ? 'Alert Set!' : 'Save Search'}
    </button>
  )
}
