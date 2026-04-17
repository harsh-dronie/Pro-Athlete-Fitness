# Requirements: Gym Trainer Backend

## Overview

Backend REST API for a single-trainer gym management platform. Serves a public website and a private admin dashboard. Built with Node.js (Express) and MongoDB (Mongoose).

---

## Requirement 1: Admin Authentication

### User Story
As the gym trainer, I want to log in with a username and password so that I can securely access the admin dashboard.

### Acceptance Criteria

1.1 `POST /api/auth/login` accepts `{ username, password }` and returns a signed JWT on success.

1.2 Invalid credentials return `401 Unauthorized`.

1.3 The JWT is valid for 7 days (configurable via `JWT_EXPIRES_IN` env var).

1.4 All `/api/admin/*` routes require a valid `Authorization: Bearer <token>` header; missing or invalid tokens return `401`.

1.5 The login route is rate-limited to 10 requests per 15 minutes per IP.

1.6 Admin password is stored as a bcrypt hash (cost factor 12); plaintext is never stored.

1.7 A seed script (`scripts/seedAdmin.ts`) creates the single admin document on first deploy.

---

## Requirement 2: Client Management

### User Story
As the trainer, I want to add, view, edit, and delete client records so that I can manage my gym members digitally.

### Acceptance Criteria

2.1 `POST /api/admin/clients` creates a new client with fields: `name` (required), `phone` (required, unique), `email` (optional), `joinDate` (default: today), `planDuration` in months (required, >= 1), `personalTraining` boolean (default: false), `notes` (optional).

2.2 `expiryDate` is automatically calculated as `joinDate + planDuration months` and stored on the client document; it is not accepted as a user input.

2.3 `GET /api/admin/clients` returns all clients, each decorated with a computed `expiryStatus` field (`'active'`, `'expiring_soon'`, or `'expired'`).

2.4 `GET /api/admin/clients/:id` returns a single client by ID with `expiryStatus` included.

2.5 `PUT /api/admin/clients/:id` updates allowed fields; if `planDuration` or `joinDate` changes, `expiryDate` is recalculated automatically.

2.6 `DELETE /api/admin/clients/:id` removes the client and all associated payment records.

2.7 Duplicate `phone` returns `409 Conflict`.

2.8 Missing required fields return `400 Bad Request` with a `details` array listing which fields failed.

---

## Requirement 3: Payment Tracking

### User Story
As the trainer, I want to record payments per client and have the subscription automatically extended so that I can track who has paid and when.

### Acceptance Criteria

3.1 `POST /api/admin/clients/:id/payments` accepts `{ amount, planDuration, paidAt (optional, default: now), notes (optional) }` and creates a `Payment` document.

3.2 Recording a payment extends the client's `expiryDate` using the rule: `newExpiry = MAX(today, currentExpiry) + planDuration months`.

3.3 `Client.lastPaymentDate` is updated to `paidAt` after each payment.

3.4 `GET /api/admin/clients/:id/payments` returns the full payment history for a client, sorted by `paidAt` descending.

3.5 `GET /api/admin/payments/summary` returns counts of clients with at least one payment this month (paid) vs those with none (unpaid), plus the total revenue for the current month.

3.6 `amount` must be > 0; invalid values return `400`.

---

## Requirement 4: Expiry Management

### User Story
As the trainer, I want clients to be automatically categorised by subscription status so that I can quickly see who is active, expiring, or expired.

### Acceptance Criteria

4.1 `expiryStatus` is computed (not stored) on every client read using `classifyExpiry(expiryDate)`.

4.2 Classification rules:
  - `daysUntilExpiry < 0` → `'expired'`
  - `0 <= daysUntilExpiry <= 7` → `'expiring_soon'`
  - `daysUntilExpiry > 7` → `'active'`

4.3 `GET /api/admin/clients` supports an optional `?status=active|expiring_soon|expired` query parameter to filter by expiry status.

4.4 Day boundaries use the start of the current day (midnight local time) for consistent classification.

---

## Requirement 5: Reminder System

### User Story
As the trainer, I want to see which clients are expiring today, in 2 days, or in 7 days so that I can contact them for renewal.

### Acceptance Criteria

