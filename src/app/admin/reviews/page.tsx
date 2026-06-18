'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Loader2, Flag, Shield, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Review } from '@/lib/types'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(50)
      if (data) setReviews(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const toggleFlag = async (id: string, flagged: boolean) => {
    await supabase.from('reviews').update({ is_flagged: flagged }).eq('id', id)
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_flagged: flagged } : r)))
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Review Moderation</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{reviews.filter((r) => r.is_flagged).length} flagged</span>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl p-4 card-shadow border ${review.is_flagged ? 'border-red-200' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                  {review.guest_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.guest_name}</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-xs ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    {review.is_verified && <Shield className="w-3 h-3 text-green-500 ml-1" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {review.blockchain_hash && (
                  <span className="text-xs text-purple-600" title={review.blockchain_hash.slice(0, 20) + '...'}>🔒</span>
                )}
                <button
                  onClick={() => toggleFlag(review.id, !review.is_flagged)}
                  className={`p-1.5 rounded-lg transition-all ${review.is_flagged ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                  title={review.is_flagged ? 'Unflag' : 'Flag'}
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString()}</span>
              {review.is_flagged && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flag className="w-3 h-3" /> Flagged
                </span>
              )}
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-400">No reviews yet</div>
        )}
      </div>
    </div>
  )
}
