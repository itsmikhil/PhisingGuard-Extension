# PhishingGuard Evidence Guide

This document records the commands and screens used to demonstrate testing, build/version management, functionality, and technology choices.

## 1. Testing Evidence

Run from `backend/`:

```bash
npm test
npm run test:coverage
npm run test:mutation
```

Expected regression result:

- 9 test suites passed
- 40 tests passed
- Approximately 69% line coverage

Coverage is written to `backend/coverage/`. Mutation reports are written to `backend/reports/mutation/html/`.

Capture these screenshots:

1. Jest output showing all suites and tests passing.
2. Jest coverage summary.
3. Stryker mutation score and HTML report.
4. An API test result showing authentication, URL scanning, admin access control, and report workflow.

The API tests are isolated integration/contract tests using Supertest and mocked model persistence. They exercise the Express routes without requiring a live database.

## 2. Version and Build Evidence

From the repository root:

```bash
git status
git log --oneline -5
git tag
```

Version values are currently maintained in `backend/package.json`, `frontend/package.json`, `backend/src/constants/extensionConfig.js`, and the health response in `backend/src/app.js`.

Build the frontend:

```bash
cd frontend
npm run build
```

Build and start the complete containerized system:

```bash
cd ..
docker compose build
docker compose up -d
docker compose ps
```

Open `http://localhost` for the frontend and `http://localhost:5000/api/v1/health` for the backend health response.

Capture screenshots of the frontend build output, Docker build output, running containers, and health endpoint response.

## 3. Functionality Screenshots

With the system running, capture these routes:

- `/` - landing page
- `/register` - registration
- `/login` - authentication
- `/dashboard` - overview statistics
- `/dashboard/scan` - URL threat scanning
- `/dashboard/history` - scan history and filtering
- `/dashboard/settings` - profile and settings
- `/dashboard/admin` - administrator statistics, blacklist, and reports

Suggested safe demonstration URL:

```text
https://example.com
```

Suggested suspicious demonstration URL:

```text
https://login.example.com
```

Suggested high-risk heuristic demonstration URL:

```text
https://login.bank-secure-update-account.example.com/this-is-a-very-long-url-that-should-trigger-many-rules
```

Use test domains only. Do not visit real malicious websites.

## 4. Tools and Technologies

- React 19 and Vite
- React Router
- Tailwind CSS and reusable UI components
- Lucide React and Recharts
- Node.js and Express 5
- MongoDB and Mongoose
- JWT and bcryptjs authentication
- Helmet, CORS, Morgan, and audit logging
- Jest and Supertest
- Stryker mutation testing
- Docker and Docker Compose
- Nginx for frontend production serving
- Google Safe Browsing API integration
- Git and GitHub
