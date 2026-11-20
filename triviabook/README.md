# Triviabook API

A Node/Express + Postgres REST API for trivia questions, built with a model / controller / router architecture.

## Database Schema

**topics**
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| name | TEXT | NOT NULL, UNIQUE |

**questions**
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| topic_id | INTEGER | NOT NULL, FK -> topics(id), ON DELETE CASCADE |
| question | TEXT | NOT NULL |
| answer | TEXT | NOT NULL |
| difficulty | TEXT | NOT NULL, CHECK in ('easy', 'medium', 'hard') |

One topic has many questions (one-to-many).

## Setup

1. Install dependencies: `npm install`
2. Create the database: `createdb triviabook`
3. Copy `.env.example` to `.env` and fill in your Postgres credentials
4. Create tables: `psql "$DATABASE_URL" -f db/schema.sql`
5. Seed data: `npm run db:seed`
6. Start the server: `npm start` (or `npm run dev` for auto-reload)

The server runs at `http://localhost:3000`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /triviabook/topics | List all topics |
| GET | /triviabook/topic/:topic | Questions in a topic. Optional query params: `limit`, `difficulty` (easy/medium/hard) |
| GET | /triviabook/random | One random question (no answer included) |
| POST | /triviabook/answer | Body: `{ id, guess }`. Returns `{ correct, answer }` |
| POST | /triviabook/question/add | Body: `{ topic, question, answer, difficulty }`. Creates topic if needed; returns updated question list |

## Error responses
- 400: missing or invalid parameters
- 404: unknown topic, unknown question id, or unknown route
- 500: server error