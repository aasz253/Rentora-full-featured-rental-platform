import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, bankAccountName, bankTransferRef, proofImageUrl } = await request.json()

    const supabase = await createServerSupabase()

    const { data, error } = await supabase.from('payments').insert({
      booking_id: bookingId,
      amount,
      type: 'deposit',
      status: 'pending',
      payment_method: 'bank_transfer',
      bank_account_name: bankAccountName,
      bank_transfer_ref: bankTransferRef,
      proof_image_url: proofImageUrl || null,
      payment_ref: 'BANK-' + bankTransferRef,
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment: data,
      message: 'Bank transfer details recorded. Waiting for admin confirmation.',
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
