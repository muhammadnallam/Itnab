import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import articleRouter from "./modules/article/article.routes.js";
import uploadRouter from "./modules/upload/upload.routes.js";
import userRouter from "./modules/user/user.routes.js";
import feedRouter from "./modules/feed/feed.routes.js";
import interactionsRouter from "./modules/interactions/interactions.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";
import notificationRouter from "./modules/notifications/notification.routes.js";
import exploreRouter from "./modules/explore/explore.routes.js";
import searchRouter from "./modules/search/search.routes.js";
import sitemapRouter from "./modules/sitemap/sitemap.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { startGravityCron } from "./lib/gravity.js";
import {
    startAuthorScoreCron,
    recomputeAuthorScores,
} from "./lib/author-score.js";
import logger from "./middleware/logger.js";
import { authLimiter, otpLimiter } from "./middleware/rateLimit.js";

const app = express();
// Exactly one reverse proxy in front (Coolify/Traefik): trust one hop.
app.set("trust proxy", 1);
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
        frameguard: { action: "deny" },
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        hsts: process.env.NODE_ENV === "production" ? undefined : false,
    }),
);
const PORT = Number(process.env.PORT) || 3000

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const corsOrigins =
    process.env.NODE_ENV === "production"
        ? (process.env.CORS_ORIGIN || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : ["http://localhost:5000"];

if (process.env.NODE_ENV === "production" && corsOrigins.length === 0) {
    throw new Error("CORS_ORIGIN must be set in production");
}

app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
    }),
);

app.use(logger);

app.get("/api/health", (req, res) => {
    console.log(
        "[health] ip:",
        req.ip,
        "xff:",
        req.headers["x-forwarded-for"],
    );
    res.json({ status: "ok" });
});

app.post("/api/auth/sign-in/email", authLimiter);
app.post("/api/auth/sign-up/email", authLimiter);
app.post("/api/auth/email-otp/send-verification-otp", otpLimiter);
app.post("/api/auth/email-otp/verify-email", otpLimiter);
app.post("/api/auth/request-password-reset", otpLimiter);
app.post("/api/auth/reset-password", otpLimiter);
app.post("/api/auth/sign-in/email-otp", otpLimiter);
app.post("/api/auth/email-otp/request-password-reset", otpLimiter);
app.post("/api/auth/email-otp/reset-password", otpLimiter);
app.post("/api/auth/email-otp/check-verification-otp", otpLimiter);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/article", articleRouter);

app.use("/api/upload", uploadRouter);

app.use("/api/user", userRouter);

app.use("/api/feed", feedRouter);

app.use("/api", interactionsRouter);

app.use("/api", commentRouter);

app.use("/api/notifications", notificationRouter);

app.use("/api/explore", exploreRouter);
app.use("/api/search", searchRouter);

app.use("/api/sitemap", sitemapRouter);

app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "حدث خطأ داخلي في الخادم" });
});

startGravityCron();
startAuthorScoreCron();
recomputeAuthorScores()
    .then((c) => console.log(`[author-score] Initial recompute: ${c} authors`))
    .catch((err) =>
        console.error("[author-score] Initial recompute failed:", err),
    );

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
