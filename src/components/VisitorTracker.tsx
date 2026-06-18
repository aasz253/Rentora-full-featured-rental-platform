'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let visitorId = localStorage.getItem('rentora_visitor_id')
        if (!visitorId) {
          visitorId = crypto.randomUUID()
          localStorage.setItem('rentora_visitor_id', visitorId)
        }

        const supabase = createClient()
        await supabase.from('visitor_tracking').insert({
          visitor_id: visitorId,
          page_url: window.location.pathname + window.location.search,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        })
      } catch {}
    }

    trackVisit()
  }, [])

  return null
}
