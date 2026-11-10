import pool from "../config/database.js";


//create a conversation
export async function createConversation(userID, title="New Conversation") {
  const query = `
     INSERT INTO conversations (user_id, title)
     values ($1, $2)
     RETURNING id, user_id, title, created_at, updated_at
  `;
  const values = [userID, title.trim() || "New Conversation"];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

//get all conversations for a user
export async function getConversationsByUser(userID, limit=20, offset = 0){
   const query = `
        SELECT id, title, created_at, updated_at
        FROM conversations
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
   `;
   const values = [userID, limit, offset];
   const { rows } = await pool.query(query, values);
   return rows[0] || null;
} 


//get a conversation by id
export async function getConversationById(conversationID){
    const query = `
    SELECT id, user_id, title, created_at, updated_at
    FROM conversations
    WHERE user_id = $1 AND id = $2
    `;
     const values = [userId, conversationID];
    const {rows} = await pool.query(query, values);
    return rows[0] || null;
}

//update a converstaion title
export async function updateConversationTitle(userId, conversationId, title){
    const query = `
     UPDATE conversations
     SET title = $3, updated_at = NOW()
     WHERE user_id= $1 AND id = $2
     RETURINING id, title, updated_at
    `;

    const {rows} = await pool.query(query, [userId, conversationId, title.trim()]);
    return rows[0] || null;
}

// Delete a conversation belonging to a user
export async function deleteConversation(userId, conversationId) {
  const query = `
    DELETE FROM conversations
    WHERE user_id = $1 AND id = $2
    RETURNING id
  `;

  const { rows } = await pool.query(query, [userId, conversationId]);

  return rows.length > 0;
}