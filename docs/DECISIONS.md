# Technical Decisions & Log

## Key Choices
- **JWT Authentication**: Selected for secure, stateless admin access.
- **MongoDB**: Used for flexibility in schema evolution (e.g., adding plan features or transformation details).
- **Vercel + Render**: Split deployment strategy to leverage Vercel's optimized frontend hosting and Render's straightforward backend web services.
- **Twilio**: Chosen for reliable SMS delivery for automated reminders.

## Problem Solving Log
- **SPA Routing**: Implemented `vercel.json` rewrites to handle direct URL access for React Router paths.
- **Type Safety**: Migrated core types to production dependencies to ensure stable builds on Render's environment.
- **Data Integrity**: Implemented unique indexing on phone numbers and expiry tracking to prevent duplicate client entries and facilitate automated notifications.

## Future Roadmap
- [ ] Image optimization/compression for faster gallery loads.
- [ ] Data export (CSV/PDF) for accounting.
- [ ] Analytics dashboard with trend charts.
- [ ] Search and advanced filtering for client/lead lists.
