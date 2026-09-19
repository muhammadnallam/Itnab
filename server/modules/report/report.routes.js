import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import { reportLimiter } from "../../middleware/rateLimit.js";
import { ValidationError } from "../../lib/errors.js";
import { reportSchema } from "./report.schema.js";
import { createReport } from "./report.service.js";

const router = Router();

router.post(
    "/",
    requireAuth,
    reportLimiter,
    asyncErrorHandler(async (req, res) => {
        const parsed = reportSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        await createReport({ ...parsed.data, reporterId: req.user.id });
        res.status(201).json({ success: true });
    }),
);

export default router;
