'use client'

import { ArrowDown, Search } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=75')] bg-cover bg-center scale-105" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white/80">Trusted by 10,000+ tenants</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Find Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 block mt-2">Rental Home</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse thousands of verified rental properties. From cozy studios to luxury villas,
            find the home that matches your lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#properties"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </a>
            <a
              href="/auth/register"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-semibold text-base border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <ArrowDown className="w-5 h-5" />
              List Your Property
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Properties' },
              { value: '5K+', label: 'Happy Tenants' },
              { value: '500+', label: 'Landlords' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
