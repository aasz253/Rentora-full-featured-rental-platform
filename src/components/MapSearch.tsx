'use client'

import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet'
import { Loader2, Maximize2, Minimize2 } from 'lucide-react'
import type { Property } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

interface PolygonMapSearchProps {
  properties: Property[]
  onFilterChange: (filteredIds: string[]) => void
}

function MapBoundsUpdater({ properties }: { properties: Property[] }) {
  const map = useMap()
  useEffect(() => {
    if (properties.length === 0) return
    const bounds = properties
      .filter((p) => p.latitude && p.longitude)
      .map((p) => [p.latitude!, p.longitude!] as [number, number])
    if (bounds.length > 0) map.fitBounds(bounds, { padding: [50, 50] })
  }, [properties, map])
  return null
}

export default function PolygonMapSearch({ properties, onFilterChange }: PolygonMapSearchProps) {
  const [expanded, setExpanded] = useState(false)
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  const geoProperties = properties.filter((p) => p.latitude && p.longitude)

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (!isDrawing) return
        setPolygonPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]])
      },
    })
    return null
  }

  const clearPolygon = () => {
    setPolygonPoints([])
    onFilterChange(properties.map((p) => p.id))
  }

  const applyPolygonFilter = useCallback(() => {
    if (polygonPoints.length < 3) return
    const insideIds = properties.filter((p) => {
      if (!p.latitude || !p.longitude) return false
      return isPointInPolygon([p.latitude, p.longitude], polygonPoints)
    }).map((p) => p.id)
    onFilterChange(insideIds)
  }, [polygonPoints, properties, onFilterChange])

  useEffect(() => {
    if (polygonPoints.length >= 3) applyPolygonFilter()
  }, [polygonPoints, applyPolygonFilter])

  useEffect(() => { clearPolygon() }, [properties])

  return (
    <div className={`${expanded ? 'fixed inset-0 z-50 p-4 bg-black/50' : ''}`}>
      <div className={`bg-white rounded-2xl card-shadow overflow-hidden ${expanded ? 'h-full' : 'h-64'}`}>
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            <span className="text-sm font-semibold text-gray-900">Map Search</span>
            <span className="text-xs text-gray-400">{geoProperties.length} properties</span>
          </div>
          <div className="flex items-center gap-2">
            {polygonPoints.length >= 3 && (
              <button onClick={clearPolygon} className="text-xs text-red-500 hover:text-red-600 px-2 py-1 bg-red-50 rounded-lg">
                Clear Polygon
              </button>
            )}
            <button onClick={() => setIsDrawing(!isDrawing)}
              className={`text-xs px-2 py-1 rounded-lg ${isDrawing ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
              {isDrawing ? 'Drawing...' : 'Draw'}
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className={`${expanded ? 'h-[calc(100%-48px)]' : 'h-[calc(256px-48px)]'}`}>
          <MapContainer center={[39.8283, -98.5795]} zoom={4} className="h-full w-full" scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundsUpdater properties={geoProperties} />
            <MapEvents />
            {geoProperties.map((p) => (
              <Polygon key={p.id} positions={[[p.latitude!, p.longitude!]]} color="#4a00e0" weight={1} />
            ))}
            {polygonPoints.length >= 3 && (
              <Polygon positions={polygonPoints} color="#8e2de2" fillColor="#8e2de2" fillOpacity={0.15} weight={2} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}
