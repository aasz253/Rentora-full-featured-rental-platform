# Rentora 🏠

A full-featured real estate rental platform built with **Next.js 15**, **Supabase**, and **Tailwind CSS v4**.

## ✨ Features

### Core
- **Browse & Search** — Property cards, filters by location/price/type, compare tool
- **Property Details** — Image gallery, AI chatbot, reviews, maintenance requests, neighborhood scores
- **Booking System** — Multi-step booking with payment (M-Pesa, PayPal, Bank Transfer)
- **AI Price Predictor** — OpenRouter GPT-4o-mini suggests market prices (or smart formula fallback)
- **User Roles** — Tenants (browse), Landlords (manage), Admin (full control panel)

### Admin Panel (8 pages)
| Page | Description |
|---|---|
| Dashboard | Stats: properties, landlords, bookings, visitors, revenue, banned |
| Landlords | Search, ban/unban with toggle |
| Properties | Search, inline edit price & availability |
| Bookings | Search by name/email/ref |
| Payments | View all transactions, confirm/refund |
| Maintenance | Status dropdown (open→in-progress→resolved→closed) |
| Reviews | Flag/unflag moderation, SHA-256 blockchain hash |
| Notifications | Real-time via Supabase channels |
| Visitors | Page URL, referrer, device tracking |

### Payments
- **M-Pesa STK Push** — Phone input → STK Push (sandbox/production)
- **PayPal** — Redirect → approval → capture
- **Bank Transfer** — Account details displayed → admin confirmation

### Advanced
- Live Chat (Supabase realtime)
- PWA (offline cache via service worker)
- Referral program (auto-generated codes, $50 rewards)
- Saved search alerts (cron-powered email notifications)
- Visitor tracking (cookie-based)

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- A Supabase project (free tier: [supabase.com](https://supabase.com))
- (Optional) OpenRouter API key: [openrouter.ai](https://openrouter.ai)
- (Optional) Resend API key for emails: [resend.com](https://resend.com)

### 2. Clone & Install
```bash
git clone <your-repo>
cd rentora
npm install
```

### 3. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional — AI features
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional — Payments (demo mode works without these)
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_ENV=sandbox

# Optional — Email
RESEND_API_KEY=your_resend_key

# Required for production
SITE_URL=http://localhost:3000

# Bank details shown to users (change these)
BANK_NAME=Chase Bank
BANK_ACCOUNT_NAME=Rentora Holdings Ltd
BANK_ACCOUNT_NUMBER=1234567890
BANK_BRANCH_CODE=010010
BANK_SWIFT_CODE=CHASUS33
```

### 4. Database Setup
1. Go to your Supabase project → SQL Editor
2. Run `supabase/schema.sql` (creates all tables, RLS policies, indexes, triggers)
3. (Optional) Run `supabase/seed.sql` for 12 sample properties

### 5. Storage Bucket
In Supabase Dashboard → Storage:
- Create bucket `rentora-images` (public)
- Add policy: `(bucket_id = 'rentora-images'::text)`

### 6. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 7. Create Admin User
1. Sign up via the app
2. In Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## 🧪 Testing Demo Payments
Without live API keys, all payment methods use **demo mode**:
- M-Pesa: Click "Simulate Payment" — instantly completes with `DEMO-MPESA-xxx` receipt
- PayPal: Click "Demo Payment" — instantly captures with `DEMO-PAYPAL-xxx` order
- Bank Transfer: Copy details, enter reference, admin confirms via dashboard

## ☁️ Deploy to Vercel

### One-click
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual
```bash
vercel --prod
```
Set all environment variables in Vercel dashboard → Settings → Environment Variables.

### Cron Jobs
The saved search alerts endpoint runs every 6 hours via `vercel.json`:
```
POST /api/send-alerts → every 6 hours
```

## 🗄️ Architecture

```
src/
├── app/
│   ├── admin/           # 8 admin pages (protected layout)
│   ├── api/             # 20 REST endpoints
│   ├── auth/            # Login, register, callback
│   ├── dashboard/       # Landlord dashboard
│   └── properties/      # Property detail pages
├── components/
│   ├── AIChatbot.tsx    # Property-aware AI assistant
│   ├── AIPricePredictor.tsx
│   ├── BookingForm.tsx  # Multi-step booking → payment
│   ├── CompareTool.tsx  # Side-by-side property comparison
│   ├── ImageUpload.tsx  # Supabase Storage uploader
│   ├── LiveChat.tsx     # Real-time admin chat
│   ├── MaintenanceForm.tsx
│   ├── PaymentModal.tsx # M-Pesa/PayPal/Bank Transfer
│   ├── PropertyForm.tsx # Create/edit properties
│   ├── ReviewsSection.tsx # SHA-256 hashed reviews
│   └── SocialLogin.tsx  # Google + Apple OAuth
├── context/
│   └── AuthContext.tsx  # Global auth state + ban check
└── lib/
    ├── email.ts         # Resend integration
    ├── supabase.ts      # Browser + SSR clients
    ├── types.ts         # 15+ TypeScript interfaces
    └── utils.ts         # Helpers (formatPrice, cn, etc.)
```

## 🔒 Security
- **RLS Policies** — Every table has row-level security
- **Ban System** — Banned landlords cannot log in or manage properties
- **Admin Isolation** — Admin panel routes check role server-side
- **Input Validation** — All API routes sanitize inputs
- **HTTPS Only** — Force HTTPS in production

## 🧪 Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + OAuth) |
| AI | OpenRouter (GPT-4o-mini) |
| Payments | M-Pesa, PayPal, Bank Transfer |
| Email | Resend |
| Hosting | Vercel |
| Storage | Supabase Storage |

## 📄 License
MIT
# Rentora-full-featured-rental-platform
# Rentora-full-featured-rental-platform
# Rentora-full-featured-rental-platform
