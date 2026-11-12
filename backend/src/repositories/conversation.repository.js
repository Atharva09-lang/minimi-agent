
import pool from "../config/database.js";

// Create a conversation
export async function createConversation(
  userId,
  title = "New Conversation"
) {
  const query = `
    INSERT INTO conversations (user_id, title)
    VALUES ($1, $2)
    RETURNING id, user_id, title, created_at, updated_at
  `;

  const normalizedTitle =
    typeof title === "string" && title.trim()
      ? title.trim()
      : "New Conversation";

  const { rows } = await pool.query(query, [
    userId,
    normalizedTitle
  ]);

  return rows[0] || null;
}

// Get all conversations for a user
export async function getConversationsByUser(
  userId,
  limit = 20,
  offset = 0
) {
  const query = `
    SELECT id, title, created_at, updated_at
    FROM conversations
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [
    userId,
    limit,
    offset
  ]);

  return rows;
}

// Get one conversation belonging to a user
export async function getConversationById(
  userId,
  conversationId
) {
  const query = `
    SELECT id, user_id, title, created_at, updated_at
    FROM conversations
    WHERE user_id = $1 AND id = $2
  `;

  const { rows } = await pool.query(query, [
    userId,
    conversationId
  ]);

  return rows[0] || null;
}

// Update conversation title
export async function updateConversationTitle(
  userId,
  conversationId,
  title
) {
  const query = `
    UPDATE conversations
    SET title = $3, updated_at = NOW()
    WHERE user_id = $1 AND id = $2
    RETURNING id, title, updated_at
  `;

  const { rows } = await pool.query(query, [
    userId,
    conversationId,
    title.trim()
  ]);

  return rows[0] || null;
}

// Delete a conversation 
export async function deleteConversation(
  userId,
  conversationId
) {
  const query = `
    DELETE FROM conversations
    WHERE user_id = $1 AND id = $2
    RETURNING id
  `;

  const { rows } = await pool.query(query, [
    userId,
    conversationId
  ]);

  return rows.length > 0;
}
