import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { sendEmail, alertNotificationHtml } from '@/lib/email'

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: searches } = await supabase
      .from('saved_searches')
      .select('*, profiles!inner(id, email, full_name)')
      .eq('email_alerts', true)

    if (!searches) return NextResponse.json({ sent: 0 })

    let sentCount = 0

    for (const search of searches) {
      const params = search.search_params || {}
      let query = supabase.from('properties').select('id, title, price, location, images, created_at').limit(5)

      if (params.location) query = query.ilike('location', `%${params.location}%`)
      if (params.minPrice) query = query.gte('price', params.minPrice)
      if (params.maxPrice) query = query.lte('price', params.maxPrice)
      if (params.propertyType) query = query.eq('property_type', params.propertyType)

      const { data: matches } = await query

      if (matches && matches.length > 0) {
        const lastSent = search.last_alert_sent_at ? new Date(search.last_alert_sent_at) : null
        const recentlyAdded = matches.filter((p) => {
          if (!lastSent) return true
          return new Date(p.created_at) > lastSent
        })

        if (recentlyAdded.length > 0) {
          const siteUrl = process.env.SITE_URL || 'http://localhost:3000'

          await supabase
            .from('notifications')
            .insert({
              user_id: search.user_id,
              type: 'alert',
              title: `${recentlyAdded.length} new ${params.propertyType || 'property'} match your search!`,
              message: `${recentlyAdded.length} new properties found in ${params.location || 'your area'}`,
              data: { matches: recentlyAdded },
            })

          const userEmail = (search.profiles as any)?.email
          if (userEmail) {
            await sendEmail({
              to: userEmail,
              subject: `${recentlyAdded.length} New Properties Match Your Search`,
              html: alertNotificationHtml({
                query: params.location || 'your saved search',
                properties: recentlyAdded.map((p: any) => ({
                  title: p.title,
                  price: p.price,
                  location: p.location,
                  url: `${siteUrl}/properties/${p.id}`,
                })),
              }),
            })
          }

          await supabase
            .from('saved_searches')
            .update({ last_alert_sent_at: new Date().toISOString() })
            .eq('id', search.id)

          sentCount++
        }
      }
    }

    return NextResponse.json({ sent: sentCount, total: searches.length })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
