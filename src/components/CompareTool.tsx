'use client'

import { useState, useCallback } from 'react'
import { X, Bed, Bath, Square, MapPin, BarChart3 } from 'lucide-react'
import type { Property } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export function useCompare() {
  const [selected, setSelected] = useState<Property[]>([])

  const toggle = useCallback((property: Property) => {
    setSelected((prev) =>
      prev.some((p) => p.id === property.id)
        ? prev.filter((p) => p.id !== property.id)
        : prev.length < 4
          ? [...prev, property]
          : prev
    )
  }, [])

  const clear = useCallback(() => setSelected([]), [])

  return { selected, toggle, clear }
}

export default function CompareModal({ properties, onClose }: { properties: Property[]; onClose: () => void }) {
  const bestPricePerSqft = Math.min(
    ...properties.map((p) => (p.area_sqft ? p.price / p.area_sqft : Infinity))
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Compare Properties ({properties.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-4 pr-4 text-gray-400 font-medium w-32">Feature</th>
                {properties.map((p) => (
                  <th key={p.id} className="pb-4 px-3">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=60'}
                      alt=""
                      className="w-full h-32 object-cover rounded-xl mb-2"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={128}
                    />
                    <p className="font-semibold text-gray-900 text-xs truncate">{p.title}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { label: 'Price', value: (p: Property) => formatPrice(p.price) + '/mo' },
                { label: 'Type', value: (p: Property) => p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1) },
                { label: 'Location', value: (p: Property) => p.location, icon: MapPin },
                { label: 'Bedrooms', value: (p: Property) => p.bedrooms, icon: Bed },
                { label: 'Bathrooms', value: (p: Property) => p.bathrooms, icon: Bath },
                { label: 'Area', value: (p: Property) => p.area_sqft ? `${p.area_sqft} sqft` : '-', icon: Square },
                {
                  label: 'Price/sqft',
                  value: (p: Property) =>
                    p.area_sqft ? `$${(p.price / p.area_sqft).toFixed(1)}` : '-',
                  highlight: (p: Property) => p.area_sqft && p.price / p.area_sqft === bestPricePerSqft,
                },
                { label: 'Availability', value: (p: Property) => p.availability },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="py-3 pr-4 text-gray-500 font-medium">{row.label}</td>
                  {properties.map((p) => {
                    const val = row.value(p)
                    const isBest = row.highlight?.(p)
                    return (
                      <td
                        key={p.id}
                        className={`py-3 px-3 ${isBest ? 'text-green-600 font-semibold' : 'text-gray-900'}`}
                      >
                        {String(val)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
