interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[EMAIL] No RESEND_API_KEY set — skipping email to', to)
    return { success: false, message: 'Email not configured' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Rentora <noreply@rentora.app>',
        to,
        subject,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[EMAIL] Send error:', data)
      return { success: false, message: data.message || 'Unknown error' }
    }

    console.log('[EMAIL] Sent to', to, '— id:', data.id)
    return { success: true, id: data.id }
  } catch (err) {
    console.error('[EMAIL] Exception:', err)
    return { success: false, message: String(err) }
  }
}

export function bookingConfirmationHtml(params: {
  guestName: string
  propertyTitle: string
  bookingRef: string
  moveInDate: string
  totalPrice: number
  depositPaid: number
}) {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%); padding: 32px; border-radius: 16px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your reservation is confirmed</p>
      </div>
      <div style="padding: 24px 0;">
        <div style="background: #f5f3ff; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">Booking Reference</p>
          <p style="font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #4a00e0 0%, #8e2de2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0;">${params.bookingRef}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 12px 0; color: #6b7280;">Property</td><td style="padding: 12px 0; font-weight: 500;">${params.propertyTitle}</td></tr>
          <tr><td style="padding: 12px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Guest</td><td style="padding: 12px 0; font-weight: 500; border-top: 1px solid #f3f4f6;">${params.guestName}</td></tr>
          <tr><td style="padding: 12px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Move-in Date</td><td style="padding: 12px 0; font-weight: 500; border-top: 1px solid #f3f4f6;">${params.moveInDate}</td></tr>
          <tr><td style="padding: 12px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Deposit Paid</td><td style="padding: 12px 0; font-weight: 700; color: #4a00e0; border-top: 1px solid #f3f4f6;">$${params.depositPaid.toLocaleString()}</td></tr>
          <tr><td style="padding: 12px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Monthly Rent</td><td style="padding: 12px 0; font-weight: 500; border-top: 1px solid #f3f4f6;">$${params.totalPrice.toLocaleString()}/mo</td></tr>
        </table>
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; text-align: center; margin-top: 24px;">
          <p style="font-size: 13px; color: #6b7280; margin: 0;">Need help?</p>
          <p style="font-size: 13px; color: #4a00e0; margin: 4px 0 0;">Contact support@rentora.app</p>
        </div>
      </div>
    </div>
  `
}

export function alertNotificationHtml(params: {
  query: string
  properties: { title: string; price: number; location: string; url: string }[]
}) {
  const list = params.properties.map(
    (p) => `<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
      <a href="${p.url}" style="color: #4a00e0; text-decoration: none; font-weight: 500;">${p.title}</a>
      <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">${p.location} — $${p.price.toLocaleString()}/mo</p>
    </td></tr>`
  ).join('')

  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%); padding: 32px; border-radius: 16px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Properties Found!</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Matching your saved search: "${params.query}"</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
        ${list}
      </table>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.SITE_URL || 'http://localhost:3000'}/properties" style="display: inline-block; background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%); color: #ffffff; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">View All Properties</a>
      </div>
    </div>
  `
}
