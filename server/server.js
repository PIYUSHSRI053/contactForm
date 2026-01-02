import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
