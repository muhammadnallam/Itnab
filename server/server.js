import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import articleRouter from "./modules/article/article.routes.js";
import uploadRouter from "./modules/upload/upload.routes.js";
import userRouter from "./modules/user/user.routes.js";
import feedRouter from "./modules/feed/feed.routes.js";
import interactionsRouter from "./modules/interactions/interactions.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";
import exploreRouter from "./modules/explore/explore.routes.js";
import searchRouter from "./modules/search/search.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { startGravityCron } from "./lib/gravity.js";
import { startAuthorScoreCron, recomputeAuthorScores } from "./lib/author-score.js";
import { checkCronSecret, feedGravityHandler, authorScoreHandler } from "./modules/jobs/jobs.routes.js";
import logger from "./middleware/logger.js";

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT ?? 10000;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: (process.env.FRONTEND_URL ?? "http://localhost:5000")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        credentials: true,
    }),
);

app.use(logger);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.post("/api/jobs/feed-gravity", checkCronSecret, feedGravityHandler);
app.post("/api/jobs/author-score", checkCronSecret, authorScoreHandler);

app.all("/api/auth/{*any}", logger, toNodeHandler(auth));

app.use("/api/article", articleRouter);

app.use("/api/upload", uploadRouter);

app.use("/api/user", userRouter);

app.use("/api/feed", feedRouter);

app.use("/api", interactionsRouter);

app.use("/api", commentRouter);

app.use("/api/explore", exploreRouter);
app.use("/api/search", searchRouter);

app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "حدث خطأ داخلي في الخادم" });
});

if (process.env.ENABLE_IN_PROCESS_CRON !== "false") {
    startGravityCron();
    startAuthorScoreCron();
} else {
    console.log("In-process cron disabled (ENABLE_IN_PROCESS_CRON=false)");
}
recomputeAuthorScores()
    .then((c) => console.log(`[author-score] Initial recompute: ${c} authors`))
    .catch((err) => console.error("[author-score] Initial recompute failed:", err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
