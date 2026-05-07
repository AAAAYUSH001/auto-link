# Auto Link

Premium AI-powered used car marketplace and dealership CRM for Ranchi and nearby regions.

## What is included

- Next.js app router frontend with dark premium automotive UI
- Smart car listings, filters, sorting chips, EMI estimates, trust badges, and WhatsApp negotiation
- Seller module, wanted cars, upcoming/reels concepts, AI assistant, and finance calculator
- Admin CRM dashboard at `/admin`
- API routes for leads, AI assistant, AI listing generation, search, and pricing estimate
- Prisma PostgreSQL schema for dealers, users, cars, leads, seller submissions, wanted cars, favorites, images, and videos
- PWA manifest and local SEO metadata focused on Ranchi/Jharkhand

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

Create `.env.local` when connecting real services:

```env
ADMIN_PASSWORD="change-this-admin-password"
ADMIN_SESSION_TOKEN="change-this-long-random-session-token"

GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.0-flash"

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

NEXT_PUBLIC_WHATSAPP_NUMBER="917004780803"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

Without `GEMINI_API_KEY`, AI routes return deterministic demo results so the platform remains usable.

## Production next steps

- Replace demo data in `lib/data.ts` with Prisma queries
- Add Firebase Auth or NextAuth session middleware
- Connect Cloudinary signed uploads for seller/admin images and reels
- Add analytics persistence for views, clicks, and lead sources
- Add dealer roles and permission guards around `/admin`

## Free-tier setup

- Vercel: host the Next.js website and API routes
- Neon PostgreSQL: store cars and buyer/seller leads
- Prisma: connect Next.js to Neon PostgreSQL
- Cloudinary: store uploaded car and lead photos
- Gemini API: generate car descriptions
- Firebase: optional future phone/email authentication
- Render: optional separate backend later if needed

For local admin login, the default password is `sinha@7004780803` until `ADMIN_PASSWORD` is set in `.env.local`.
