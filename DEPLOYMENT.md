# Auto Link Deployment Notes

## Live URLs

- GitHub: `https://github.com/AAAAYUSH001/auto-link`
- Vercel production: `https://auto-link-amber.vercel.app`
- Vercel API check: `https://auto-link-amber.vercel.app/api/cars`
- Render backend: `https://auto-link-backend.onrender.com`
- Render API check: `https://auto-link-backend.onrender.com/api/cars`

## Render

Render service details:

- Service name: `auto-link-backend`
- Service id: `srv-d85ae977f7vs73aiga10`
- Runtime: Node
- Instance: Free
- Branch: `main`
- Build command: `npm ci && npm run build`
- Start command: `npm run start -- -p $PORT`

Required Render environment variables:

```env
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false
USE_DATABASE_STORE=true
ADMIN_PASSWORD=...
ADMIN_SESSION_TOKEN=...
DATABASE_URL=...
NEXT_PUBLIC_WHATSAPP_NUMBER=917004780803
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
```

`NPM_CONFIG_PRODUCTION=false` is required on Render because the build uses Tailwind and other build-time packages. `USE_DATABASE_STORE=true` is required so admin cars, deleted ids, and leads persist in PostgreSQL instead of local JSON files.

## Vercel

Vercel project details:

- Project name: `auto-link`
- Production URL: `https://auto-link-amber.vercel.app`
- Git branch: `main`

Vercel should use the same application environment values as Render, except it does not need `NPM_CONFIG_PRODUCTION=false` unless the Vercel project is explicitly configured to skip dev dependencies.

## Storage

- PostgreSQL/Neon stores JSON-backed admin cars, deleted listing ids, and admin leads through the `JsonStore` table.
- Cloudinary stores uploaded car images.
- Local `storage/*.json` and `public/uploads` are only development fallbacks.

## Redeploy Checklist

1. Confirm the latest code is pushed to `main`.
2. Confirm Render env vars are present.
3. Confirm Vercel env vars are present.
4. Trigger redeploys if auto-deploy does not start.
5. Verify:
   - `https://auto-link-amber.vercel.app/api/cars`
   - `https://auto-link-backend.onrender.com/api/cars`
