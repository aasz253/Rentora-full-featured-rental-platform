'use client'

import { useState } from 'react'
import { Gift, Loader2, Check, Copy, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function ReferralSection() {
  const { user, profile } = useAuth()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  if (!user || !profile) return null

  const referralLink = `${window.location.origin}/auth/register?ref=${profile.referral_code}`

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    await supabase.from('referrals').insert({
      referrer_id: user.id,
      referee_email: email,
      status: 'pending',
      reward_amount: 50,
    })

    setSending(false)
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-gray-900">Refer & Earn $50</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Invite a landlord friend. You get <strong>$50 credit</strong> when they list their first property!
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none"
        />
        <button
          onClick={copyLink}
          className="px-3 py-2 bg-gray-200 rounded-lg text-xs font-medium hover:bg-gray-300 transition-all flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <form onSubmit={sendReferral} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Friend's email..."
          required
          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
        />
        <button
          type="submit"
          disabled={sending || sent}
          className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-all disabled:opacity-70 flex items-center gap-1"
        >
          {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : sent ? <Check className="w-3 h-3" /> : <Users className="w-3 h-3" />}
          {sent ? 'Sent!' : 'Invite'}
        </button>
      </form>
    </div>
  )
}
