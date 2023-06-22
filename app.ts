import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import apiRoutes from "./app/routes/api.routes";
import { db } from "./app/models";

dotenv.config();
const app = express();

// Settings
const PORT = process.env.PORT || 8000;
app.set("port", PORT);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ConnectDB
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Routes

app.use("/api", apiRoutes);

export default app;
