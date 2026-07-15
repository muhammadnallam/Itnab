import "dotenv/config";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateFromEmail } from "unique-username-generator";
import User from "../models/user.js";

const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

const user = new User();

const setJwtCookie = (data, res) => {
    const token = jwt.sign(
        { userId: data.id, username: data.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        protected: NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000,
        path: "/",
    });
};

const validateUser = (email, password) => {
    const userSchema = z.object({
        email: z.string().email("البريد الإلكتروني غير صالح"),
        password: z
            .string()
            .min(8, "الحد الأدنى 8 أحرف لكلمة المرور")
            .max(20, "الحد الأقصى 20 حرفًا لكلمة المرور"),
    });

    const result = userSchema.safeParse({
        email: email,
        password: password,
    });

    const errorMessage = !result.success
        ? result.error.issues[0].message
        : null;

    return { success: result.success, error: errorMessage };
};

const logIn = async (email, password, res) => {
    const result = validateUser(email, password);
    if (!result.success) {
        return result;
    }

    const data = await user.findByEmail(email);
    if (!data) {
        return { success: false, error: "هذا الحساب غير مسجل" };
    }

    const isPass = await bcrypt.compareSync(password, data.password);
    if (!isPass) {
        return { success: false, error: "كلمة المرور غير صحيحة" };
    }

    setJwtCookie(data, res);

    return { success: true };
};

const register = async (email, password) => {
    const result = validateUser(email, password);
    if (!result.success) {
        return result;
    }

    const user = await user.findByEmail(email);
    if (user) {
        return { success: false, error: "الحساب موجود بالفعل" };
    }

    const username = generateFromEmail(email, 3);
    const hash = await bcrypt.hashSync(password, 10);
    console.log(hash);

    try {
        const data = await user.add(username, email, hash);
        setJwtCookie(data, res);
        return { success: true };
    } catch {
        return { success: false, error: "حدث خطأ أثناء المحاولة" };
    }

};

const remove = async (userId) => {
    try {
        await user.remove(userId);
        return { success: true };
    } catch {
        return { success: false, error: "حدث خطأ أثناء مسح الحساب" };
    }
};

export { logIn, register, remove };
