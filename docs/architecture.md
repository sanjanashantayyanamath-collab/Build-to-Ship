# System Architecture

## Overview Architecture

```text
+-------------------------------------------------------------+
|                      React (Vite) UI                        |
|  - Tailwind CSS Styling                                     |
|  - Supabase Auth Context (Sign Up, Sign In, Session)        |
|  - React Router v6 Page Shells                              |
+------------------------------+------------------------------+
                               | Authorization: Bearer <JWT>
                               v
+-------------------------------------------------------------+
|                   Express.js Backend API                    |
|  - Auth Middleware (Verifies JWT via Supabase)               |
|  - Zod Request Validation                                   |
|  - Express Rate Limiting & Helmet Security                   |
|  - AppError Centralized Exception Handler                   |
+---------------+------------------------------+--------------+
                |                              |
      JSON Data |                              | Prompt Data
                v                              v
+---------------+--------------+  +------------+--------------+
|     Supabase PostgreSQL      |  |     Google Gemini AI       |
|  - Row Level Security (RLS)  |  |  - @google/genai SDK      |
|  - User-Scoped Client        |  |  - System & Advisory Prompt|
|  - Auto Profile Triggers     |  |  - Structured JSON Output  |
+------------------------------+  +---------------------------+
```

## Security & Data Flow
1. Client authenticates via Supabase Auth and acquires a session JWT token.
2. All advisory data operations are sent to the Express API with `Authorization: Bearer <access_token>`.
3. Express middleware verifies the JWT and constructs a user-scoped Supabase client (`req.sb`).
4. Backend formats user prompt, queries Gemini API for structured JSON guidance, validates output using Zod, and persists result to PostgreSQL.
5. PostgreSQL Row Level Security (RLS) policies restrict reads/writes strictly to the authenticated `user_id`.
