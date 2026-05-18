# Auto Link

Premium AI-powered used car marketplace and dealership CRM for Ranchi and nearby regions.

## What is included

- Next.js app router frontend with dark premium automotive UI
- Smart car listings, filters, sorting chips, EMI estimates, trust badges, and WhatsApp negotiation
- Seller module, wanted cars, upcoming/reels concepts, AI assistant, and finance calculator
- Admin CRM dashboard at `/admin`
- API routes for leads, AI assistant, AI listing generation, search, and pricing estimate
- Prisma PostgreSQL schema for dealers, users, cars, leads, seller submissions, wanted cars, favorites, images, and videos
- Render backend deployment blueprint for the Next.js API routes
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
NODE_ENV="production"
NPM_CONFIG_PRODUCTION="false"

ADMIN_PASSWORD="change-this-admin-password"
ADMIN_SESSION_TOKEN="change-this-long-random-session-token"

GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.0-flash"

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
USE_DATABASE_STORE="true"

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

## Render backend deployment

This project does not need a separate Express backend. The backend is the Next.js API layer in `app/api`, so Render should deploy this same repository as a Node Web Service.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint from this repo, or create a Web Service manually using:
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start -- -p $PORT`
3. Add the production environment variables from `.env.example`.
4. Keep `NPM_CONFIG_PRODUCTION=false` on Render so build-time packages such as Tailwind are installed during `npm ci`.
5. Keep `USE_DATABASE_STORE=true` on Render so cars, deleted ids, and admin leads are written to PostgreSQL instead of local JSON files.
6. Configure Cloudinary variables before using admin image uploads in production. Render's filesystem is not suitable as the permanent upload store.
7. Redeploy the service after changing environment variables.

Current Render backend:

- Service: `auto-link-backend`
- URL: `https://auto-link-backend.onrender.com`
- Health check: `https://auto-link-backend.onrender.com/api/cars`

## Vercel deployment

The Vercel project is connected to this repository as `auto-link`. Pushes to `main` should trigger a Vercel redeploy when Git integration is enabled.

Current Vercel production:

- URL: `https://auto-link-amber.vercel.app`
- Health check: `https://auto-link-amber.vercel.app/api/cars`

Keep the same production environment variables on Vercel and Render so admin storage, uploads, AI generation, and WhatsApp contact flows behave consistently.

## Free-tier setup

- Vercel: host the Next.js website and API routes
- Render: optional Node Web Service host for the same Next.js frontend and API routes
- Neon PostgreSQL: store cars and buyer/seller leads
- Prisma: connect Next.js to Neon PostgreSQL
- Cloudinary: store uploaded car and lead photos
- Gemini API: generate car descriptions
- Firebase: optional future phone/email authentication
- Cloudinary: required for reliable production image uploads

For local admin login, the default password is `sinha@7004780803` until `ADMIN_PASSWORD` is set in `.env.local`.
