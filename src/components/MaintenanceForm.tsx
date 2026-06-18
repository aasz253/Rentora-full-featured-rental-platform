'use client'

import { useState } from 'react'
import { Wrench, Loader2, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface MaintenanceFormProps {
  propertyId: string
}

export default function MaintenanceForm({ propertyId }: MaintenanceFormProps) {
  const [open, setOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [issue, setIssue] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'emergency'>('medium')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    await supabase.from('maintenance_requests').insert({
      property_id: propertyId,
      guest_email: guestEmail || null,
      issue_description: issue,
      priority,
      status: 'open',
    })

    setSubmitting(false)
    setDone(true)
    setTimeout(() => {
      setOpen(false)
      setDone(false)
      setGuestName('')
      setGuestEmail('')
      setIssue('')
      setPriority('medium')
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
      >
        <Wrench className="w-4 h-4" />
        Report Issue
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full animate-scale-in p-6" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">Issue Reported!</h3>
                <p className="text-sm text-gray-500 mt-1">The landlord will be notified shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 mb-1">Submit Maintenance Request</h3>
                <p className="text-xs text-gray-500 mb-4">Report an issue with this property.</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your name *"
                      required
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                    />
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Your email"
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                    />
                  </div>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="emergency">🚨 Emergency</option>
                  </select>

                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30 resize-none"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full gradient-bg text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
