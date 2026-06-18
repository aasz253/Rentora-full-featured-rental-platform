'use client'

import { useState, useEffect } from 'react'
import { Bell, Loader2, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Notification } from '@/lib/types'

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (data) setNotifications(data)
      setLoading(false)
    }
    fetch()

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const markAllRead = async () => {
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (ids.length === 0) return
    await supabase.from('notifications').update({ is_read: true }).in('id', ids)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  const typeIcons: Record<string, string> = {
    booking: '📋',
    review: '⭐',
    maintenance: '🔧',
    referral: '🎁',
    alert: '🔔',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {notifications.filter((n) => !n.is_read).length} unread
          </span>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
        >
          <Check className="w-3 h-3" /> Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-xl p-4 card-shadow border transition-all ${
              notif.is_read ? 'border-gray-50 opacity-70' : 'border-purple-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{typeIcons[notif.type] || '🔔'}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
              </div>
              {!notif.is_read && <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1" />}
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-400">No notifications</div>
        )}
      </div>
    </div>
  )
}
