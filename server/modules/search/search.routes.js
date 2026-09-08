import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import { search } from "./search.service.js";
import { searchQuerySchema } from "./search.schema.js";
import { ValidationError } from "../../lib/errors.js";

const router = Router();

router.get(
    "/",
    asyncErrorHandler(async (req, res) => {
        const parsed = searchQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const result = await search(parsed.data);
        res.json(result);
    }),
);

export default router;
