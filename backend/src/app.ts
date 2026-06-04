import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import storyRoutes from "./routes/story.routes";
import branchRoutes from "./routes/branch.routes";
import commitRoutes from "./routes/commit.routes";
import forkRoutes from "./routes/fork.routes";
import collaborateRoutes from "./routes/collaborate.routes";
import publishRoutes from "./routes/publish.routes";
import ratingRoutes from "./routes/rating.routes";
import aiRoutes from "./routes/ai.routes";
import exportRoutes from "./routes/export.routes";
import helmet from "helmet";
import morgan from "morgan";

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many AI requests, please slow down.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts, try again later.",
  },
});

dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan("combined"));

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

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

app.use("/api/stories/:storyId/branches", branchRoutes);

app.use("/api/stories/:storyId/branches/:branchId/commits", commitRoutes);

app.use("/api/stories", forkRoutes);
app.use("/api/forks", forkRoutes);

app.use("/api/stories", collaborateRoutes);
app.use("/api/collaborations", collaborateRoutes);

app.use("/api/stories", publishRoutes);
app.use("/api", publishRoutes);
app.use("/api/endings", ratingRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/stories", exportRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ForkTale server running on port ${PORT}`);
});

export default app;
