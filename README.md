# Aim Images HD | Luxury Cinema & Photography Studio Platform

A production-ready web platform for **Aim Images HD Photography & Cinema**, engineered with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL with Prisma ORM**.

---

## Brand Architecture & Visual Aesthetics

- **Editorial Luxury**: Dark obsidian & charcoal canvas (`#08090A`, `#101216`), warm off-white typography, radiant gold highlights (`#D4AF37`, `#FFD700`).
- **Visual-First Experience**: High-resolution photography, video stills with play previews, 4K cinema duration badges, and full project case study views.
- **8 Core Disciplines**: Weddings, Haute Couture Fashion, Commercial Films, Live Events, Executive Portraits, Travel & Nature, Music Videos, and Architectural Brand Films.
- **Resilient Hybrid Fallback**: The site works immediately out-of-the-box with rich seeded studio data, and seamlessly switches to live PostgreSQL queries whenever `DATABASE_URL` is set.

---

## Pages & Routes

- `/` — Cinematic hero, featured productions, disciplines, studio standards, behind-the-scenes grid, client endorsements, and WhatsApp concierge.
- `/portfolio` — 8 category filters, video stills, 4K cinema badges, and interactive fullscreen trailer player.
- `/portfolio/[slug]` — Deep project case study with technical specs (ARRI / RED glass used, deliverables), and high-res stills gallery.
- `/services` — 6 structured creative packages with pricing, 4-step workflow timeline, and interactive FAQ accordion.
- `/about` — Studio philosophy, Eddy Ndyanabo and creative directors team roster, on-set photos, and milestone statistics.
- `/contact` — Multi-step project brief form with budget and date selectors + direct WhatsApp instant concierge link.
- `/admin/login` & `/admin/dashboard` — Studio management portal for bookings, inquiries, and password updates.

---

## PostgreSQL Database Setup

### 1. Cloud PostgreSQL (Neon or Supabase - Recommended for Vercel)

1. Create a free PostgreSQL database at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy your PostgreSQL connection string:
   ```bash
   DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Set `DATABASE_URL` in your `.env` file (and in the **Vercel Project Environment Variables** settings).
4. Push the schema to PostgreSQL:
   ```bash
   npx prisma db push
   ```
5. Seed the database with initial studio productions:
   ```bash
   npm run db:seed
   ```

### 2. Local PostgreSQL (Docker or native)

1. Ensure PostgreSQL is running on `localhost:5432`:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aimimages?schema=public"
   ```
2. Run migrations:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

---

## Local Development

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Build for production
npm run build
```

---

## Deployment to Vercel

The application is fully configured for zero-config deployment on Vercel:
- Connected to GitHub: `https://github.com/ndyanaboeddy512-lgtm/aimimages`
- Production domain: `https://aimimages.vercel.app`
- Auto-deploys upon `git push origin main`.
