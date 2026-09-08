import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { getRecommendations } from "./explore.service.js";

const router = Router();

router.get(
    "/recommendations",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        const result = await getRecommendations({ userId: req.user?.id });
        res.json(result);
    }),
);

export default router;
