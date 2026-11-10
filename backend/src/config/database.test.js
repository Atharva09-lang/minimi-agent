import pool from "./database.js";

try{
    const result = await pool.query("SELECT NOW()");
    console.log("Database connection successful:", result.rows[0]);
} catch (error) {
    console.error("Error connecting to the database:", error);  
} finally {
    await pool.end();
}