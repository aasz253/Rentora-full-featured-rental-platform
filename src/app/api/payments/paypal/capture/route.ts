import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'demo'
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'demo'
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox'

export async function POST(request: NextRequest) {
  try {
    const { orderId, bookingId, amount } = await request.json()

    if (PAYPAL_CLIENT_ID === 'demo') {
      const supabase = await createServerSupabase()
      if (bookingId) {
        await supabase.from('payments').update({
          status: 'completed',
          paypal_order_id: orderId,
          payment_ref: 'PAYPAL-' + orderId,
        }).eq('booking_id', bookingId)

        const { data: booking } = await supabase.from('bookings').select('property_id').eq('id', bookingId).single()
        if (booking) {
          await supabase.from('properties').update({ availability: 'booked' }).eq('id', booking.property_id)
        }
      }
      return NextResponse.json({ status: 'COMPLETED', demo: true })
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
    const baseUrl = PAYPAL_ENV === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com'

    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    const tokenData = await tokenRes.json()

    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const captureData = await captureRes.json()

    const supabase = await createServerSupabase()
    if (bookingId) {
      await supabase.from('payments').update({
        status: 'completed',
        paypal_order_id: orderId,
        payment_ref: 'PAYPAL-' + orderId,
      }).eq('booking_id', bookingId)
    }

    return NextResponse.json(captureData)
  } catch {
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 })
  }
}
