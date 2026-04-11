# MindMitra Backend

Express + Socket.io backend for the MindMitra frontend, backed by Supabase PostgreSQL.

## Features

- Anonymous user creation with calm random aliases such as `Serene Cloud`
- Daily mood tracking with upsert-by-date behavior
- Private journal entry creation and retrieval
- Anonymous chat rooms with Socket.io and persisted message history
- Daily check-in streak calculation
- Wellness score derived from mood, streak, and journal activity

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    socket/
    utils/
  supabase/schema.sql
```

## Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials.

Key variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` preferred for backend writes
- `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY` as a fallback for local setup
- `FRONTEND_URLS` as a comma-separated allowlist for local + Vercel frontend origins
- `SOCKET_PATH` if you want a non-default Socket.io path

## Run

```bash
npm install
npm run dev
```

## Frontend Connection

Use these values from your Vercel-hosted frontend:

- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api`
- `NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.com`

Recommended request flow:

1. `POST /api/users/anonymous`
2. Save returned `user.id`, `displayName`, and `avatarUrl` in the frontend session/local storage
3. Use `user.id` for mood, journal, streak, and wellness routes
4. Connect Socket.io with `userId` and `displayName` in the join/send payloads

## Important Deployment Note

The Express API can be deployed on Render, Railway, Fly.io, or another Node host. Socket.io requires a long-lived Node server, so this backend should not be deployed as a standard Vercel serverless function.
