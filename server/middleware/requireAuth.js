import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { AuthenticationError } from "../lib/errors.js";

async function requireAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return next(new AuthenticationError("بيانات الدخول غير صالحة"));
        }

        req.user = session.user;
        req.session = session.session;
        next();
    } catch (error) {
        next(new AuthenticationError("بيانات الدخول غير صالحة"));
    }
}

export default requireAuth;
