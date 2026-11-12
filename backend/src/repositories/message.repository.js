
import pool from "../config/database.js";

// Save a new message
export async function createMessage(
  userId,
  conversationId,
  role,
  content,
  metadata = {}
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = `
      INSERT INTO messages (
        conversation_id,
        role,
        content,
        metadata
      )
      SELECT c.id, $3, $4, $5
      FROM conversations c
      WHERE c.user_id = $1 AND c.id = $2
      RETURNING id, conversation_id, role, content, metadata, created_at
    `;

    const { rows } = await client.query(query, [
      userId,
      conversationId,
      role,
      content,
      metadata
    ]);

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `UPDATE conversations
       SET updated_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );

    await client.query("COMMIT");

    return rows[0];
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Transaction rollback failed:", rollbackError.message);
    }

    throw error;
  } finally {
    client.release();
  }
}


// Get conversation history
export async function getConversationMessages(
  userId,
  conversationId,
  limit = 50,
  offset = 0
) {
  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    throw new Error("Invalid pagination values");
  }

  const query = `
    SELECT
      m.id,
      m.role,
      m.content,
      m.metadata,
      m.created_at
    FROM messages m
    INNER JOIN conversations c
      ON c.id = m.conversation_id
    WHERE c.id = $1 AND c.user_id = $2
    ORDER BY m.created_at ASC
    LIMIT $3 OFFSET $4
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    userId,
    limit,
    offset
  ]);

  return rows;
}


// Get messages across all conversations for a date range
export async function getUserMessagesByDate(
  userId,
  startDate,
  endDate,
  limit = 100
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    !startDate ||
    !endDate ||
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start >= end
  ) {
    throw new Error("Invalid date range");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new Error("Invalid result limit");
  }

  const query = `
    SELECT
      m.id,
      m.conversation_id,
      c.title AS conversation_title,
      m.role,
      m.content,
      m.metadata,
      m.created_at
    FROM messages m
    INNER JOIN conversations c
      ON c.id = m.conversation_id
    WHERE c.user_id = $1
      AND m.created_at >= $2::timestamptz
      AND m.created_at < $3::timestamptz
    ORDER BY m.created_at ASC
    LIMIT $4
  `;

  const { rows } = await pool.query(query, [
    userId,
    startDate,
    endDate,
    limit
  ]);

  return rows;
}


// Search messages across all conversations by relevant keywords
export async function getUserMessagesByTopic(
  userId,
  searchQuery,
  limit = 30
) {
  if (
    typeof searchQuery !== "string" ||
    !searchQuery.trim()
  ) {
    throw new Error("A valid search query is required");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Invalid result limit");
  }

  const stopWords = new Set([
    "what", "when", "where", "which", "who",
    "have", "has", "had", "did", "does",
    "about", "with", "from", "that", "this",
    "were", "was", "are", "the", "and",
    "for", "you", "your", "our", "previously",
    "discuss", "discussed", "talk", "talked",
    "remember", "recall", "tell", "me"
  ]);

  const keywords = [
    ...new Set(
      searchQuery.toLowerCase().match(/[a-z0-9]{3,}/g) || []
    )
  ].filter((word) => !stopWords.has(word));

  if (keywords.length === 0) {
    throw new Error("No meaningful search keywords found");
  }

  const query = `
    SELECT
      m.id,
      m.conversation_id,
      c.title AS conversation_title,
      m.role,
      m.content,
      m.metadata,
      m.created_at,
      (
        SELECT COUNT(*)
        FROM unnest($2::text[]) AS k(word)
        WHERE (
          ' ' || regexp_replace(
            lower(m.content),
            '[^a-z0-9]+',
            ' ',
            'g'
          ) || ' '
        ) LIKE '% ' || k.word || ' %'
      ) AS match_count

    FROM messages m
    INNER JOIN conversations c
      ON c.id = m.conversation_id

    WHERE c.user_id = $1
      AND EXISTS (
        SELECT 1
        FROM unnest($2::text[]) AS k(word)
        WHERE (
          ' ' || regexp_replace(
            lower(m.content),
            '[^a-z0-9]+',
            ' ',
            'g'
          ) || ' '
        ) LIKE '% ' || k.word || ' %'
      )

    ORDER BY match_count DESC, m.created_at DESC
    LIMIT $3
  `;

  const { rows } = await pool.query(query, [
    userId,
    keywords,
    limit
  ]);

  return rows;
}
