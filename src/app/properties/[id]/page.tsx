'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Bed, Bath, Square, Calendar, ChevronLeft,
  ArrowLeft, Loader2, Home, Shield, CheckCircle, XCircle,
  Star, Store, Bus, School, GraduationCap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Property } from '@/lib/types'
import BookingForm from '@/components/BookingForm'
import AIChatbot from '@/components/AIChatbot'
import ReviewsSection from '@/components/ReviewsSection'
import MaintenanceForm from '@/components/MaintenanceForm'

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()
      setProperty(data)
      setLoading(false)
    }
    fetchProperty()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Home className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Property Not Found</h2>
        <p className="text-gray-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="gradient-bg text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    )
  }

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80']

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link
          href="/#properties"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-white">
              <div className="aspect-[16/10] sm:aspect-[16/9] relative">
                <img
                  src={images[currentImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentImage ? 'border-purple-500' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {property.matterport_embed && (
              <div className="bg-white rounded-2xl overflow-hidden card-shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-purple-500" /> 3D Virtual Tour
                  </h3>
                </div>
                <div className="aspect-[16/9]">
                  <iframe src={property.matterport_embed} title="3D Virtual Tour" className="w-full h-full border-0" allowFullScreen loading="lazy" />
                </div>
              </div>
            )}

            {property.video_tour_url && (
              <div className="bg-white rounded-2xl overflow-hidden card-shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Video Tour
                  </h3>
                </div>
                <div className="aspect-[16/9]">
                  <iframe src={property.video_tour_url.replace('watch?v=', 'embed/').split('&')[0]} title="Video Tour" className="w-full h-full border-0" allowFullScreen loading="lazy" />
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 mt-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">{formatPrice(property.price)}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bed className="w-5 h-5 text-purple-500" />
                  <span><strong>{property.bedrooms}</strong> {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bath className="w-5 h-5 text-purple-500" />
                  <span><strong>{property.bathrooms}</strong> {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                </div>
                {property.area_sqft && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Square className="w-5 h-5 text-purple-500" />
                    <span><strong>{property.area_sqft}</strong> sqft</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="w-5 h-5 text-purple-500" />
                  <span className="capitalize"><strong>{property.property_type}</strong></span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span key={amenity} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {property.is_student_housing && (
                <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Student Housing</h2>
                  </div>
                  <p className="text-xs text-gray-600">
                    {property.near_campus && 'Near campus. '}
                    {property.university_area && `Serving ${property.university_area}. `}
                    Affordable student-friendly rental. Contact the landlord for student discounts.
                  </p>
                </div>
              )}

              {property.latitude && property.longitude && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-green-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Neighborhood</h2>
                    {property.neighborhood_score && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3" />
                        {property.neighborhood_score}/100
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5"><Bus className="w-3 h-3 text-green-500" /> Transit nearby</div>
                    <div className="flex items-center gap-1.5"><School className="w-3 h-3 text-green-500" /> Schools nearby</div>
                    <div className="flex items-center gap-1.5"><Store className="w-3 h-3 text-green-500" /> Shopping nearby</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-green-500" /> Prime location</div>
                  </div>
                </div>
              )}

              <div className="mb-6 border-t border-gray-100 pt-6">
                <ReviewsSection propertyId={property.id} />
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                <MaintenanceForm propertyId={property.id} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 card-shadow sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                {property.availability === 'available' ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-semibold text-sm">Available Now</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-semibold text-sm">Currently Booked</span>
                  </>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Property Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{property.property_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <span className="text-sm font-medium text-gray-900">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Bathrooms</span>
                  <span className="text-sm font-medium text-gray-900">{property.bathrooms}</span>
                </div>
                {property.area_sqft && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Area</span>
                    <span className="text-sm font-medium text-gray-900">{property.area_sqft} sqft</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Listed</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(property.created_at)}</span>
                </div>
              </div>

              {property.availability === 'available' ? (
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full gradient-bg text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </button>
              ) : (
                <span
                  className="w-full bg-gray-200 text-gray-500 py-3.5 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Currently Booked
                </span>
              )}

              <div className="mt-4">
                <AIChatbot property={property} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <Shield className="w-3 h-3" />
                Secure booking • Verified listing
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingForm property={property} onClose={() => setShowBooking(false)} />}
    </div>
  )
}
