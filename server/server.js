const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
require("dotenv").config();

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

// Event Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);

    next();
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.post("/api/content", (req, res) => {
    console.log(req.body);
})

app.listen(PORT, (e) => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
