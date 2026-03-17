# MediTrack POS

MediTrack POS is a Next.js 16 pharmacy point-of-sale app with Prisma 6 and PostgreSQL.

## Requirements

- Node.js 20.9+
- A PostgreSQL database
- Recommended free stack: Vercel for the app and Neon for the database

## Environment Variables

Copy `.env.example` to `.env` and replace the placeholder values.

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

- `DATABASE_URL`: pooled connection string used by the app
- `DIRECT_URL`: direct connection string used by Prisma migrations
- If your database provider only gives you one URL, you can use the same value for both while setting up

## Local Setup

```bash
npm install
npm run db:setup
npm run dev
```

Open http://localhost:3000 after the server starts.

## Database Notes

- The app now targets PostgreSQL instead of SQLite.
- The old SQLite migration history has been moved to `prisma/migrations_sqlite_archive`.
- The local `prisma/dev.db` file is kept only as a legacy snapshot. It is not used once you switch to PostgreSQL.
- `npm run db:setup` applies the baseline migration and seeds the demo accounts and medicines.

## Deploying with Neon and Vercel

1. Create a Neon database.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Run `npm run db:setup` once against the Neon database.
5. Add the same environment variables in Vercel.
6. Deploy the app.

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
```
