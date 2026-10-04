# Airbnb Clone

A full-stack Airbnb-style booking platform built with **Next.js 13 (App Router)**, **Prisma** and **MongoDB**.

## Features

- Browse, filter and favorite property listings, with map location (Leaflet)
- Reservations, reviews and notifications
- Auth with NextAuth (credentials + OAuth), password reset flow
- Image upload via Cloudinary
- **Admin dashboard**: manage users, properties and bookings; revenue analytics by category and country (Recharts)

## Tech stack

`Next.js 13` `React 18` `TypeScript` `Tailwind CSS` `Radix UI` `Prisma` `MongoDB` `NextAuth` `Zustand` `Cloudinary`

## Getting started

```bash
npm install
# create .env with DATABASE_URL, NEXTAUTH_SECRET, OAuth and Cloudinary keys
npx prisma db push
npm run dev
```

Open http://localhost:3000.
