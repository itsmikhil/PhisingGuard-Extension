# PhishingGuard Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the required values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/phishingguard
   JWT_SECRET=your-secret-key
   GOOGLE_SAFE_BROWSING_API_KEY=your-google-safe-browsing-key
   NODE_ENV=development
   ```

## Environment Variables

- PORT: HTTP port for the backend.
- MONGODB_URI: MongoDB connection string.
- JWT_SECRET: Secret used to sign JWTs.
- GOOGLE_SAFE_BROWSING_API_KEY: API key for Google Safe Browsing.
- NODE_ENV: Set to `development` or `production`.

## Folder Structure

- src/app.js: Express application setup
- src/routes: API route definitions
- src/controllers: Request handlers
- src/middleware: Authentication, validation, rate limiting, and error handling
- src/services: Detection, caching, and audit logging modules
- src/models: Mongoose data models
- src/constants: Shared configuration values

## API List

### Authentication

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me

### User APIs

- GET /api/v1/user/profile
- GET /api/v1/user/history
- GET /api/v1/user/stats
- POST /api/v1/user/report

### Scan APIs

- POST /api/v1/scan

### Admin APIs

- GET /api/v1/admin/dashboard
- GET /api/v1/admin/blacklist
- POST /api/v1/admin/blacklist
- PUT /api/v1/admin/blacklist/:id
- DELETE /api/v1/admin/blacklist/:id
- GET /api/v1/admin/reports
- PUT /api/v1/admin/reports/:id

### Extension Integration

- GET /api/v1/extension/health
- GET /api/v1/extension/config
- POST /api/v1/extension/report
- POST /api/v1/extension/scan

### Health

- GET /api/v1/health

## Authentication

Authentication uses JWTs. Send the token in either:

- Authorization: Bearer <token>
- x-extension-token: <token>

## Extension Integration

The extension can call the protected extension endpoints using the same JWT used for the main API.

## Deployment

Run the server with:

```bash
npm start
```

For production, set `NODE_ENV=production` and provide the required environment variables.
