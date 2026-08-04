import { signUp, signIn, signOut } from "./auth.service.js";
import validateEmailPassword from "./auth.schema.js";
import { Router } from "express";

const router = Router();

router.post(
    "/sign-up",
    asyncErrorHandler(async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const errors = validateEmailPassword({ email, password });
        if (errors) {
            res.status(400).json({
                success: false,
                errors: errors,
                message: "بيانات التسجيل غير صالحة",
            });
        }

        try {
            await signUp(email, password);
            res.status(200).json({
                success: true,
                message: "تم التسجيل بنجاح",
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                message: "حدث خطأ أثناء تسجيل الدخول, برجاء المحاولة لاحقًا",
            });
        }
    }),
);
