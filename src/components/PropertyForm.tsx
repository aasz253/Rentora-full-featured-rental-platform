'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Ban, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import AIPricePredictor from '@/components/AIPricePredictor'
import ImageUpload from '@/components/ImageUpload'
import type { Property, PropertyType } from '@/lib/types'

interface PropertyFormProps {
  property?: Property
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'villa', label: 'Villa' },
]

const commonAmenities = [
  'WiFi', 'Parking', 'AC', 'Heating', 'Gym', 'Pool',
  'Laundry', 'Pets Allowed', 'Balcony', 'Elevator', 'Security',
  'Furnished', 'Dishwasher', 'Microwave', 'Refrigerator',
]

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { isBanned, profile } = useAuth()
  const isEditing = !!property

  useEffect(() => {
    if (isBanned && !profile?.banned) return
  }, [isBanned])

  const [title, setTitle] = useState(property?.title || '')
  const [description, setDescription] = useState(property?.description || '')
  const [propertyType, setPropertyType] = useState<PropertyType>(property?.property_type || 'apartment')
  const [price, setPrice] = useState(property?.price?.toString() || '')
  const [location, setLocation] = useState(property?.location || '')
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() || '1')
  const [bathrooms, setBathrooms] = useState(property?.bathrooms?.toString() || '1')
  const [areaSqft, setAreaSqft] = useState(property?.area_sqft?.toString() || '')
  const [images, setImages] = useState<string[]>(property?.images || [])
  const [videoTourUrl, setVideoTourUrl] = useState(property?.video_tour_url || '')
  const [matterportEmbed, setMatterportEmbed] = useState(property?.matterport_embed || '')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property?.amenities || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  if (isBanned) {
    return (
      <div className="text-center py-12">
        <Ban className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Banned</h3>
        <p className="text-sm text-gray-500">Your account has been banned. You cannot add or edit properties. Contact the admin for more information.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    const propertyData = {
      landlord_id: user.id,
      title,
      description,
      property_type: propertyType,
      price: parseFloat(price),
      location,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      area_sqft: areaSqft ? parseInt(areaSqft) : null,
      images,
      video_tour_url: videoTourUrl || null,
      matterport_embed: matterportEmbed || null,
      amenities: selectedAmenities,
      availability: 'available',
    }

    if (isEditing && property) {
      const { error: updateError } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', property.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      const { error: insertError } = await supabase
        .from('properties')
        .insert(propertyData)

      if (insertError) {
        setError(insertError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Modern 2BR Apartment in Downtown"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your property in detail..."
            required
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          >
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (per month)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="2500"
            required
            min={0}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          />
          {!isEditing && (
            <div className="mt-2">
              <AIPricePredictor formData={{ location, bedrooms, bathrooms, propertyType, areaSqft }} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              min={0}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              min={0}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Area (sqft)</label>
            <input
              type="number"
              value={areaSqft}
              onChange={(e) => setAreaSqft(e.target.value)}
              min={0}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
            />
          </div>
        </div>
      </div>

      <ImageUpload onImagesChange={setImages} existingImages={images} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Video Tour URL</label>
          <input type="url" value={videoTourUrl} onChange={(e) => setVideoTourUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Matterport Embed URL</label>
          <input type="url" value={matterportEmbed} onChange={(e) => setMatterportEmbed(e.target.value)}
            placeholder="https://my.matterport.com/show/?m=..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all" />
          <p className="text-xs text-gray-400 mt-1">Paste Matterport share link for 3D virtual tour</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {commonAmenities.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedAmenities.includes(amenity)
                  ? 'gradient-bg text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="gradient-bg text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Add Property'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
