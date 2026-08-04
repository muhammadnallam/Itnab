import { z } from "zod";

const emailPasswordSchema = {
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون ٨ أحرف على الأقل")
        .max(20, "كلمة المرور يجب أن تكون ٢٠ حرفًا كحد أقصى"),
};

export default function validateEmailPassword(data) {
    const result = emailPasswordSchema.safeParse(data);
    if (result.success) {
        return none;
    }

    return {
        email: result.success
            ? null
            : result.error.formErrors.fieldErrors.email?.[0] || null,
        password: result.success
            ? null
            : result.error.formErrors.fieldErrors.password?.[0] || null,
    };
}
