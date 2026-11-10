import pool from "../config/database.js";

// save a message

export async function createMessage(
    userId,
    conversationId,
    role,
    content,
    metadata = {}
){
    const query = `
        INSERT INTO messages(user_id,
        conversation_id, role, content,metadata)
        SELECT c.id, $3, $4, $5
        From conversations c
        WHERE c.user_id = $1 AND c.id = $2
        RETURNING id, user_id, conversation_id, role, content, metadata, created_at, updated_at
    `;
    const values = [userId, conversationId, role, content, metadata];
    const {rows} = await pool.query(query, values);
    return rows[0] || null;
}

// conversation history
export async function getConversationMessages(
  userId,
  conversationId,
  limit = 50,
  offset = 0
) {
  const query = `
    SELECT m.id, m.role, m.content, m.metadata, m.created_at
    FROM messages m
    INNER JOIN conversations c
      ON c.id = m.conversation_id
    WHERE c.id = $1 AND c.user_id = $2
    ORDER BY m.created_at ASC
    LIMIT $3 OFFSET $4
  `;

  const values = [conversationId, userId, limit, offset];

  const { rows } = await pool.query(query, values);

  return rows;
}
