Minimi — AI Personal Assistant

Minimi is a personal AI assistant I built as a full-stack project. You chat with it like any other assistant, but it also remembers things about you, can look back at your older conversations when they're relevant, and can search the web when a question needs fresh information.

What it does
Chat: Talk to the assistant through a simple conversational UI.
Conversations: Start a new conversation, open an old one, or delete the ones you don't need.
Memory: It can save useful facts and preferences about you and bring them back later.
Past context: When something you said earlier is relevant, it can pull that in from previous chats.
Web search: For anything current, it searches the web through Tavily before answering.
Login: Email and password sign-up and sign-in, handled by Neon Auth.
Formatted replies: Responses are rendered as Markdown, so lists, code blocks and tables look right.
A safer API: Every protected route checks authentication, incoming requests are validated, and the server uses rate limiting and security headers.
Built with
Layer	Tools
Frontend	React 19, Vite
Backend	Node.js, Express 5
Database	Neon PostgreSQL
Auth	Neon Auth
LLM	Groq (GPT-OSS-120B)
Web search	Tavily
Validation	Zod
Security	Helmet, CORS, Express Rate Limit
Markdown	React Markdown, Remark GFM
How the project is organised
text

minimi-agent/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── database.test.js
│   │   │   └── groq.js
│   │   ├── controllers/
│   │   │   ├── conversation.controller.js
│   │   │   ├── memory.controller.js
│   │   │   └── message.controller.js
│   │   ├── database/
│   │   │   └── schema.sql
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── repositories/
│   │   │   ├── conversation.repository.js
│   │   │   ├── memory.repository.js
│   │   │   ├── message.repository.js
│   │   │   ├── reminder.repository.js
│   │   │   └── tool-log.repository.js
│   │   ├── routes/
│   │   │   ├── conversation.routes.js
│   │   │   ├── index.js
│   │   │   ├── memory.routes.js
│   │   │   ├── message.routes.js
│   │   │   └── protected.routes.js
│   │   ├── services/
│   │   │   ├── agent.service.js
│   │   │   ├── llm.service.js
│   │   │   └── memory.service.js
│   │   ├── tools/
│   │   │   ├── web-search/
│   │   │   │   └── search.tool.js
│   │   │   └── tool.registry.js
│   │   ├── validators/
│   │   │   ├── conversation.validator.js
│   │   │   ├── memory.validator.js
│   │   │   └── message.validator.js
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── api-rate-limit.test.js
│   │   ├── auth.test.js
│   │   ├── body-limit.test.js
│   │   ├── conversation-lifecycle.test.js
│   │   ├── helpers.js
│   │   ├── invalid-json.test.js
│   │   ├── memory-delete.test.js
│   │   ├── memory-get.test.js
│   │   ├── memory-lifecycle.test.js
│   │   ├── memory-ownership.test.js
│   │   ├── memory-patch.test.js
│   │   ├── memory-post.test.js
│   │   ├── message-rate-limit.test.js
│   │   ├── message.test.js
│   │   └── validation.test.js
│   │
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   └── database-design.md
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   ├── common/
│   │   │   │   ├── AuthForm.jsx
│   │   │   │   └── AuthGate.jsx
│   │   │   └── sidebar/
│   │   │       └── ConversationList.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   ├── authClient.js
│   │   │   └── chatApi.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── DESIGN.md
└── README.md
Running it locally
What you need first
Node.js and npm
A Neon PostgreSQL database
A Neon Auth setup
A Groq API key
A Tavily API key


1. Clone the repo
bash
git clone <your-public-github-repository-url>
cd minimi-agent

2. Install dependencies

Run this once from the root folder:
bash
npm install

The root package.json uses npm workspaces, so this one command installs packages for both the frontend and the backend.

3. Set up your environment variables

Copy backend/.env.example to backend/.env and fill it in. These are the variables the backend needs:

Variable	What it's for
PORT	Port the backend runs on
DATABASE_URL_POOLED	Your Neon PostgreSQL connection string
GROQ_API_KEY	Access to the Groq API
TAVILY_API_KEY	Access to Tavily web search
NEON_AUTH_JWKS_URL	Used to verify Neon Auth tokens
NEON_AUTH_BASE_URL	Base URL of your Neon Auth project

A few extra variables used only for testing are explained inside backend/.env.example.

Then create frontend/.env:

env
VITE_NEON_AUTH_URL=your_neon_auth_url
VITE_API_BASE_URL=http://localhost:5000/api

Please don't commit your real .env files or any secret keys.

4. Create the database tables

Open backend/src/database/schema.sql and run its SQL against your Neon database.

5. Start the app

From the root folder:
bash
npm run dev
This brings up both sides together:

Frontend: the Vite dev server, usually at http://localhost:5173
Backend: the Express API at http://localhost:5000
API overview

All the conversation, message and memory routes are protected. Send a valid Neon Auth bearer token with each request.

A few of the main endpoints:

Method	Endpoint	What it does
GET	/api/conversations	List your conversations
POST	/api/conversations	Start a new conversation
GET	/api/messages/:conversationId	Fetch the messages in a conversation
POST	/api/messages/:conversationId	Send a new message
GET / POST / PATCH / DELETE	/api/memories and related routes	Manage saved memories
More documentation
Design Document
Architecture Notes
Database Design
