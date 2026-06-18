'use client'

import { useState, useEffect } from 'react'
import { Star, Flag, Shield, Loader2, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Review } from '@/lib/types'

interface ReviewsSectionProps {
  propertyId: string
}

export default function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', propertyId)
        .eq('is_flagged', false)
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) setReviews(data)
      setLoading(false)
    }
    fetchReviews()
  }, [propertyId])

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const hash = await crypto.subtle?.digest('SHA-256', new TextEncoder().encode(comment + Date.now())).then((h) =>
      Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, '0')).join('')
    )

    await supabase.from('reviews').insert({
      property_id: propertyId,
      guest_name: guestName,
      guest_email: guestEmail || null,
      rating,
      comment,
      blockchain_hash: hash || null,
    })

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
    if (data) setReviews(data)

    setShowForm(false)
    setGuestName('')
    setGuestEmail('')
    setRating(5)
    setComment('')
    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          {reviews.length > 0 && (
            <span className="text-sm text-gray-400">({reviews.length})</span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-all"
        >
          Write Review
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 rounded-xl p-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">{avgRating}</span>
          <span className="text-xs text-gray-400">average rating</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={submitReview} className="bg-gray-50 rounded-xl p-4 space-y-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name *"
              required
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            />
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Your email"
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star className={`w-5 h-5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            required
            rows={3}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30 resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="gradient-bg text-white px-5 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-all disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-purple-600" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {review.guest_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.guest_name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {review.is_verified && (
                    <span className="text-xs text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {review.blockchain_hash && (
                    <span className="text-xs text-purple-600" title={`Hash: ${review.blockchain_hash.slice(0, 16)}...`}>
                      🔒
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
