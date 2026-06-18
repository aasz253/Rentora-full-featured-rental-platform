'use client'

import { useState, useRef, useEffect } from 'react'
import { FileText, Pen, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface DigitalLeaseSigningProps {
  bookingId: string
  propertyTitle: string
  guestName: string
  monthlyRent: number
  depositAmount: number
  moveInDate: string
  onComplete: () => void
}

export default function DigitalLeaseSigning({
  bookingId, propertyTitle, guestName, monthlyRent, depositAmount, moveInDate, onComplete,
}: DigitalLeaseSigningProps) {
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const supabase = createClient()

  const leaseEnd = new Date(moveInDate)
  leaseEnd.setFullYear(leaseEnd.getFullYear() + 1)

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => setIsDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignature(null)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setSignature(canvas.toDataURL())
  }

  const handleSign = async () => {
    if (!signature) return
    setLoading(true)
    await supabase.from('leases').insert({
      booking_id: bookingId,
      lease_start_date: moveInDate,
      lease_end_date: leaseEnd.toISOString().split('T')[0],
      monthly_rent: monthlyRent,
      deposit_amount: depositAmount,
      signature_tenant: signature,
      signed_by_tenant: true,
      tenant_signed_at: new Date().toISOString(),
      status: 'sent',
      terms: 'Standard lease agreement. Rent due on the 1st of each month. 60-day notice required for move-out. No subletting without landlord approval.',
    })
    setLoading(false)
    setSigned(true)
    onComplete()
  }

  if (signed) return null

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Digital Lease Signing</h3>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-4 max-h-40 overflow-y-auto">
        <p className="font-medium text-gray-900">LEASE AGREEMENT</p>
        <p>Between <strong>Rentora Holdings</strong> (Landlord) and <strong>{guestName}</strong> (Tenant)</p>
        <p>Property: <strong>{propertyTitle}</strong></p>
        <p>Term: <strong>{new Date(moveInDate).toLocaleDateString()}</strong> to <strong>{leaseEnd.toLocaleDateString()}</strong></p>
        <p>Monthly Rent: <strong>${monthlyRent.toLocaleString()}</strong></p>
        <p>Security Deposit: <strong>${depositAmount.toLocaleString()}</strong></p>
        <p className="text-xs text-gray-400 mt-2">Standard lease agreement. Rent due on the 1st of each month. 60-day notice required for move-out. No subletting without landlord approval.</p>
      </div>

      <p className="text-sm font-medium text-gray-700 mb-2">Sign below:</p>
      <canvas
        ref={canvasRef}
        width={400} height={120}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full border border-gray-300 rounded-xl bg-white touch-none cursor-crosshair"
      />
      <div className="flex gap-2 mt-2 mb-4">
        <button onClick={clearCanvas} className="text-xs text-gray-500 hover:text-red-500 px-3 py-1.5 bg-gray-100 rounded-lg">Clear</button>
        <button onClick={saveSignature} className="text-xs text-purple-600 hover:text-purple-700 px-3 py-1.5 bg-purple-50 rounded-lg ml-auto">Save Signature</button>
      </div>

      {signature && (
        <div className="mb-4 p-3 bg-green-50 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700">Signature captured</span>
        </div>
      )}

      <button onClick={handleSign} disabled={loading || !signature}
        className="w-full gradient-bg text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pen className="w-4 h-4" />}
        {loading ? 'Submitting...' : 'Sign Lease Agreement'}
      </button>
    </div>
  )
}
