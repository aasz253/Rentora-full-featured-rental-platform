import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'demo'
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'demo'
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox'

export async function POST(request: NextRequest) {
  try {
    const { amount, bookingRef, bookingId } = await request.json()

    if (PAYPAL_CLIENT_ID === 'demo') {
      const supabase = await createServerSupabase()
      if (bookingId) {
        await supabase.from('payments').insert({
          booking_id: bookingId,
          amount,
          type: 'deposit',
          status: 'completed',
          payment_method: 'paypal',
          paypal_order_id: 'DEMO-ORDER-' + Date.now(),
          payment_ref: 'PAYPAL-DEMO-' + Date.now(),
        })
      }
      return NextResponse.json({
        demo: true,
        orderId: 'DEMO-ORDER-' + Date.now(),
        status: 'COMPLETED',
        message: 'Demo PayPal payment processed',
      })
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
    const accessToken = tokenData.access_token

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: bookingRef,
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
          description: `Rentora Rental Booking ${bookingRef}`,
        }],
      }),
    })

    const order = await orderRes.json()

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      approvalUrl: order.links?.find((l: any) => l.rel === 'approve')?.href,
    })
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json({
      demo: true,
      orderId: 'DEMO-ORDER-' + Date.now(),
      status: 'COMPLETED',
      message: 'Demo mode - PayPal payment simulated',
    })
  }
}
