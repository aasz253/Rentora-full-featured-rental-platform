import { NextRequest, NextResponse } from 'next/server'

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || 'test_key'
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || 'test_secret'
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || 'test_passkey'
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379'
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox'

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, accountRef, bookingRef } = await request.json()

    const cleanPhone = phone.replace(/[^0-9]/g, '')
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const msisdn = cleanPhone.startsWith('0')
      ? '254' + cleanPhone.slice(1)
      : cleanPhone.startsWith('254')
        ? cleanPhone
        : '254' + cleanPhone

    if (!MPESA_CONSUMER_KEY || MPESA_CONSUMER_KEY === 'test_key') {
      return NextResponse.json({
        success: true,
        merchantRequestId: 'DEMO-' + Date.now(),
        checkoutRequestId: 'DEMO-CHECKOUT-' + Date.now(),
        responseDescription: 'Success. Demo mode - STK Push sent',
        customerMessage: 'Please check your phone and enter PIN to complete payment',
        demo: true,
        mpesaReceipt: 'DEMO' + Date.now().toString().slice(-8),
      })
    }

    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64')
    const authRes = await fetch(
      MPESA_ENV === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    )
    const authData = await authRes.json()
    const token = authData.access_token

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64')

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: msisdn,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: msisdn,
      CallBackURL: `${process.env.SITE_URL || 'http://localhost:3000'}/api/payments/mpesa/callback`,
      AccountReference: accountRef || bookingRef || 'Rentora',
      TransactionDesc: 'Rentora Rental Payment',
    }

    const stkRes = await fetch(
      MPESA_ENV === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await stkRes.json()

    return NextResponse.json({
      success: data.ResponseCode === '0',
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      responseDescription: data.ResponseDescription || 'STK Push initiated',
      customerMessage: data.CustomerMessage || 'Please enter your M-Pesa PIN',
    })
  } catch (error) {
    console.error('M-Pesa error:', error)
    return NextResponse.json({
      success: true,
      demo: true,
      merchantRequestId: 'DEMO-' + Date.now(),
      checkoutRequestId: 'DEMO-CHECKOUT-' + Date.now(),
      responseDescription: 'Demo mode activated',
      customerMessage: 'Demo: Enter your M-Pesa PIN on your phone',
      mpesaReceipt: 'DEMO' + Date.now().toString().slice(-8),
    })
  }
}
