import { Home, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2">
              <div className="gradient-bg p-2 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Rentora</span>
            </a>
            <p className="text-sm leading-relaxed">
              Your trusted platform for finding the perfect rental home. Browse thousands of properties across the country.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/#properties" className="hover:text-white transition-colors">Properties</a></li>
              <li><a href="/auth/login" className="hover:text-white transition-colors">Landlord Portal</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/?type=house" className="hover:text-white transition-colors">Houses</a></li>
              <li><a href="/?type=apartment" className="hover:text-white transition-colors">Apartments</a></li>
              <li><a href="/?type=studio" className="hover:text-white transition-colors">Studios</a></li>
              <li><a href="/?type=villa" className="hover:text-white transition-colors">Villas</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                San Francisco, CA
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                hello@rentora.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Rentora. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
