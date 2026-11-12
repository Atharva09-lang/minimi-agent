# Minimi: Design Document

## 1. How It Works

Minimi is a personal AI assistant. The frontend is React, the backend is Node.js with Express, and the data lives in Neon PostgreSQL. You can sign in, chat with it, look back at earlier conversations, save memories, search the web for current information, and set reminders.

### What happens when you send a message

1. **Sign in:** You sign up or log in through Neon Auth.
2. **Request:** The React app gets an auth token and sends it along with every request to the Express backend.
3. **Authorization:** Before any protected route runs, the auth middleware checks that the token is valid.
4. **Storage:** Conversations and messages are saved in Neon PostgreSQL.
5. **Context:** When a message arrives, the agent pulls up the saved memories and conversation history that look relevant to it.
6. **LLM:** Groq, running `openai/gpt-oss-120b`, writes the reply. If it needs more information, it can ask for a tool.
7. **Web search:** If a search is needed, the agent calls Tavily. The results go back to the model so the final answer is based on them.
8. **Saving the reply:** The assistant's answer is saved and sent back to the frontend.

The agent can make only one tool call per request. This keeps each run predictable and much easier to debug.

When I say "past conversations", I mean chats stored in Minimi's own database. Conversations from other services aren't imported.

### Memory

Minimi picks out useful information from conversations and stores it in PostgreSQL. When a new message comes in, the relevant memories are fetched and given to the assistant as context. That's how it can recall things and commitments from earlier, even in a completely different chat session.

### Reminders and nudges

You can create a reminder with a date and time. Reminders are stored in PostgreSQL, and you can view, acknowledge or cancel them.

The frontend checks for updates every 30 seconds and shows any reminder that's due. So this is simple polling. There's no separate background job scheduler and no push-notification service yet.

---

## 2. Technology Choices

- **React + Vite:** A responsive frontend with a fast, pleasant dev workflow.
- **Node.js + Express:** Powers the backend API. Using JavaScript on both sides keeps the stack consistent for me.
- **Neon PostgreSQL:** Holds the application data: conversations, messages, memories, reminders and related records. Constraints and indexes keep the data consistent and the queries quick.
- **Neon Auth:** Handles authentication, so I didn't have to build password and session management myself.
- **Groq:** Runs the LLM (`openai/gpt-oss-120b`) through its OpenAI-compatible API.
- **Tavily:** Gives the assistant web search for current information.

### Backend structure

The backend is split into layers:

- **Routes:** Define the API endpoints.
- **Controllers:** Handle incoming HTTP requests and send responses.
- **Services:** Hold the application logic.
- **Repositories:** Handle everything that touches the database.
- **Tools:** Expose abilities, like web search, to the agent.
- **Middleware:** Takes care of authentication, request protection and other shared concerns.

Keeping these apart makes the code easier to maintain, test and extend.

---

## 3. Alternatives I Considered

- **MongoDB:** I decided on PostgreSQL because the data is clearly connected: users, conversations, messages, memories and reminders all relate to each other, and relational constraints protect those links.
- **Custom authentication:** I used Neon Auth rather than writing password and session handling myself.
- **Multiple tool calls per request:** I stuck with one to keep the agent easy to control and debug.
- **A multi-agent framework:** A direct LLM tool-calling setup does everything Minimi needs today. A framework would add complexity without a clear payoff at this stage.
- **Separate repositories for frontend and backend:** I kept everything in one repo to make development and project management simpler.

---

## 4. Error Handling and Reliability

Minimi has basic error handling for problems with the LLM provider, the search service, the database and the API itself.

- API errors are handled in one central place, so the frontend gets a clean response instead of raw internal details.
- If a web search fails, the error is caught and the agent can still reply with a fallback when possible.
- Database and LLM failures are logged on the backend and handled by the request controller.
- A rate limiter blocks excessive requests, which reduces abuse and unnecessary load.
- Requests with invalid payloads are rejected by validation.

This gives a reasonable baseline of resilience. Automatic retries and smarter recovery are things I'd still like to add.

---

## 5. What I'd Improve With Another Week

1. **Better memory retrieval:** Rank memories by relevance, catch duplicates and handle updates properly.
2. **Automated tests:** Cover memory extraction, recall across conversations, tool execution and API behaviour.
3. **More reliability:** Add controlled retries for temporary provider and network failures.
4. **Measure answer quality:** Write test cases for factual accuracy, memory recall and how relevant the web results are.
5. **Stronger reminders:** Replace frontend polling with a proper background scheduler and reliable notification delivery.
6. **Frontend polish:** Better loading states, clearer error messages, responsive behaviour and an overall smoother chat experience.

---

## Guiding Principle

Keep the system modular, understandable and reliable. I'm not trying to build something architecturally fancy. I want an assistant that keeps useful context, remembers what it has committed to, can look up current information, and handles everyday tasks consistently.