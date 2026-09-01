# Bison TradeWorks

Laravel + Inertia (React) + MySQL marketing site with admin panel, product catalogue, EN/ES support, and SEO optimization.

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8

## Setup

1. Copy environment file and configure MySQL credentials:

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env`:

```
DB_CONNECTION=mysql
DB_DATABASE=bison_tradeworks
DB_USERNAME=root
DB_PASSWORD=your_password

MAIL_MAILER=log
ADMIN_EMAIL=contact@bisontradeworks.com
ADMIN_PASSWORD=password
```

2. Create the database:

```sql
CREATE DATABASE bison_tradeworks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Install dependencies and migrate:

```bash
composer install
npm install --legacy-peer-deps
php artisan migrate --seed
php artisan sitemap:generate
npm run build
```

4. Start the development server:

```bash
php artisan serve
npm run dev
```

## Default admin login

- Email: `contact@bisontradeworks.com`
- Password: value of `ADMIN_PASSWORD` in `.env` (default: `password`)

## Key routes

| URL | Purpose |
|-----|---------|
| `/` | Home |
| `/brands` | For Brands |
| `/retailers` | For Retailers |
| `/catalogue` | Product catalogue |
| `/manufacturers` | For Manufacturers |
| `/about` | About |
| `/contact` | Contact form |
| `/admin` | Admin dashboard |
| `/admin/audit` | Audit log (all site actions) |
| `/login` | Admin login |

## Image uploads

All admin uploads are stored directly in:

```
public/images/dynamic-images/{folder}/{filename}
```

No `storage:link` is required.

## Reference files

Original client prototype and scope documents are in `/reference`.
