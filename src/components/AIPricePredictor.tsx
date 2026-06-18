'use client'

import { useState } from 'react'
import { Bot, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface PricePrediction {
  suggestedPrice: number
  confidence: 'High' | 'Medium' | 'Low'
  reasoning: string
  range: { low: number; high: number }
}

export default function AIPricePredictor({ formData }: { formData: Record<string, any> }) {
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState<PricePrediction | null>(null)
  const [error, setError] = useState('')

  const predictPrice = async () => {
    if (!formData.location || !formData.bedrooms || !formData.bathrooms) {
      setError('Please fill in location, bedrooms, and bathrooms first.')
      return
    }

    setPredicting(true)
    setError('')

    try {
      const res = await fetch('/api/ai-price-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: formData.location,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          propertyType: formData.propertyType,
          areaSqft: formData.areaSqft,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setPrediction(data.prediction)
      }
    } catch {
      setError('Failed to get prediction. Please try again.')
    }

    setPredicting(false)
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-gray-900">AI Price Predictor</span>
      </div>

      {!prediction ? (
        <>
          <p className="text-xs text-gray-500 mb-3">
            Get an AI-powered price suggestion based on location and property details.
          </p>
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <button
            onClick={predictPrice}
            disabled={predicting}
            className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-all disabled:opacity-70 flex items-center gap-1.5"
          >
            {predicting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
            {predicting ? 'Analyzing market...' : 'Predict Price'}
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Suggested Price</span>
            <div className="flex items-center gap-1">
              {prediction.confidence === 'High' ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : prediction.confidence === 'Medium' ? (
                <Minus className="w-3 h-3 text-yellow-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                prediction.confidence === 'High' ? 'text-green-600' :
                prediction.confidence === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>{prediction.confidence} Confidence</span>
            </div>
          </div>
          <p className="text-2xl font-bold gradient-text">
            ${prediction.suggestedPrice.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/mo</span>
          </p>
          <p className="text-xs text-gray-500">
            Range: ${prediction.range.low.toLocaleString()} – ${prediction.range.high.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 italic">{prediction.reasoning}</p>
        </div>
      )}
    </div>
  )
}
