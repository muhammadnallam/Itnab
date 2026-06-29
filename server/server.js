const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5000",
        credentials: true,
    }),
);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, (e) => {
    console.log(`Listening on port ${PORT}`);
});
