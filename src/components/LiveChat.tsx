'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { ChatMessage } from '@/lib/types'

export default function LiveChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!open) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)
      if (data) setMessages(data)
    }
    fetchMessages()

    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setShowForm(false)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    setSending(true)

    await supabase.from('chat_messages').insert({
      sender_name: name,
      sender_email: email || null,
      message: message.trim(),
      is_admin: false,
    })

    setMessage('')
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 sm:right-6 gradient-bg text-white p-3.5 rounded-full shadow-lg shadow-purple-300/50 hover:shadow-xl hover:scale-105 transition-all z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col animate-slide-up max-h-[85vh]">
          <div className="gradient-bg p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Admin Chat</p>
                <p className="text-purple-200 text-xs">We typically reply in minutes</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {showForm ? (
            <form onSubmit={handleStartChat} className="p-4 space-y-3">
              <p className="text-sm text-gray-600 mb-2">Please introduce yourself before chatting.</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
              />
              <button
                type="submit"
                className="w-full gradient-bg text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
              >
                Start Chat
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.is_admin
                          ? 'bg-gray-100 text-gray-800 rounded-bl-md'
                          : 'gradient-bg text-white rounded-br-md'
                      }`}
                    >
                      {!msg.is_admin && (
                        <p className="text-xs opacity-75 mb-0.5">{msg.sender_name}</p>
                      )}
                      {msg.message}
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="gradient-bg text-white p-2.5 rounded-xl disabled:opacity-50 transition-all"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
