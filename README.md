# AstroEcomm

AstroEcomm is a Laravel 12 + Inertia React marketplace application. The codebase includes seller accounts, product catalog management, reviews, and reporting screens.

## Tech Stack

- Laravel 12, PHP 8.2+
- Inertia.js with React 19 and TypeScript
- Vite 7, Tailwind CSS, shadcn/ui, Radix UI
- Database: SQLite (default), PostgreSQL/MySQL supported

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+ (20+ recommended)
- A database (SQLite is easiest for local dev)

## Setup

1. Install PHP dependencies

```bash
composer install
```

2. Create .env

Windows (cmd or PowerShell):

```bash
copy .env.example .env
```

macOS or Linux:

```bash
cp .env.example .env
```

3. Generate app key

```bash
php artisan key:generate
```

4. Configure database

SQLite (default):

```bash
type nul > database/database.sqlite
```

Then set in .env:

```
DB_CONNECTION=sqlite
```

5. Run migrations

```bash
php artisan migrate
```

6. Install frontend dependencies

```bash
npm install
```

## Development

Start all services (app server, queue worker, Vite):

```bash
composer dev
```

Or run manually:

```bash
php artisan serve
```

```bash
npm run dev
```

If you need public storage, create the storage link:

```bash
php artisan storage:link
```

## Build

```bash
npm run build
```

## Tests

```bash
composer test
```

## Linting and Types

```bash
npm run lint
npm run format
npm run types
```

## Environment Notes

- Set `APP_DEBUG=false` and `APP_ENV=production` in production.
- Set `APP_URL` to your deployed domain.
- For Sanctum SPA auth, configure `SANCTUM_STATEFUL_DOMAINS` to include your frontend domain.
- If using HTTPS, set `SESSION_SECURE_COOKIE=true`.
- Supabase integration uses `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_BUCKET`.

## Documentation

- Reviews seeder guide: [REVIEWS_SEEDER_GUIDE.md](REVIEWS_SEEDER_GUIDE.md)
- Archived UI notes: [archive/dupl](archive/dupl)
