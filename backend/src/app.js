import express from "express";
import cors from "cors";
import heml from "helmet";
import pool from "./config/database.js";
import apiRoutes from "./routes/index.js";
const app = express();

app.use(cors());
app.use(heml());
app.use(express.json());

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
            message: "Error connecting to the database",
            error: error.message
        });
    }
})

app.use("/api", apiRoutes);
export default app;