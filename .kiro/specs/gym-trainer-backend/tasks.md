# Tasks: Gym Trainer Backend

## Implementation Plan

All tasks below map directly to the requirements. Execute in order — each phase builds on the previous.

---

## Phase 1: Project Scaffold & Config

- [x] 1.1 Create `backend/` directory with `package.json` (dependencies: express, mongoose, bcryptjs, jsonwebtoken, multer, cors, dotenv, express-rate-limit; devDependencies: typescript, tsx, @types/express, @types/node, jest, supertest, mongodb-memory-server, fast-check, ts-jest)
- [x] 1.2 Create `backend/tsconfig.json` with strict TypeScript config targeting ES2020, module CommonJS
- [x] 1.3 Create `backend/.env.example` documenting: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `NODE_ENV`
- [x] 1.4 Create `backend/src/config/db.ts` — Mongoose connection with error handling and connection logging
- [x] 1.5 Create `backend/src/server.ts` — Express app setup: JSON body parser, CORS, static `/uploads`, mount routes, error handler, listen

---

## Phase 2: Utilities & Middleware

- [x] 2.1 Create `backend/src/utils/dateHelpers.ts` — implement `calculateExpiry`, `extendExpiry`, `classifyExpiry`, `startOfDay`, `endOfDay`, `addDays`, `startOfMonth`, `endOfMonth`
- [x] 2.2 Create `backend/src/utils/response.ts` — `sendSuccess(res, data, status)` and `sendError(res, message, status, details?)` helpers
- [x] 2.3 Create `backend/src/middleware/auth.ts` — JWT verification middleware; attaches decoded payload to `req.admin`; returns 401 on failure
- [x] 2.4 Create `backend/src/middleware/errorHandler.ts` — centralised Express error handler; hides stack traces in production
- [x] 2.5 Create `backend/src/middleware/upload.ts` — multer config: JPEG/PNG only, max 5MB, destination `uploads/transformations/` and `uploads/about/`

---

## Phase 3: Mongoose Models

- [x] 3.1 Create `backend/src/models/Admin.ts` — schema: `username` (unique), `passwordHash`, `createdAt`
- [x] 3.2 Create `backend/src/models/Client.ts` — schema with all fields per design; indexes on `phone` (unique) and `expiryDate`
- [x] 3.3 Create `backend/src/models/Payment.ts` — schema: `clientId` (ref Client), `amount`, `planDuration`, `paidAt`, `notes`; index on `clientId` and `paidAt`
- [x] 3.4 Create `backend/src/models/Transformation.ts` — schema: `clientName`, `duration`, `resultDescription`, `beforeImageUrl`, `afterImageUrl`, `createdAt`
- [x] 3.5 Create `backend/src/models/AboutContent.ts` — schema: `trainerName`, `bio`, `milestones` (array of `{ year, description }`), `profileImageUrl`, `updatedAt`
- [x] 3.6 Create `backend/src/models/Lead.ts` — schema: `name`, `phone`, `goal`, `status` (enum), `createdAt`, `updatedAt`; index on `status`

---

## Phase 4: Services

- [x] 4.1 Create `backend/src/services/authService.ts` — `verifyCredentials(username, password): Promise<string>` using bcrypt compare + JWT sign; `verifyToken(token): AdminPayload`
- [x] 4.2 Create `backend/src/services/clientService.ts` — `createClient`, `updateClient`, `deleteClient` (cascades payments), `listClients` (with expiryStatus), `getClient`
- [x] 4.3 Create `backend/src/services/paymentService.ts` — `recordPayment` (creates Payment + updates Client.expiryDate + lastPaymentDate), `getPaymentHistory`, `getPaidUnpaidSummary`
- [x] 4.4 Create `backend/src/services/reminderService.ts` — `getReminders()` returning `{ today, in2Days, in7Days }` using date window queries
- [x] 4.5 Create `backend/src/services/dashboardService.ts` — `getStats()` using parallel queries / aggregation for all four metrics
- [x] 4.6 Create `backend/src/services/transformationService.ts` — `addTransformation` (saves file paths), `listTransformations`, `deleteTransformation` (removes DB record + files from disk)
- [x] 4.7 Create `backend/src/services/aboutService.ts` — `getAbout`, `updateAbout` (upsert)
- [x] 4.8 Create `backend/src/services/leadService.ts` — `createLead`, `listLeads` (with status filter), `updateLeadStatus`

---

## Phase 5: Controllers

- [x] 5.1 Create `backend/src/controllers/authController.ts` — `login` handler: validates body, calls authService, returns token
- [x] 5.2 Create `backend/src/controllers/clientController.ts` — `create`, `list`, `getOne`, `update`, `remove` handlers
- [x] 5.3 Create `backend/src/controllers/paymentController.ts` — `record`, `history`, `summary` handlers
- [x] 5.4 Create `backend/src/controllers/reminderController.ts` — `getReminders` handler
- [x] 5.5 Create `backend/src/controllers/dashboardController.ts` — `getStats` handler
- [x] 5.6 Create `backend/src/controllers/transformationController.ts` — `add` (with multer fields), `list`, `remove` handlers
- [x] 5.7 Create `backend/src/controllers/aboutController.ts` — `get`, `update` (with optional multer field) handlers
- [x] 5.8 Create `backend/src/controllers/leadController.ts` — `create`, `list`, `updateStatus` handlers

---

## Phase 6: Routes

- [x] 6.1 Create `backend/src/routes/auth.ts` — `POST /login` with rate limiter (10 req / 15 min)
- [x] 6.2 Create `backend/src/routes/admin.ts` — mount all admin sub-routes under auth middleware: clients, payments, reminders, dashboard, transformations, about, leads
- [x] 6.3 Create `backend/src/routes/public.ts` — `GET /transformations`, `GET /about`, `POST /leads` (no auth)
- [x] 6.4 Create `backend/src/routes/index.ts` — root router mounting `/api/auth`, `/api/admin`, and `/api` public routes

---

## Phase 7: Seed Script

- [x] 7.1 Create `backend/scripts/seedAdmin.ts` — reads `ADMIN_USERNAME` and `ADMIN_PASSWORD` from env, hashes password, upserts Admin document; logs success/skip

---

## Phase 8: Tests

- [ ] 8.1 Write unit tests for `dateHelpers.ts` — `calculateExpiry`, `extendExpiry`, `classifyExpiry` covering boundary cases (exactly 7 days, 0 days, -1 days, month boundaries)
- [ ] 8.2 Write property-based tests (fast-check) for date helpers — verify invariants: expiry always > joinDate, classifyExpiry always returns valid status, extendExpiry always > today
- [ ] 8.3 Write integration tests for auth routes — login success, login failure, protected route with/without token
- [ ] 8.4 Write integration tests for client CRUD — create, list (with expiryStatus), update (expiry recalculation), delete (cascade), duplicate phone conflict
- [ ] 8.5 Write integration tests for payment flow — record payment extends expiry correctly, history returns sorted results, summary counts correctly
- [ ] 8.6 Write integration tests for reminders endpoint — clients in correct date buckets, empty buckets return `[]`
- [ ] 8.7 Write integration tests for public routes — transformations list, about get, lead submit (no auth required)
