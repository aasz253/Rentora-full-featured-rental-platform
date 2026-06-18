'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Home, BarChart3, X, CheckSquare } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import SearchBar from '@/components/SearchBar'
import PropertyCard from '@/components/PropertyCard'
import CompareModal from '@/components/CompareTool'
import SavedSearchBar from '@/components/SavedSearchBar'
import PolygonMapSearch from '@/components/MapSearch'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import type { Property, PropertyFilters } from '@/lib/types'

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())
  const [showCompare, setShowCompare] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [mapFilteredIds, setMapFilteredIds] = useState<string[] | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) {
        setProperties(data)
        setFilteredProperties(data)
      }
      setLoading(false)
    }
    fetchProperties()
  }, [])

  const handleSearch = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters)
    let filtered = [...properties]

    if (newFilters.location) {
      const loc = newFilters.location.toLowerCase()
      filtered = filtered.filter((p) => p.location.toLowerCase().includes(loc))
    }
    if (newFilters.propertyType) {
      filtered = filtered.filter((p) => p.property_type === newFilters.propertyType)
    }
    if (newFilters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= newFilters.minPrice!)
    }
    if (newFilters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= newFilters.maxPrice!)
    }

    setFilteredProperties(filtered)
  }, [properties])

  const handleMapFilter = useCallback((ids: string[]) => {
    setMapFilteredIds(ids)
    setFilteredProperties(properties.filter((p) => ids.includes(p.id)))
  }, [properties])

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 4) next.add(id)
      return next
    })
  }

  const compareProperties = properties.filter((p) => compareIds.has(p.id))

  return (
    <div>
      <HeroSection />

      <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Browse Properties
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Find your dream home from our curated collection of rental properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SavedSearchBar filters={filters} />
            {compareIds.size >= 2 && (
              <button
                onClick={() => setShowCompare(true)}
                className="gradient-bg text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                Compare ({compareIds.size})
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-8">
          <PolygonMapSearch properties={filteredProperties} onFilterChange={handleMapFilter} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No properties found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, i) => (
              <div key={property.id} className="relative animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <button
                  onClick={(e) => { e.preventDefault(); toggleCompare(property.id) }}
                  className={`absolute top-3 right-3 z-10 p-1.5 rounded-lg transition-all ${
                    compareIds.has(property.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/80 text-gray-400 hover:text-purple-600'
                  }`}
                  title={compareIds.has(property.id) ? 'Remove from compare' : 'Add to compare'}
                >
                  {compareIds.has(property.id) ? <X className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                </button>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </section>

      {showCompare && (
        <CompareModal properties={compareProperties} onClose={() => setShowCompare(false)} />
      )}
    </div>
  )
}
