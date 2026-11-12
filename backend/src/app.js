import express from "express";
import cors from "cors";
import heml from "helmet";
import pool from "./config/database.js";
import apiRoutes from "./routes/index.js";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});
app.use(cors());
app.use(heml());
app.use(express.json({ limit: "100kb" }));

app.get("/" ,(req, res) => {
    res.status(200).json({
     success: true,
     message: "Welcome to the API!"
     });
});



app.get("/db", async(req,res)=>{
    try{
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            message: "Database connection successful",
            data: result.rows[0]
        }); 
    }catch(error){
        console.error("Error connecting to the database:", error);
        res.status(503).json({
        success: false,
        message: "Database service unavailable."
    });
    }
})

app.use("/api", apiRateLimiter);
app.use("/api", apiRoutes);
app.use(errorHandler);
export default app;