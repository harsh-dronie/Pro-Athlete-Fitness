# Pro Athlete Fitness - Gym Trainer Management System

## 🎯 Project Overview

A full-stack web application for managing a personal training business. Features include client management, lead tracking, payment processing, SMS reminders, and dynamic content management for the public-facing website.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Shadcn/ui
- **Deployment**: Vercel
- **Live URL**: https://pro-athlete-fitness-steel.vercel.app

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **SMS Service**: Twilio
- **Scheduler**: node-cron
- **Deployment**: Render
- **API URL**: https://pro-athlete-fitness-1.onrender.com

---

## 📁 Project Structure

```
pro-athlete-fitness-gym/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, error handling, file upload
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── server.ts          # Entry point
│   ├── scripts/               # Admin seeding scripts
│   ├── tests/                 # Jest tests
│   ├── uploads/               # File storage
│   └── package.json
│
├── src/                       # Frontend React app
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Route pages
│   │   ├── admin/            # Admin panel pages
│   │   ├── Home.tsx
│   │   ├── AboutTrainer.tsx
│   │   ├── Plans.tsx
│   │   └── Transformations.tsx
│   ├── lib/                   # API clients
│   │   ├── api.ts            # Public API
│   │   └── adminApi.ts       # Admin API
│   └── main.tsx
│
├── components/ui/             # Shadcn UI components
├── public/                    # Static assets
├── vercel.json               # Vercel config
└── README.md
```

---

## 🔑 Key Features

### Public Website
1. **Hero Section** - Dynamic images managed from admin panel
2. **About Trainer** - Trainer bio and credentials
3. **Transformations Gallery** - Before/after client photos
4. **Pricing Plans** - Multiple membership tiers
5. **Lead Capture** - Contact form for new inquiries
6. **WhatsApp Integration** - Direct messaging to trainer (9872881023)

### Admin Panel
1. **Dashboard** - Overview stats (clients, leads, revenue)
2. **Client Management** - CRUD operations, expiry tracking
3. **Lead Management** - Status tracking (new, contacted, converted, lost)
4. **Payment Tracking** - Record payments, view history
5. **SMS Reminders** - Automated daily reminders for expiring memberships
6. **Content Management**:
   - Hero images (background + trainer photo)
   - About section content
   - Transformation photos
   - Pricing plans
7. **Authentication** - JWT-based secure login

---

## 🔐 Admin Credentials

- **Username**: `trainer`
- **Password**: `yourpassword123`
- **Login URL**: https://pro-athlete-fitness-steel.vercel.app/admin/login

---

## 🗄️ Database Models

### Admin
- Username, password (bcrypt hashed)

### Client
- Name, phone (unique), email
- Join date, plan duration, expiry date
- Personal training flag, notes
- Last payment date

### Lead
- Name, phone, goal
- Status: new | contacted | converted | lost
- Created date

### Payment
- Client reference, amount, date, method
- Plan duration, notes

### Plan
- Name, price, discount
- Duration, features array
- Badge (Popular, Best Value, etc.)
- Active status

### Transformation
- Title, description
- Before/after images
- Active status

### HeroContent
- Background image, trainer image
- Singleton model (only one record)

### AboutContent
- Title, description, image
- Credentials array
- Singleton model

---

## 🚀 Deployment Details

### Backend (Render)
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`
- **Environment Variables**:
  - `MONGODB_URI` - MongoDB connection string
  - `JWT_SECRET` - Secret for JWT signing
  - `PORT` - Auto-set by Render
  - `CORS_ORIGIN` - Frontend URL
  - `TWILIO_ACCOUNT_SID` - Twilio credentials
  - `TWILIO_AUTH_TOKEN` - Twilio credentials
  - `TWILIO_PHONE_NUMBER` - Twilio phone number
  - `NODE_ENV=production`

### Frontend (Vercel)
- **Framework**: Vite
- **Root Directory**: `.` (project root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL=https://pro-athlete-fitness-1.onrender.com/api`

