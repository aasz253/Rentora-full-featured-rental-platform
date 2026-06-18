import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Body } = body
    const stkCallback = Body?.stkCallback

    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid callback' })
    }

    const { ResultCode, ResultDesc, MerchantRequestID, CheckoutRequestID, CallbackMetadata } = stkCallback

    if (ResultCode === 0) {
      let mpesaReceipt = ''
      let phone = ''

      if (CallbackMetadata?.Item) {
        for (const item of CallbackMetadata.Item) {
          if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = item.Value
          if (item.Name === 'PhoneNumber') phone = item.Value
        }
      }

      const supabase = await createServerSupabase()

      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .filter('mpesa_receipt', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)

      if (payments && payments.length > 0) {
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            mpesa_receipt: mpesaReceipt,
            payment_ref: MerchantRequestID,
          })
          .eq('id', payments[0].id)

        const { data: booking } = await supabase
          .from('bookings')
          .select('property_id')
          .eq('id', payments[0].booking_id)
          .single()

        if (booking) {
          await supabase
            .from('properties')
            .update({ availability: 'booked' })
            .eq('id', booking.property_id)
        }
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' })
  }
}
