# AI-Powered Agriculture Crop Advisory Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald.svg)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5--flash-orange.svg)](https://ai.google.dev/)

An intelligent, full-stack crop decision support system designed for small and medium farmers, agricultural students, and extension workers. The application takes specific agricultural conditions (crop type, location, soil type, season, growth stage, irrigation, weather, and observed problems) and provides structured, safe, actionable, AI-generated guidance powered by **Google Gemini 2.5 Flash** and backed by **Supabase PostgreSQL**.

---

## 🌾 Core Features

- **Authentication & User Profiles**: Email/password authentication, session persistence, and custom profiles managed via Supabase Auth and Row Level Security.
- **Structured AI Guidance**: Form-driven interface generating strict JSON advisories (risk level, likely causes, prioritized actions, irrigation & nutrient guidance, pest/disease risks, and preventive measures).
- **Row Level Security (RLS)**: Database-enforced isolation ensuring users only access their own agricultural advisories.
- **Safety & Disclaimers**: Built-in uncertainty wording, automated prompt-injection shielding, dosage safety filters, and explicit expert consultation callouts.
- **Advisory History & Analytics**: Dashboard metrics (total advisories, risk breakdown, most queried crops) alongside paginated history with search and filter capabilities.
- **Automated Migration Runner**: Node.js migration runner applying schema and RLS policies directly to Supabase Cloud using the service role key or PostgreSQL connection string.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18+, Vite, TypeScript, React Router v6, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js 20+, Express.js, Helmet, Express Rate Limit, Morgan, Pino |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth (Email/Password), Row Level Security (RLS) |
| **AI Integration** | `@google/genai` (Google Gemini 2.5 Flash - Server Side Only) |
| **Validation** | Zod (Frontend forms, API requests, AI structured output) |
| **Testing** | Vitest, Supertest |

---

## 📁 Repository Structure

```text
Build-to-Ship/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # UI components (Layout, Advisory, History, Auth)
│   │   ├── context/            # AuthContext & ToastContext
│   │   ├── pages/              # Landing, Dashboard, Advisory, History, Profile
│   │   ├── services/           # API Client & Supabase Client
│   │   └── schemas/            # Zod validation schemas
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── server/                     # Node.js + Express Backend API
│   ├── src/
│   │   ├── ai/                 # Gemini SDK setup, system prompts, schemas
│   │   ├── config/             # Environment & Logger configuration
│   │   ├── controllers/        # Request handlers (advisory, profile)
│   │   ├── db/                 # Database migration runner script
│   │   ├── middleware/         # Auth JWT verification, Zod validate, rate limit
│   │   ├── routes/             # API routes (/api/advisories, /api/profile, /api/health)
│   │   ├── schemas/            # Request & AI response Zod schemas
│   │   └── services/           # Business logic & Supabase client wrapper
│   └── package.json
├── supabase/
│   └── migrations/             # SQL schema migrations (001_initial_schema.sql, 002_rls.sql)
├── scripts/
│   └── run-migrations.js       # Root runner alias for Supabase migrations
├── docs/                       # Architecture, Decisions, and API Documentation
├── .github/workflows/          # GitHub Actions CI workflow
├── package.json                # Root package.json (dev, build, test, db:migrate)
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## ⚙️ Environment Configuration

### Client Environment (`client/.env`)

Create `client/.env` based on `client/.env.example`:

```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
VITE_API_BASE_URL=http://localhost:4000
```

### Server Environment (`server/.env`)

Create `server/.env` based on `server/.env.example`:

```env
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SUPABASE-SERVICE-ROLE-KEY] # Used ONLY for migration runner

# Direct DB Connection String (Optional for migration runner)
DATABASE_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Google Gemini API Configuration
GEMINI_API_KEY=[YOUR-GEMINI-API-KEY]
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=30000
```

---

## 🗄️ Database Setup & Migrations

### Applying Migrations via Node.js Migration Runner

Ensure `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL` is configured in `server/.env`, then execute:

```bash
npm run db:migrate
```

Or run directly via Node.js:

```bash
node scripts/run-migrations.js
```

### Applying Migrations via Supabase Dashboard

Alternatively, navigate to **Supabase Dashboard → SQL Editor → New Query**, copy the contents of `supabase/migrations/001_initial_schema.sql`, and click **Run**.

---

## 🚀 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sanjanashantayyanamath-collab/Build-to-Ship.git
   cd Build-to-Ship
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Follow the Environment Configuration section above to create `client/.env` and `server/.env`.

4. **Run Database Migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - Client will run on: `http://localhost:5173`
   - Server will run on: `http://localhost:4000`

---

## 🔑 Obtaining Required Credentials

### 1. Supabase Project Credentials
1. Go to [Supabase](https://supabase.com) and create or select a project.
2. Under **Project Settings → API**:
   - Copy **Project URL** -> `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - Copy **anon public key** -> `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
   - Copy **service_role secret key** -> `SUPABASE_SERVICE_ROLE_KEY` (Keep secure, server-side migration only).

### 2. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and generate a new key.
3. Paste into `server/.env` as `GEMINI_API_KEY`.

---

## 🧪 Testing

Run backend tests using Vitest:

```bash
npm run test
```

---

## 🛡️ Security Features

- **Row Level Security (RLS)**: Strict PostgreSQL RLS policies ensure cross-user data isolation.
- **Server-Side AI API**: Gemini API key is stored exclusively on the Express backend server and never exposed to the frontend bundle.
- **Prompt Injection Defense**: Untrusted user input is isolated inside `<farmer_input>` tags with explicit model instructions to ignore embedded prompts.
- **Input & Output Validation**: Zod schemas validate both client inputs and server/AI JSON outputs.
- **Rate Limiting**: Express rate limiting protects AI endpoints against abuse.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
