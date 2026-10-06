# Architectural Decisions & Assumptions

This document records architectural decisions, technical choices, and design assumptions for the **AI-Powered Agriculture Crop Advisory Assistant**.

## 1. Authentication & User Isolation
- **Choice**: Supabase Auth (Email/Password) with database-enforced Row Level Security (RLS).
- **Rationale**: Keeps auth simple and secure without managing password hashes or session tokens manually. User isolation is enforced directly by PostgreSQL policies using `(select auth.uid()) = user_id`.

## 2. Gemini AI Integration (Server-Side Only)
- **Choice**: Google `@google/genai` SDK executed strictly on the Express.js backend server.
- **Rationale**: Prevents exposure of the `GEMINI_API_KEY` in client-side bundles. Allows server-side prompt injection defense, structured JSON schema enforcement, safety filtering, and automatic repair retries.

## 3. Database Schema Design & Migration Runner
- **Choice**: Idempotent SQL migration files stored in `supabase/migrations/` executed via a custom Node.js runner (`server/src/db/migrate.js`).
- **Rationale**: Provides both direct PostgreSQL connection (`DATABASE_URL`) support and Supabase Management API execution (`SUPABASE_SERVICE_ROLE_KEY`), enabling zero-dependency migration deployment.

## 4. Input & Output Validation
- **Choice**: Zod schemas used on both frontend form validation and backend request/response validation.
- **Rationale**: Guarantees type safety across the full stack and prevents malformed data from reaching the Gemini API or PostgreSQL database.
