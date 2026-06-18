'use client'

import { ArrowDown, Search } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80')] bg-cover bg-center opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-600">Trusted by 10,000+ tenants</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Find Your Perfect
            <span className="gradient-text block mt-2">Rental Home</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse thousands of verified rental properties. From cozy studios to luxury villas,
            find the home that matches your lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#properties"
              className="gradient-bg text-white px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </Link>
            <Link
              href="/auth/register"
              className="bg-white text-gray-700 px-8 py-3.5 rounded-full font-semibold text-base border border-gray-200 hover:border-purple-200 hover:text-purple-600 transition-all flex items-center gap-2"
            >
              <ArrowDown className="w-5 h-5" />
              List Your Property
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Properties' },
              { value: '5K+', label: 'Happy Tenants' },
              { value: '500+', label: 'Landlords' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
