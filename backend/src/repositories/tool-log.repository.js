
import pool from "../config/database.js";

// Save a tool execution log
export async function createToolLog({
  userId,
  conversationId = null,
  messageId = null,
  toolName,
  input = {},
  output = {},
  status,
  errorMessage = null,
  durationMs = null
}) {
  const query = `
    INSERT INTO agent_tool_logs (
      user_id,
      conversation_id,
      message_id,
      tool_name,
      input,
      output,
      status,
      error_message,
      duration_ms
    )
    SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9
    WHERE
      ($2::uuid IS NULL OR EXISTS (
        SELECT 1 FROM conversations
        WHERE id = $2::uuid AND user_id = $1
      ))
      AND
      ($3::uuid IS NULL OR EXISTS (
        SELECT 1
        FROM messages m
        JOIN conversations c ON c.id = m.conversation_id
        WHERE m.id = $3::uuid
          AND c.user_id = $1
          AND ($2::uuid IS NULL OR c.id = $2::uuid)
      ))
    RETURNING *
  `;

  const values = [
    userId,
    conversationId,
    messageId,
    toolName,
    JSON.stringify(input),
    JSON.stringify(output),
    status,
    errorMessage,
    durationMs
  ];

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
}

// Get tool logs for a user
export async function getUserToolLogs(userId, limit = 50, offset = 0) {
  const query = `
    SELECT *
    FROM agent_tool_logs
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [userId, limit, offset]);

  return rows;
}

// Get tool logs for one conversation
export async function getConversationToolLogs(
  userId,
  conversationId,
  limit = 50
) {
  const query = `
    SELECT *
    FROM agent_tool_logs
    WHERE user_id = $1 AND conversation_id = $2
    ORDER BY created_at ASC
    LIMIT $3
  `;

  const { rows } = await pool.query(query, [
    userId,
    conversationId,
    limit
  ]);

  return rows;
}
