import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { email, password, fullName, phone, referralCode } = await request.json()

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    if (authData.user) {
      let referredBy = null
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode.toUpperCase())
          .single()
        if (referrer) referredBy = referrer.id
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        phone: phone || null,
        role: 'landlord',
        referred_by: referredBy,
      })

      if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

      if (referredBy) {
        await supabase.from('referrals').insert({
          referrer_id: referredBy,
          referee_email: email,
          referee_name: fullName,
          status: 'joined',
          reward_amount: 50,
        })
      }
    }

    return NextResponse.json({ user: authData.user })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
