# Aim Images HD — Production CMS & Database Architecture Guide

This comprehensive guide details the architecture, configuration, operation, and maintenance of the **Aim Images HD Content Management System (CMS)**, PostgreSQL database via Prisma ORM, multi-provider media storage, role-based access control (RBAC), permanent audit trail, revision history, and disaster recovery procedures.

---

## 1. System Architecture Overview

```
+-----------------------------------------------------------------------------+
|                               AIM IMAGES HD                                 |
|                                                                             |
|  +--------------------+        +--------------------+                       |
|  |   Public Website   |        |  Admin Dashboard   |                       |
|  |  (App Router SSR)  |        |    (/admin/*)      |                       |
|  +---------+----------+        +---------+----------+                       |
|            |                             |                                  |
|            |                             | Bearer / HttpOnly JWT Cookie     |
|            v                             v                                  |
|  +--------------------------------------------------+                       |
|  |          Secure Server API Layer (/api/*)         |                       |
|  |  - Auth & RBAC (/api/admin/auth/*)               |                       |
|  |  - Media Library (/api/admin/media/*)            |                       |
|  |  - Projects & Services (/api/admin/projects/*)   |                       |
|  |  - Versioned Settings (/api/admin/settings/*)    |                       |
|  |  - Soft-Delete Trash (/api/admin/trash/*)        |                       |
|  |  - Permanent Audit Log (/api/admin/audit-logs/*) |                       |
|  +--------------------------+-----------------------+                       |
|                             |                                               |
|               +-------------+-------------+                                 |
|               |                           |                                 |
|               v                           v                                 |
|  +--------------------------+  +--------------------------+                 |
|  |      Prisma ORM Layer    |  |  Storage Abstraction Layer|                 |
|  |   (src/lib/db.ts)        |  |   (src/lib/storage.ts)   |                 |
|  +------------+-------------+  +------------+-------------+                 |
|               |                             |                               |
|               v                             v                               |
|  +--------------------------+  +--------------------------+                 |
|  |   PostgreSQL Database    |  |  AWS S3 / Cloudflare R2  |                 |
|  | (Supabase/Neon/Railway)  |  |  Local: /public/uploads/ |                 |
|  +--------------------------+  +--------------------------+                 |
+-----------------------------------------------------------------------------+
```

---

## 2. Role-Based Access Control (RBAC)

The system enforces three hierarchical permission tiers defined in `Role`:

| Role | Access Level | Capabilities |
| :--- | :--- | :--- |
| **`SUPERADMIN`** | Full Studio Authority | Manage team accounts, permanently purge items from Trash, view raw audit diffs, change master keys, full content & media CRUD. |
| **`ADMIN`** | Operations Director | Create/edit/publish projects, services, testimonials; update site settings (booking status, studio address); soft-delete items; restore from Trash; view audit logs. |
| **`EDITOR`** | Content Contributor | Upload photography and cinema reels, draft projects, update descriptions and tags, view inquiries. |

### Session Management
- Sessions use **HS256 signed JSON Web Tokens (JWT)** generated via the high-performance `jose` library.
- Tokens are stored in a secure, `httpOnly`, `sameSite: lax` cookie named `aim_session` with a 7-day expiration.
- Passwords are salted and hashed using `bcryptjs` (10 rounds).

### Initial Admin Credentials
- **Email**: `admin@aimimages.com`
- **Default Master Password**: `aimimages2024`
- **Password Change**: Direct option inside the dashboard under the **Security & Users** tab.

---

## 3. Database Schema (Prisma ORM)

The database schema (`prisma/schema.prisma`) comprises 10 interconnected models:

### 3.1 `User`
```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  passwordHash String
  role         Role      @default(EDITOR)
  status       String    @default("ACTIVE") // ACTIVE, SUSPENDED
  avatar       String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  lastLoginAt  DateTime?
}
```

