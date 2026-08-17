import { rateLimit } from "express-rate-limit";

const MESSAGE = { error: "عدد المحاولات كبير جدًا. حاول مرة أخرى بعد قليل" };

export const viewLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
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
