'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Loader2 } from 'lucide-react'
import type { Property } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatbotProps {
  property: Property
}

const SYSTEM_PROMPT = `You are RentoraAI, a helpful rental assistant for Rentora. 
Answer questions about the property the user is viewing. Be concise and friendly.
If asked about availability, check the property status provided.
Keep responses brief and professional. You can answer questions about the property details,
booking process, amenities, location, and rental terms. If you don't know something,
suggest the user contact the landlord or admin chat.`

export default function AIChatbot({ property }: AIChatbotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm RentoraAI. Ask me anything about "${property.title}" — availability, amenities, booking, or anything else!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const isAvailabilityQuestion =
      /availab|booked|free|vacant|occupied|taken|reserve|rent/i.test(userMsg)

    let reply = ''

    if (isAvailabilityQuestion) {
      if (property.availability === 'available') {
        reply =
          "Yes, this property is currently **available** for rent! 🎉 You can book it right now by clicking the 'Book Now' button above. Hurry, great properties don't last long!"
      } else {
        reply =
          "Sorry, this property is currently **booked**. 😔 However, you can check out other similar properties on our homepage or use the admin chat for assistance finding alternatives."
      }
    } else {
      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMsg }],
            propertyContext: {
              title: property.title,
              type: property.property_type,
              price: property.price,
              location: property.location,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              amenities: property.amenities,
              availability: property.availability,
            },
          }),
        })
        const data = await res.json()
        reply = data.reply || "I'm not sure about that. Please contact the admin for more details."
      } catch {
        reply = "I'm having trouble connecting right now. Please try again or use the admin chat."
      }
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="gradient-bg text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Ask AI</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col animate-slide-up max-h-[70vh]">
          <div className="gradient-bg p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">RentoraAI</p>
                <p className="text-purple-200 text-xs">Property Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'gradient-bg text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this property..."
                rows={1}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all resize-none"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="gradient-bg text-white p-2.5 rounded-xl disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
