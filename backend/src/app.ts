import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

//middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Health check
app.get("/", (req, res) => {
  res.json({ message: "ForkTale API is Running..." });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ForkTale server running on port ${PORT}`);
});

export default app;
