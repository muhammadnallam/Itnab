import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import articleRouter from "./routes/article.js";
import uploadRouter from "./routes/upload.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import logger from "./middleware/logger.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5000",
        credentials: true,
    }),
);

app.use(logger);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/article", articleRouter);

app.use("/api/upload", uploadRouter);

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "حدث خطأ داخلي في الخادم" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