5.1 `GET /api/admin/reminders` returns `{ today: [...], in2Days: [...], in7Days: [...] }` where each array contains clients whose `expiryDate` falls within that day's window (start of day to end of day).

5.2 Each client in the reminder response includes at minimum: `_id`, `name`, `phone`, `expiryDate`.

5.3 A client may appear in multiple buckets if the date windows overlap (they won't by design, but the query must be independent per bucket).

5.4 The endpoint returns empty arrays (not errors) when no clients match a window.

5.5 No SMS or WhatsApp messages are sent; the endpoint only returns data.

---

## Requirement 6: Transformations Module

### User Story
As the trainer, I want to upload before/after transformation photos with descriptions so that they appear on the public website.

### Acceptance Criteria

6.1 `POST /api/admin/transformations` accepts `multipart/form-data` with fields: `clientName` (optional), `duration` (required), `resultDescription` (required), `beforeImage` (required file), `afterImage` (required file).

6.2 Uploaded images are stored on the server filesystem under `/uploads/transformations/` and the stored paths are saved in the DB.

6.3 Accepted image types: JPEG, PNG. Max file size: 5MB per file. Violations return `400`.

6.4 `GET /api/transformations` (public, no auth) returns all transformations sorted by `createdAt` descending.

6.5 `DELETE /api/admin/transformations/:id` removes the DB record and the associated image files from disk.

---

## Requirement 7: About Content Management

### User Story
As the trainer, I want to update my profile information (name, bio, milestones, image) so that the public website always shows current content.

### Acceptance Criteria

7.1 `GET /api/about` (public, no auth) returns the current about content document.

7.2 `PUT /api/admin/about` accepts `{ trainerName, bio, milestones: [{ year, description }], profileImage (optional file) }` and upserts the single about document.

7.3 `milestones` is an array; the entire array is replaced on each update.

7.4 If no about document exists yet, `GET /api/about` returns `404` with `{ error: "About content not configured" }`.

7.5 Profile image upload follows the same constraints as transformation images (JPEG/PNG, max 5MB).

---

## Requirement 8: Dashboard Stats

### User Story
As the trainer, I want a single endpoint that gives me key metrics so that I can see the state of my gym at a glance.

### Acceptance Criteria

8.1 `GET /api/admin/dashboard` returns:
  - `totalClients`: count of all client documents
  - `activeClients`: count of clients with `expiryDate > today + 7 days`
  - `expiringSoon`: count of clients with `expiryDate` between today and today + 7 days (inclusive)
  - `monthlyRevenue`: sum of `amount` from all payments where `paidAt` is within the current calendar month

8.2 All four values are computed in a single DB round-trip (aggregation pipeline or parallel queries).

8.3 If there are no payments this month, `monthlyRevenue` returns `0` (not null or undefined).

---

## Requirement 9: Lead Capture (Optional)

### User Story
As the trainer, I want to capture enquiries from the public website so that I can follow up with potential clients.

### Acceptance Criteria

9.1 `POST /api/leads` (public, no auth) accepts `{ name, phone, goal (optional) }` and creates a `Lead` document with `status: 'new'`.

9.2 `GET /api/admin/leads` returns all leads, supporting optional `?status=new|contacted|converted|not_interested` filter, sorted by `createdAt` descending.

9.3 `PUT /api/admin/leads/:id/status` accepts `{ status }` and updates the lead status. Valid values: `'new'`, `'contacted'`, `'converted'`, `'not_interested'`. Invalid values return `400`.

9.4 `name` and `phone` are required; missing values return `400`.

---

## Requirement 10: Cross-Cutting Concerns

### Acceptance Criteria

10.1 All API responses follow a consistent shape: success responses include the resource directly; error responses include `{ error: string, details?: any }`.

10.2 A centralised error handler middleware catches all unhandled errors and returns `500` without leaking stack traces in production (`NODE_ENV=production`).

10.3 CORS is configured to allow requests only from the frontend origin (set via `CORS_ORIGIN` env var).

10.4 MongoDB indexes are created on: `Client.phone` (unique), `Client.expiryDate`, `Payment.clientId`, `Payment.paidAt`, `Lead.status`.

10.5 The server reads all secrets and config from environment variables; a `.env.example` file documents all required variables.

10.6 Static files under `/uploads` are served via `express.static`.
