'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import PropertyForm from '@/components/PropertyForm'
import type { Property } from '@/lib/types'

export default function EditPropertyPage() {
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
    if (user) {
      const fetchProperty = async () => {
        const { data } = await supabase
          .from('properties')
          .select('*')
          .eq('id', params.id)
          .eq('landlord_id', user.id)
          .single()
        if (!data) {
          router.push('/dashboard')
          return
        }
        setProperty(data)
        setLoading(false)
      }
      fetchProperty()
    }
  }, [user, authLoading, params.id])

  if (authLoading || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Property</h1>

      <div className="bg-white rounded-2xl p-6 sm:p-8 card-shadow">
        <PropertyForm property={property} />
      </div>
    </div>
  )
}
