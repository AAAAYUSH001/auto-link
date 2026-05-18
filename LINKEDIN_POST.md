# LinkedIn Post Draft

My dad runs a used-car business, and one of the biggest problems was not the cars. It was the daily system around the cars.

New listings were coming in. Customer enquiries were coming from calls and WhatsApp. Photos had to be shared manually. Leads were hard to track. Editing a car listing meant depending on scattered notes, messages, and repeated manual updates.

So I built Auto Link for him.

It is a used-car marketplace and lightweight admin CRM made specifically for Sinha Auto Link in Ranchi. Customers can browse available cars, check details, estimate EMI, and contact directly on WhatsApp. On the admin side, listings can be added, edited, deleted, and managed from one dashboard.

The technical solution:

- Next.js app with API routes for the backend
- Admin dashboard for car uploads and lead management
- PostgreSQL/Neon-backed storage for production data
- Cloudinary for reliable image uploads
- Gemini integration for AI-generated listing descriptions
- Vercel for the public website
- Render for a live backend/API deployment
- GitHub-based deployment workflow

One issue I had to solve during deployment was production uploads and storage. Local JSON files and local image folders work during development, but they are not reliable on serverless or cloud hosting. I moved the production flow to database-backed JSON storage with `USE_DATABASE_STORE=true` and Cloudinary-hosted uploads, then deployed the same Next.js backend routes on Render.

This project taught me something simple but important: software becomes much more meaningful when it solves a real problem for someone close to you.

Auto Link is live, and I will keep improving it with better lead filters, listing analytics, role-based admin access, and a more scalable Prisma table structure.

Project: Auto Link
Website: https://auto-link-amber.vercel.app
Backend/API: https://auto-link-backend.onrender.com/api/cars

#NextJS #Render #Vercel #Prisma #PostgreSQL #Cloudinary #WebDevelopment #FullStackDevelopment #StudentDeveloper #BuildInPublic
