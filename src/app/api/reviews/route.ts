import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')
    const supabase = await createServerSupabase()

    let query = supabase.from('reviews').select('*').eq('is_flagged', false).order('created_at', { ascending: false })
    if (propertyId) query = query.eq('property_id', propertyId)

    const { data } = await query.limit(50)
    return NextResponse.json({ reviews: data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const body = await request.json()

    let hash = null
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(body) + Date.now())
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      hash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch {}

    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...body, blockchain_hash: hash })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ review: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
