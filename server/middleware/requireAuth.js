import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

async function requireAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            res.status(401).json({ error: "بيانات الدخول غير صالحة" });
            return;
        }

        req.user = session.user;
        req.session = session.session;
        next();
    } catch (error) {
        res.status(401).json({ error: "بيانات الدخول غير صالحة" });
    }
}

export default requireAuth;
