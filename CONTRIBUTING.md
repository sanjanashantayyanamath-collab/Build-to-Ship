# Contributing to AI-Powered Agriculture Crop Advisory Assistant

Thank you for your interest in contributing to the **AI-Powered Agriculture Crop Advisory Assistant**! We welcome contributions from developers, agronomists, and open-source enthusiasts.

## Guidelines

1. **Code Quality**:
   - Follow standard TypeScript and Node.js best practices.
   - Use ESLint and Prettier for code formatting.
   - All client code should be written in TypeScript/React.
   - Backend code uses Node.js ES modules (`import`/`export`).

2. **Security & Data Isolation**:
   - Never expose API keys or secrets in client-side code.
   - All backend routes must enforce JWT verification and user-scoped Supabase client calls.
   - Ensure Row Level Security (RLS) policies cover any newly added database tables.

3. **Submitting Pull Requests**:
   - Fork the repository and create a feature branch (`git checkout -b feature/amazing-feature`).
   - Run tests (`npm run test`) and ensure everything passes before submitting.
   - Commit your changes with clear, descriptive commit messages.
   - Open a Pull Request against the `main` branch.

Thank you for helping empower farmers with accessible, safe, and intelligent crop guidance!
