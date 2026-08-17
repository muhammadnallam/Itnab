import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

async function optionalAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session) {
      req.user = session.user;
      req.session = session.session;
    }
  } catch {
    // Treat as anonymous.
  }
  next();
}

export default optionalAuth;
