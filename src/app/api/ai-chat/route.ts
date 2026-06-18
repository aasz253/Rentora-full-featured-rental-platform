import { NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PropertyContext {
  title: string
  type: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  amenities: string[]
  availability: string
}

export async function POST(request: Request) {
  try {
    const { messages, propertyContext } = await request.json() as {
      messages: Message[]
      propertyContext: PropertyContext
    }

    const systemPrompt = `You are RentoraAI, a helpful rental assistant for Rentora real estate platform.
You are helping a user who is viewing the property: "${propertyContext.title}"

Property Details:
- Type: ${propertyContext.type}
- Price: $${propertyContext.price}/month
- Location: ${propertyContext.location}
- Bedrooms: ${propertyContext.bedrooms}
- Bathrooms: ${propertyContext.bathrooms}
- Amenities: ${propertyContext.amenities.join(', ') || 'Not specified'}
- Availability: ${propertyContext.availability}

Rules:
- Be concise, friendly, and professional.
- Answer questions about the property, booking process, amenities, and location.
- If asked about availability, state whether it's available or booked based on the data above.
- If you don't know something, suggest contacting the admin via live chat.
- Keep responses brief (2-3 sentences max).
- Do not make up any information not provided in the property details.`

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    ]

    const openRouterKey = process.env.OPENROUTER_API_KEY

    if (!openRouterKey) {
      return NextResponse.json({
        reply: "I'm sorry, the AI service is not configured. Please contact the admin for assistance.",
      })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'Rentora',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: apiMessages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      return NextResponse.json({
        reply: "I'm having trouble thinking right now. Please try again or use the admin chat.",
      })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      return NextResponse.json({
        reply: "I'm not sure how to answer that. Can you rephrase or ask the admin?",
      })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({
      reply: 'Sorry, something went wrong. Please try again or use the admin chat.',
    })
  }
}
