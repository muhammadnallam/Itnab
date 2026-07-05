const jwt = require("jsonwebtoken");

const verifyCookie = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({message: "Missing JWT cookie"});
    }

    try {
        const decoded = jwt.decode(token);
        req.user = decoded
        next();
    } catch {
        res.status(401).json({message: "Invalid or expired token"})
    }
}

module.exports = verifyCookie;