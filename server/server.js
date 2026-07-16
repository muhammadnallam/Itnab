import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import articleRouter from "./routes/article.js";
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

app.post("/api/content", (req, res) => {
    console.log(req.body);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