### 3.2 `MediaItem`
```prisma
model MediaItem {
  id              String    @id @default(cuid())
  title           String
  filename        String
  url             String
  storageKey      String
  storageBucket   String?
  storageProvider String    @default("LOCAL") // LOCAL, S3, R2, SUPABASE
  mimeType        String
  fileSize        Int
  width           Int?
  height          Int?
  isVideo         Boolean   @default(false)
  duration        String?
  posterUrl       String?
  category        String    @default("Weddings")
  tags            String[]
  altText         String?
  caption         String?
  location        String?
  capturedAt      DateTime?
  featured        Boolean   @default(false)
  order           Int       @default(0)
  status          String    @default("PUBLISHED") // DRAFT, PUBLISHED, ARCHIVED
  isDeleted       Boolean   @default(false)
  deletedAt       DateTime?
  deletedBy       String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 3.3 `SiteSetting` & `SettingRevision`
- **`SiteSetting`**: Key-value pairs (`booking_status`, `studio_address`, `contact_whatsapp`, `google_maps_url`, etc.).
- **`SettingRevision`**: Complete JSON snapshot created on every modification, enabling **1-Click Historical Rollback** to any prior version.

### 3.4 `AuditLog`
An immutable log tracking every critical action:
- `action`: `CREATE`, `UPDATE`, `PUBLISH`, `UNPUBLISH`, `SOFT_DELETE`, `RESTORE`, `PERMANENT_DELETE`, `LOGIN`, `SETTINGS_CHANGE`.
- `entityType`: `MediaItem`, `Project`, `Service`, `Testimonial`, `SiteSetting`, `User`.
- `beforeValues` and `afterValues`: JSON diff snapshots.
- `actorEmail`, `actorRole`, `actorId`, `ipAddress`, and `timestamp`.

---

## 4. Media Storage Layer

The storage abstraction (`src/lib/storage.ts`) automatically switches between cloud object storage and local disk storage based on environment variables:

### 4.1 Cloud Object Storage (AWS S3, Cloudflare R2, Supabase)
To enable cloud storage in production, add the following to `.env`:

```bash
# S3 / Cloudflare R2 / Supabase Storage
S3_BUCKET=aimimages-media
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
# For Cloudflare R2:
S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
# Optional CDN public URL prefix:
S3_PUBLIC_URL=https://media.aimimages.com
```

### 4.2 Local Storage Fallback
If S3 environment variables are absent, assets are saved directly into `public/uploads/` on disk, optimized with `sharp`, and served at `/uploads/<filename>`.

---

## 5. Migrations & Seeding

### 5.1 Push Schema to PostgreSQL
To synchronize the schema with a live PostgreSQL database:

```bash
# Push schema directly (recommended for quick deploy)
npx prisma db push

# Generate migration history
npx prisma migrate dev --name init_cms
```

### 5.2 Populate Initial Studio Data
To seed default superadmin accounts, 8 portfolio case studies, 6 services, client testimonials, and studio settings (Kabale, Uganda coordinates & WhatsApp `+256 764 709 563`):

```bash
npm run db:seed
```

---

## 6. Soft-Delete & Trash Recovery Workflow

1. **Soft Delete**: When an admin clicks "Delete" on any media item, project, service, or testimonial, the item is not erased from disk or database. Its `isDeleted` flag is set to `true`, and `deletedAt` and `deletedBy` are recorded.
2. **Review & Restore**: Authorized admins can navigate to the **Trash & Recovery** tab in the dashboard to review soft-deleted assets and restore them with one click.
3. **Permanent Purge**: Only users with the `SUPERADMIN` role can permanently purge items from Trash. Purging:
   - Deletes the binary file from AWS S3, Cloudflare R2, or local storage.
   - Permanently removes the database row.
   - Logs an immutable `PERMANENT_DELETE` entry in `AuditLog` noting the actor, timestamp, and purged asset metadata.

---

## 7. Database Backups & Disaster Recovery

### 7.1 Automated Daily Backup Script (`pg_dump`)
Run the following cron or scheduled command to back up PostgreSQL:

```bash
# Linux / macOS / Docker
pg_dump "$DATABASE_URL" -Fc -f "aimimages_backup_$(date +%Y%m%d_%H%M%S).dump"

# Windows PowerShell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
pg_dump $env:DATABASE_URL -Fc -f "aimimages_backup_$timestamp.dump"
```

### 7.2 Database Restoration (`pg_restore`)
To restore a snapshot into a new database:

```bash
pg_restore --clean --if-exists -d "$DATABASE_URL" aimimages_backup_20260912_020000.dump
```

---

## 8. Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/aimimages?sslmode=require` |
| `JWT_SECRET` | Secret key for signing admin session tokens | Minimum 32 random characters |
| `ADMIN_SECRET_KEY` | Master fallback password | `aimimages2024` |
| `S3_BUCKET` | S3 / R2 Bucket name | `aimimages-assets` |
| `S3_REGION` | Storage Region | `us-east-1` or `auto` |
| `S3_ACCESS_KEY_ID` | Storage Access Key | AWS / R2 API Key |
| `S3_SECRET_ACCESS_KEY` | Storage Secret Key | AWS / R2 Secret |
| `S3_ENDPOINT` | Custom endpoint for R2 or Supabase | `https://<id>.r2.cloudflarestorage.com` |
