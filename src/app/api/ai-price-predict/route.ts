import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { location, bedrooms, bathrooms, propertyType, areaSqft } = await request.json()

    const prompt = `You are a real estate pricing AI. Given the following rental property details, suggest an optimal monthly rent price in USD.

Property Details:
- Location: ${location}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Type: ${propertyType || 'apartment'}
- Area: ${areaSqft ? `${areaSqft} sqft` : 'Not specified'}

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "suggestedPrice": number,
  "confidence": "High" | "Medium" | "Low",
  "reasoning": "one sentence explanation",
  "range": { "low": number, "high": number }
}

Base the suggestion on typical US rental market rates for the given location and property type. Be realistic.`

    const openRouterKey = process.env.OPENROUTER_API_KEY

    if (!openRouterKey) {
      const basePrice = parseInt(bedrooms) * 800 + parseInt(bathrooms) * 400 + 1200
      const locationBonus = location.toLowerCase().includes('san francisco') || location.toLowerCase().includes('new york') ? 1000 :
        location.toLowerCase().includes('los angeles') || location.toLowerCase().includes('seattle') ? 600 : 0
      const suggestedPrice = basePrice + locationBonus
      return NextResponse.json({
        prediction: {
          suggestedPrice,
          confidence: 'Medium',
          reasoning: `Based on ${bedrooms} bed / ${bathrooms} bath properties in ${location}.`,
          range: { low: Math.round(suggestedPrice * 0.85), high: Math.round(suggestedPrice * 1.15) },
        },
      })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'Rentora',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error('API error')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    const parsed = JSON.parse(content.replace(/```json|```/g, '').trim())

    return NextResponse.json({ prediction: parsed })
  } catch (error) {
    console.error('Price prediction error:', error)
    return NextResponse.json({
      prediction: {
        suggestedPrice: 2500,
        confidence: 'Low',
        reasoning: 'Using default estimate. Enable OpenRouter API key for AI-powered predictions.',
        range: { low: 2000, high: 3000 },
      },
    })
  }
}
