# Streak

A production-quality daily guessing game: one puzzle, one guess per day, server-authoritative streak tracking.

## Architecture

```
Browser (React + Vite)
        │ HTTPS
        ▼
Node.js API (Express + TypeScript)
        │
        ▼
PostgreSQL (Prisma ORM)
```

- **Game timezone:** Asia/Kolkata (server determines the game date)
- **Player identity:** Anonymous UUID stored in browser `localStorage`
- **Answer secrecy:** The correct answer is never sent before a guess is recorded

## Tech stack

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | React 19, TypeScript, Vite                 |
| Backend  | Node.js, Express, TypeScript, Zod, Luxon   |
| Database | PostgreSQL, Prisma                         |
| Tests    | Vitest, Supertest                          |

## Local setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Database

Create a PostgreSQL database and note the connection URL.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL, PORT, CORS_ORIGIN

npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

API runs at `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:3000

npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Environment variables

### Backend (`backend/.env`)

| Variable      | Description                          |
|---------------|--------------------------------------|
| `DATABASE_URL`| PostgreSQL connection string         |
| `PORT`        | API port (default `3000`)            |
| `NODE_ENV`    | `development` / `production` / `test`|
| `CORS_ORIGIN` | Allowed frontend origin              |

### Frontend (`frontend/.env`)

| Variable            | Description              |
|---------------------|--------------------------|
| `VITE_API_BASE_URL` | Backend API base URL     |

## API overview

| Method | Path                              | Description                |
|--------|-----------------------------------|----------------------------|
| POST   | `/api/v1/players`                 | Create anonymous player    |
| GET    | `/api/v1/game/today?playerId=uuid`| Today's puzzle + status    |
| POST   | `/api/v1/game/guess`              | Submit one daily guess     |
| GET    | `/api/v1/players/:id/stats`       | Player statistics          |
| GET    | `/health`                         | Health check               |

## Game rules

1. One published puzzle per calendar day (Asia/Kolkata).
2. One guess per player per puzzle — enforced in UI, API, and database (`UNIQUE(player_id, puzzle_id)`).
3. Correct answer on consecutive days extends the streak.
4. Wrong answer or missed day resets the streak to 0 (correct after miss starts at 1).
5. Duplicate submissions are idempotent — the original result is returned.
6. The server owns all game state; the client never determines correctness or streaks.

## Streak logic

Streak calculation lives in `backend/src/services/streak.service.ts` and is covered by unit tests. Player state uses explicit `lastPlayedGameDate` and `lastAttemptCorrect` columns for reliable missed-day detection.

Display streaks are computed dynamically when loading game state so inactive players see a reset streak without background cron jobs.

## Security decisions

- Input validation via Zod on all endpoints
- Rate limiting on player creation, game retrieval, and guess submission
- CORS restricted to configured frontend origin in production
- No stack traces exposed to clients
- Answers never included in GET responses before play

## Testing

```bash
cd backend
npm test
```

Covers normalization, date utilities, streak edge cases, API integration (including concurrency and idempotent retries), validation, and rate limiting.

```bash
cd frontend
npm run build   # TypeScript + production bundle
npm run lint
```

## Deployment

Recommended stack (per PRD):

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Supabase PostgreSQL

Set `CORS_ORIGIN` to your deployed frontend URL and `VITE_API_BASE_URL` to your deployed API URL.

## Tradeoffs

- **Anonymous UUID identity:** Simple onboarding, but users can create multiple identities (accepted for V1).
- **In-memory rate limiter:** Sufficient for single-instance deployment; use Redis for multi-instance.
- **Dynamic streak display:** Avoids cron jobs; DB `currentStreak` may be stale until next play, but display layer compensates.
- **No admin UI:** Puzzles managed via seed script and direct database access for V1.

## Project layout

```
Streak/
├── backend/
│   ├── prisma/          # Schema, migrations, seed
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/    # Game + streak business logic
│   │   ├── repositories/
│   │   ├── middleware/
│   │   └── lib/
│   └── tests/
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
└── README.md
```
