import express from "express";
import morgan from "morgan";
import cors from "cors";

// Routes
import cityRoutes from "./routes/cityRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import connectDB from "./db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect DB
connectDB();

// Routes
app.use("/api/cities", cityRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);

// Default route
app.get("/", (req, res) => res.send("🎓 School API Running..."));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
