import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
