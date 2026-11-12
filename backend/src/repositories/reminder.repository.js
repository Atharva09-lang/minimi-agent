import pool from "../config/database.js";

//create a reminder
export async function createReminder(
    userId,
    message,
    scheduleAt,
    timezone = "UTC",
    memoryId = null
){
    const query = `
       INSERT INTO reminders(
        user_id,memory_id, message, scheduled_at, timezone
       )
       SELECT $1, $2, $3, $4, $5
       where $2::uuid IS NULL OR EXISTS(
        SELECT 1
        FROM memories m
        WHERE m.id = $2::uuid AND m.user_id = $1
       )
       RETURNING *
    `;

    const {rows} = await pool.query(query,[
        userId,
        memoryId,
        message,
        scheduleAt,
        timezone
    ]);
    return rows[0] || null;
}

//get all reminders of a user
export async function getUserReminders(
    userId,
    limit = 50,
    offset = 0
){
    const query =`
      select *
      from reminders
      where user_id = $1
      order by scheduled_at desc
      limit $2 offset $3
    `;
    const {rows} = await pool.query(query, [userId, limit, offset]);
    return rows;
}

//get reminders that are due
export async function getDueReminders(limit = 50){
    const query = `
      select *
      from reminders
      where status = 'pending'
        and scheduled_at <= now()
      order by scheduled_at asc
      limit $1
    `;
    const {rows} = await pool.query(query, [limit]);
    return rows;
}


// get due reminders for a specific user
export async function getDueRemindersForUser(userId, limit = 20) {
  const query = `
    SELECT *
    FROM reminders
    WHERE user_id = $1
      AND status = 'pending'
      AND scheduled_at <= NOW()
    ORDER BY scheduled_at ASC
    LIMIT $2
  `;

  const { rows } = await pool.query(query, [userId, limit]);

  return rows;
}



// Cancel a pending reminder
export async function cancelReminder(userId, reminderId) {
  const query = `
    UPDATE reminders
    SET status = 'cancelled'
    WHERE user_id = $1
      AND id = $2
      AND status = 'pending'
    RETURNING id
  `;

  const { rows } = await pool.query(query, [userId, reminderId]);

  return rows.length > 0;
}

// Mark a reminder as sent
export async function markReminderAsSent(userId, reminderId) {
  const query = `
    UPDATE reminders
    SET status = 'sent', sent_at = NOW()
    WHERE user_id = $1
      AND id = $2
      AND status = 'pending'
    RETURNING *
  `;

  const { rows } = await pool.query(query, [userId, reminderId]);

  return rows[0] || null;
}