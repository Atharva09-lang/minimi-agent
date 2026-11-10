
BEGIN;

-- 1. CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES neon_auth."user"(id) ON DELETE CASCADE,

    title VARCHAR(255) DEFAULT 'New Conversation',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 2. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('user', 'assistant', 'system', 'tool')),

    content TEXT NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 3. MEMORIES
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES neon_auth."user"(id) ON DELETE CASCADE,

    memory_type VARCHAR(30) NOT NULL
        CHECK (memory_type IN (
            'fact', 'preference', 'commitment', 'goal', 'other'
        )),

    content TEXT NOT NULL,

    source_message_id UUID
        REFERENCES messages(id) ON DELETE SET NULL,

    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00
        CHECK (confidence BETWEEN 0 AND 1),

    importance SMALLINT NOT NULL DEFAULT 3
        CHECK (importance BETWEEN 1 AND 5),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 4. REMINDERS
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES neon_auth."user"(id) ON DELETE CASCADE,

    memory_id UUID
        REFERENCES memories(id) ON DELETE SET NULL,

    message TEXT NOT NULL,

    scheduled_at TIMESTAMPTZ NOT NULL,

    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending', 'sent', 'cancelled', 'failed'
        )),

    sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 5. AGENT TOOL LOGS
CREATE TABLE IF NOT EXISTS agent_tool_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES neon_auth."user"(id) ON DELETE CASCADE,

    conversation_id UUID
        REFERENCES conversations(id) ON DELETE SET NULL,

    message_id UUID
        REFERENCES messages(id) ON DELETE SET NULL,

    tool_name VARCHAR(100) NOT NULL,

    input JSONB DEFAULT '{}'::jsonb,
    output JSONB DEFAULT '{}'::jsonb,

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('success', 'failed')),

    error_message TEXT,

    duration_ms INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- INDEXES

CREATE INDEX IF NOT EXISTS idx_conversations_user
ON conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_memories_user
ON memories(user_id, memory_type)
WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_reminders_pending
ON reminders(scheduled_at)
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_tool_logs_user
ON agent_tool_logs(user_id, created_at DESC);

COMMIT;
