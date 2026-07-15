import jwt from "jsonwebtoken";

const verifyCookie = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({message: "Missing JWT cookie"});
        return;
    }

    try {
        const decoded = jwt.decode(token);
        req.user = decoded
        next();
    } catch {
        res.status(401).json({message: "Invalid or expired token"})
        return;
    }
}

export default verifyCookie;
