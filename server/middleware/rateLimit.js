import { rateLimit } from "express-rate-limit";

const MESSAGE = { error: "عدد المحاولات كبير جدًا. حاول مرة أخرى بعد قليل" };

function authRateLimitHandler(req, res) {
    const resetTime = req.rateLimit?.resetTime;
    const seconds = resetTime
        ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
        : 60;

    res.set("Retry-After", String(seconds));
    res.status(429).json({
        message: `لقد تخطيت الحد المسموح به من المحاولات، حاول مرة أخرى بعد ${seconds} ثانية`,
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: seconds,
    });
}

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: authRateLimitHandler,
});

export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: authRateLimitHandler,
});

export const emailCheckLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: MESSAGE,
});

export const viewLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: MESSAGE,
});

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: MESSAGE,
});

export const shareLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: MESSAGE,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: MESSAGE,
});
