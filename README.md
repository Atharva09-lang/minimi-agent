# Minimi — AI Personal Assistant

Minimi is a full-stack AI personal assistant that supports conversational memory, cross-conversation context recall, and real-time web search.

## Features

- **Chat:** Interact with the assistant through a conversational interface.
- **Conversations:** Create, open, and delete conversations.
- **Memory:** Extract and persist useful facts and preferences.
- **Past Context Recall:** Retrieve relevant information from previous conversations.
- **Web Search:** Search the web using Tavily when fresh information is needed.
- **Authentication:** Email and password sign-up and sign-in using Neon Auth.
- **Formatted Responses:** Markdown support for lists, code blocks, and tables.
- **API Security:** Authentication checks, request validation, rate limiting, and security headers.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Backend | Node.js, Express 5 |
| Database | Neon PostgreSQL |
| Authentication | Neon Auth |
| LLM | Groq (GPT-OSS-120B) |
| Web Search | Tavily |
| Validation | Zod |
| Security | Helmet, CORS, Express Rate Limit |
| Markdown | React Markdown, Remark GFM |

## Project Structure

```text
minimi-agent/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tools/
│   │   └── validators/
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── architecture.md
│   └── database-design.md
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── DESIGN.md
├── README.md
└── package.json
```

## Running Locally

### Prerequisites

- Node.js and npm
- Neon PostgreSQL database
- Neon Auth configuration
- Groq API key
- Tavily API key

### 1. Clone the repository

```bash
git clone https://github.com/Atharva09-lang/minimi-agent.git
cd minimi-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `backend/.env.example` to `backend/.env` and configure the required values.

Create `frontend/.env`:

```env
VITE_NEON_AUTH_URL=your_neon_auth_url
VITE_API_BASE_URL=http://localhost:5000/api
```

Never commit actual environment files or secret keys.

### 4. Set up the database

Run the SQL script from:

`backend/src/database/schema.sql`

against your Neon PostgreSQL database.

### 5. Start the application

```bash
npm run dev
```

The frontend and backend should start together:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Overview

All conversation, message, and memory routes require a valid Neon Auth bearer token.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations` | Create a conversation |
| GET | `/api/messages/:conversationId` | Fetch conversation messages |
| POST | `/api/messages/:conversationId` | Send a message |
| GET / POST / PATCH / DELETE | `/api/memories` | Manage saved memories |

## Documentation

- **Design Document:** `DESIGN.md`
- **Architecture Notes:** `docs/architecture.md`
- **Database Design:** `docs/database-design.md`
