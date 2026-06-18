'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, CheckCircle, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  existingImages?: string[]
}

export default function ImageUpload({ onImagesChange, existingImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadToSupabase = async (file: File) => {
    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `properties/${fileName}`

    const { data, error: uploadError } = await supabase.storage
      .from('rentora-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      if (uploadError.message.includes('bucket')) {
        setError('Storage bucket not found. Ask admin to create "rentora-images" bucket.')
      } else {
        setError(uploadError.message)
      }
      setUploading(false)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('rentora-images')
      .getPublicUrl(filePath)

    setUploading(false)
    return publicUrl
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be under 5MB')
        continue
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        continue
      }
      const url = await uploadToSupabase(file)
      if (url) newUrls.push(url)
    }

    const updated = [...images, ...newUrls]
    setImages(updated)
    onImagesChange(updated)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx)
    setImages(updated)
    onImagesChange(updated)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Property Images</label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={url} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
            <button type="button" onClick={() => removeImage(idx)}
              className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
          className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50/30 transition-all flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-purple-500 disabled:opacity-50">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          ) : (
            <>
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs">Add Image</span>
            </>
          )}
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <p className="text-xs text-gray-400">Supports JPG, PNG, WebP up to 5MB each. Images stored in Supabase Storage.</p>
    </div>
  )
}
