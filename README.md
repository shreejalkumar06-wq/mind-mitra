# MindMitra

MindMitra is a mental wellness app with a Next.js frontend and an Express + Socket.io backend backed by Supabase.

## Project Layout

- `src/` — Next.js frontend for Vercel
- `backend/` — Express API + Socket.io backend
- `backend/supabase/schema.sql` — Supabase schema for app tables
- `render.yaml` — one-click backend deploy blueprint for Render

## Features

- Anonymous user creation with names like `Serene Cloud`
- Daily mood tracking with notes
- Private journaling
- Anonymous live chat rooms
- Daily streak tracking
- Wellness score from mood + streak + journal activity

## Local Development

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Production Setup

### Frontend on Vercel

Import this GitHub repository into Vercel and deploy the root project.

Set these environment variables in Vercel:

- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain/api`
- `NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain`
- `NEXT_PUBLIC_SOCKET_PATH=/socket.io`

### Backend on Render

This repo includes `render.yaml`, so Render can deploy the backend from GitHub in one click.

Set these environment variables in Render:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRONTEND_URLS`
- `SOCKET_PATH=/socket.io`

Use the backend service root directory:

- `backend`

## Important Note

The frontend is Vercel-ready, but the backend should not be deployed as a normal Vercel serverless function because Socket.io requires a long-lived Node server.
