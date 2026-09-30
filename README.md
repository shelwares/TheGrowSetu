# TheGrowSetu — B2B Demand Aggregation Platform

**TheGrowSetu** is India's B2B demand aggregation platform. Small business owners — retailers, D2C founders, Instagram sellers — join collective buying pools to unlock factory-direct pricing without needing to meet high Minimum Order Quantities (MOQ).

**"The bridge to your business growth."**

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Row-Level Security)
- **Styling:** Tailwind CSS
- **Email:** Brevo (transactional)
- **Hosting:** Vercel

## Key Features

- Dynamic pricing pools (price drops as more buyers join)
- B2B user onboarding with Google OAuth + email/password
- Admin panel for pool management, order tracking, QC status
- MFA (TOTP) for admin security
- DPDP Act compliant privacy & refund policies

## Deploy on Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
