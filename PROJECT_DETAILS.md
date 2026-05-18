# Auto Link Project Details

## Project Name

Auto Link

## Purpose

Auto Link is a used-car listing website and lightweight admin CRM for Sinha Auto Link. It helps customers browse available cars, contact the dealer on WhatsApp, and lets the admin add, edit, remove, and manage listings and buyer/seller leads.

## Main Features

- Public used-car listing website
- Admin login page
- Admin dashboard for car upload and listing management
- Edit and remove controls for existing listings
- Buyer lead entry and tracking
- Seller lead entry with optional photo upload
- Gemini-powered car description generation
- WhatsApp contact flow for customers
- EMI calculator
- Cloudinary image upload support
- Vercel deployment support
- Render backend deployment support through `render.yaml`
- Neon/PostgreSQL JSON store support in production

## Important Pages

- `/` - public customer website
- `/admin/login` - admin login
- `/admin` - admin dashboard

## Important API Routes

- `/api/cars` - public car listing data
- `/api/admin/cars` - admin create, edit, list, and remove cars
- `/api/admin/leads` - admin buyer/seller lead storage
- `/api/admin/login` - admin login
- `/api/admin/logout` - admin logout
- `/api/ai/listing` - AI-generated car descriptions
- `/api/leads` - public lead/event capture endpoint

## Current Storage Design

The app currently stores admin cars and admin leads in JSON records through `lib/file-store.ts`.

Local development:

- Cars are stored in `storage/cars.json`
- Deleted built-in car ids are stored in `storage/deleted-cars.json`
- Admin leads are stored in `storage/leads.json`
- Uploaded images are stored in `public/uploads` if Cloudinary is not configured

Production on Vercel:

- Cars, deleted ids, and admin leads are stored in the Neon/PostgreSQL `JsonStore` table when `DATABASE_URL` is available
- Uploaded images are stored in Cloudinary when Cloudinary environment variables are configured
- If Cloudinary is not configured in a serverless runtime, image uploads may fall back to data URLs, which is not recommended for many images

Production on Render:

- Deploy the same Next.js project as a Node Web Service; the backend is already in `app/api`
- Use `render.yaml` as the Render Blueprint, or manually set the same build/start commands
- Set `DATABASE_URL` and `USE_DATABASE_STORE=true` so admin cars and leads persist in PostgreSQL
- Set `NPM_CONFIG_PRODUCTION=false` so Render installs build-time dependencies such as Tailwind during `npm ci`
- Set Cloudinary variables before production uploads, because Render local disk should not be treated as permanent image storage
- Redeploy the Render service after changing environment variables

## Practical Capacity

With the current JSON-based storage design, the app is suitable for a small or medium used-car dealer.

Recommended practical limits:

- Car listings: 500 to 1,000 active/listed cars
- Admin buyer/seller leads: 5,000 to 10,000 leads
- Uploaded photos: best handled by Cloudinary, not stored directly inside the database JSON

Why these limits:

- Each car or lead save rewrites the full JSON list
- Each admin load reads the full list into the page
- Large lead tables will become slower in the browser
- The current UI does not yet have pagination, search, or filters inside the admin lead table

For normal Auto Link usage, such as tens or hundreds of cars and hundreds or a few thousand leads, this setup should work comfortably.

## Scaling Recommendation

If the business grows beyond the practical limits above, move cars and leads from JSON storage into proper database tables using the existing Prisma schema.

Recommended next scaling steps:

- Store cars in the Prisma `Car` table
- Store leads in the Prisma `Lead` table
- Add admin pagination for leads and listings
- Add search and status filters in the admin dashboard
- Add image galleries through `CarImage`
- Add role-based admin users
- Add backup/export for leads

With proper Prisma database tables and pagination, the project can handle much larger usage, such as:

- 10,000+ car listings
- 100,000+ leads
- Multiple dealers or staff accounts

Actual production capacity will still depend on the Neon database plan, Vercel plan, image storage plan, and traffic volume.

## Current Deployment

- GitHub repository: `AAAAYUSH001/auto-link`
- Production host: Vercel
- Production domain: `https://auto-link-amber.vercel.app`
- Backend/API deployment option: Render Web Service using `render.yaml`


## Recent Update

The admin listing zone now supports editing car listings. Admins can click Edit, update the form, save the changes, or cancel the edit. The public car API also avoids duplicate listings when a built-in listing is edited and saved.

The project now includes Render backend deployment configuration. Render should run the same Next.js app with `npm ci && npm run build` and `npm run start -- -p $PORT`, with `NPM_CONFIG_PRODUCTION=false`, `USE_DATABASE_STORE=true`, and Cloudinary configured for reliable production uploads.
