'use client'

import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { PropertyFilters, PropertyType } from '@/lib/types'

interface SearchBarProps {
  onSearch: (filters: PropertyFilters) => void
}

const propertyTypes: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'villa', label: 'Villa' },
]

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = useCallback(() => {
    const filters: PropertyFilters = {}
    if (location.trim()) filters.location = location.trim()
    if (propertyType) filters.propertyType = propertyType as PropertyType
    if (minPrice) filters.minPrice = parseInt(minPrice)
    if (maxPrice) filters.maxPrice = parseInt(maxPrice)
    onSearch(filters)
  }, [location, propertyType, minPrice, maxPrice, onSearch])

  const clearFilters = () => {
    setLocation('')
    setPropertyType('')
    setMinPrice('')
    setMaxPrice('')
    onSearch({})
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-purple-100/50 border border-purple-50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="gradient-bg text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType | '')}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price</label>
              <input
                type="number"
                placeholder="$10,000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
