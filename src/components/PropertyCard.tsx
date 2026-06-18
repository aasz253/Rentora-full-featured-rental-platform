'use client'

import { Bed, Bath, MapPin, Square, Home } from 'lucide-react'
import type { Property } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  featured?: boolean
}

export default function PropertyCard({ property, featured }: PropertyCardProps) {
  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'

  return (
    <a href={`/properties/${property.id}`} className="block">
      <div className={cn(
        "group bg-white rounded-2xl overflow-hidden card-shadow cursor-pointer",
        featured && "ring-2 ring-purple-400/50"
      )}>
        <div className="relative h-52 sm:h-56 overflow-hidden">
          <img
            src={image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold capitalize">
              {property.property_type}
            </span>
            {property.is_student_housing && (
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Student
              </span>
            )}
            {property.availability === 'available' ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Available
              </span>
            ) : (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Booked
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="text-white text-lg font-bold drop-shadow-lg">
              {formatPrice(property.price)}<span className="text-sm font-normal">/mo</span>
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight line-clamp-1">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {property.description}
          </p>

          <div className="flex items-center gap-4 text-gray-500 text-xs sm:text-sm border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="w-4 h-4" />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