---

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other credentials
npm run dev  # Runs on port 5001
```

### Frontend Setup
```bash
npm install
npm run dev  # Runs on port 3000
```

### Seed Admin User
```bash
cd backend
npm run seed
```

---

## 📡 API Endpoints

### Public Routes (`/api`)
- `GET /hero` - Get hero images
- `GET /about` - Get about content
- `GET /transformations` - Get active transformations
- `GET /plans` - Get active plans
- `POST /leads` - Submit lead form

### Admin Routes (`/api/admin`) - Requires JWT
- `POST /auth/login` - Admin login
- `GET /dashboard` - Dashboard stats
- `GET /clients` - List clients
- `POST /clients` - Create client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client
- `POST /clients/:id/payments` - Record payment
- `GET /leads` - List leads
- `PUT /leads/:id/status` - Update lead status
- `GET /reminders` - Get expiring clients
- `GET /plans` - List all plans
- `POST /plans` - Create plan
- `PUT /plans/:id` - Update plan
- `DELETE /plans/:id` - Delete plan
- `PUT /hero` - Update hero images (multipart)
- `PUT /about` - Update about content (multipart)
- `GET /transformations` - List all transformations
- `POST /transformations` - Create transformation (multipart)
- `PUT /transformations/:id` - Update transformation (multipart)
- `DELETE /transformations/:id` - Delete transformation

---

## 🔔 Automated Features

### SMS Reminders
- **Schedule**: Daily at 9:00 AM IST
- **Target**: Clients expiring in 3 days
- **Service**: Twilio
- **Message**: "Hi {name}, your gym membership expires on {date}. Please renew to continue training!"

---

## 🐛 Known Issues & Fixes

### Issue 1: Mongoose Duplicate Index Warning
- **Warning**: `Duplicate schema index on {"phone":1}`
- **Status**: Fixed in Client model
- **Impact**: None (cosmetic warning only)

### Issue 2: Render TypeScript Build
- **Problem**: Production build failing due to missing type definitions
- **Solution**: Moved `@types/node`, `@types/express`, `@types/multer`, and `typescript` to dependencies
- **Status**: Resolved

### Issue 3: Vercel SPA Routing
- **Problem**: Direct URLs (e.g., `/admin/login`) returning 404
- **Solution**: Added `vercel.json` with rewrite rules
- **Status**: Resolved

---

## 📝 Recent Changes

### Latest Commits
1. **Fix: Remove duplicate phone index in Client model** - Removed duplicate index warning
2. **Add vercel.json for SPA routing support** - Fixed Vercel routing
3. **Fix: Move @types/express and @types/multer to dependencies** - Fixed Render build
4. **Fix: Move @types/node and typescript to dependencies** - Fixed TypeScript compilation

---

## 🔗 Important Links

- **Frontend**: https://pro-athlete-fitness-steel.vercel.app
- **Backend API**: https://pro-athlete-fitness-1.onrender.com
- **GitHub Repo**: https://github.com/harsh-dronie/Pro-Athlete-Fitness
- **Vercel Dashboard**: https://vercel.com/harsh-dronies-projects/pro-athlete-fitness
- **Render Dashboard**: https://dashboard.render.com

---

## 👥 Contact

- **WhatsApp**: +91 9872881023
- **Admin Panel**: Use credentials above

---

## 📄 License

Private project - All rights reserved

---

## 🎓 Handover Notes for Next Developer

### What's Working
✅ Full CRUD for clients, leads, payments, plans, transformations
✅ JWT authentication with protected routes
✅ File uploads for images (hero, about, transformations)
✅ SMS reminders via Twilio (scheduled daily)
✅ Responsive UI with Tailwind CSS
✅ Production deployments on Vercel + Render
✅ MongoDB database with proper indexing
✅ TypeScript throughout (frontend + backend)

### Potential Improvements
- Add image optimization/compression before upload
- Implement pagination for large datasets
- Add email notifications alongside SMS
- Create analytics dashboard with charts
- Add bulk operations for clients
- Implement role-based access (multiple admins)
- Add data export (CSV/PDF)
- Implement search and filtering
- Add unit tests coverage (currently minimal)
- Set up CI/CD pipeline

### Development Tips
- Backend uses CommonJS (`type: "commonjs"` in package.json)
- Frontend uses Vite environment variables (`VITE_` prefix required)
- Render free tier spins down after inactivity (cold starts ~30s)
- MongoDB indexes are set on `phone` (unique) and `expiryDate`
- File uploads stored in `backend/uploads/` (not in git)
- Admin token stored in localStorage as `admin_token`

---

**Last Updated**: April 20, 2026
**Project Status**: ✅ Production Ready
