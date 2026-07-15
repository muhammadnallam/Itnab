import { Router } from "express";
import { logIn, register, remove } from "../controllers/authController.js";
import verifyCookie from "../middleware/requireAuth.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await logIn(email, password, res);
    if (!result.success) {
        res.status(401).json(result);
        return;
    }

    res.json(result);
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const result = await register(email, password, res);
    console.log(result);
    if (!result.success) {
        res.status(401).json(result);
        return;
    }

    res.json(result);
});

router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.json({ success: true });
});

router.delete("/delete", verifyCookie, async (req, res) => {
    await remove(req.userId);
    res.json({ success: true });
});

router.get("/me", verifyCookie, (req, res) => {
    res.json(req.user);
});

export default router;
