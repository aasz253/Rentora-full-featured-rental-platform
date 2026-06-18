import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { generateBookingReference } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('bookings')
      .select('*, properties(*)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const body = await request.json()

    const { data: property } = await supabase
      .from('properties')
      .select('availability, price, title')
      .eq('id', body.property_id)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (property.availability !== 'available') {
      return NextResponse.json({ error: 'Property is not available' }, { status: 400 })
    }

    const bookingRef = generateBookingReference()

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        property_id: body.property_id,
        guest_name: body.guest_name,
        guest_email: body.guest_email,
        guest_phone: body.guest_phone,
        move_in_date: body.move_in_date,
        total_price: property.price,
        booking_reference: bookingRef,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await supabase
      .from('properties')
      .update({ availability: 'booked' })
      .eq('id', body.property_id)

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
