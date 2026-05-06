# Pro Athlete Fitness — Master Repo

A comprehensive management system for gym trainers and fitness businesses.

## 📁 Project Structure
- `src/`: Frontend React application.
- `backend/`: Node.js/Express API.
- `public/`: Static assets (images, fonts).
- `docs/`: Project documentation (Brief, Decisions, Changelog).
- `tests/`: Automated tests.
- `scripts/`: Utility scripts for seeding and maintenance.

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MONGODB_URI and JWT_SECRET
npm run dev
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```

### 3. Seed Admin Data
To create the initial admin user:
```bash
cd backend
npm run seed
```

## 📄 Documentation
For detailed information, please refer to the `docs/` folder:
- [Project Brief](docs/BRIEF.md)
- [Technical Decisions](docs/DECISIONS.md)
- [Changelog](docs/CHANGELOG.md)

---
*Built with React, Node.js, and MongoDB.*
