
import pool from "../config/database.js";

// Save a new memory
export async function createMemory(
  userId,
  memoryType,
  content,
  options = {}
) {
  const {
    confidence = 1.0,
    importance = 3,
    sourceMessageId = null,
    expiresAt = null
  } = options;

  const query = `
    INSERT INTO memories (
      user_id,
      memory_type,
      content,
      confidence,
      importance,
      source_message_id,
      expires_at
    )
    SELECT $1, $2, $3, $4, $5, $6, $7
    WHERE
      $6::uuid IS NULL
      OR EXISTS (
        SELECT 1
        FROM messages m
        JOIN conversations c ON c.id = m.conversation_id
        WHERE m.id = $6::uuid AND c.user_id = $1
      )
    RETURNING *
  `;

  const values = [
    userId,
    memoryType,
    content,
    confidence,
    importance,
    sourceMessageId,
    expiresAt
  ];

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
}

// Get active memories
export async function getUserMemories(userId, limit = 50) {
  const query = `
    SELECT *
    FROM memories
    WHERE user_id = $1
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY importance DESC, updated_at DESC
    LIMIT $2
  `;

  const { rows } = await pool.query(query, [userId, limit]);

  return rows;
}

// Update memory content
export async function updateMemory(userId, memoryId, content) {
  const query = `
    UPDATE memories
    SET content = $3, updated_at = NOW()
    WHERE user_id = $1 AND id = $2
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    userId,
    memoryId,
    content
  ]);

  return rows[0] || null;
}

// Deactivate a memory
export async function deactivateMemory(userId, memoryId) {
  const query = `
    UPDATE memories
    SET is_active = FALSE, updated_at = NOW()
    WHERE user_id = $1 AND id = $2
    RETURNING id
  `;

  const { rows } = await pool.query(query, [userId, memoryId]);

  return rows.length > 0;
}


