import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const mailFrom = process.env.MAIL_FROM;

const resend = apiKey ? new Resend(apiKey) : null;

async function sendEmail({ to, subject, html }) {
    if (!resend || !mailFrom) {
        throw new Error(
            "Email is not configured: RESEND_API_KEY and MAIL_FROM are required",
        );
    }

    const { error } = await resend.emails.send({
        from: mailFrom,
        to,
        subject,
        html,
    });

    if (error) {
        console.error("[email] Failed to send email:", error);
    }
}

const layout = (content) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Tahoma,Arial,sans-serif;color:#1f2430;">
        <div style="max-width:480px;margin:0 auto;padding:32px 16px;">
            <div style="background:#ffffff;border-radius:12px;padding:32px 28px;text-align:center;">
                ${content}
            </div>
            <p style="text-align:center;font-size:12px;color:#8a8f9a;margin-top:20px;">
                إطناب — نافذة على الفكر والقلم العربي
            </p>
        </div>
    </body>
</html>`;

export function assertEmailConfigured() {
    if (!resend || !mailFrom) {
        throw new Error(
            "Email is not configured: RESEND_API_KEY and MAIL_FROM are required",
        );
    }
}

export async function sendOtpEmail({ email, otp, type }) {
    const isVerification = type === "email-verification";

    const subject = isVerification
        ? "رمز التحقق من بريدك الإلكتروني"
        : "رمز إعادة تعيين كلمة المرور";
    const heading = isVerification
        ? "تأكيد البريد الإلكتروني"
        : "إعادة تعيين كلمة المرور";
    const body = isVerification
        ? "استخدم الرمز التالي لتأكيد بريدك الإلكتروني. الرمز صالح لمدة 5 دقائق."
        : "استخدم الرمز التالي لإعادة تعيين كلمة المرور. الرمز صالح لمدة 5 دقائق.";

    await sendEmail({
        to: email,
        subject,
        html: layout(`
            <h1 style="font-size:20px;margin:0 0 12px;">${heading}</h1>
            <p style="font-size:14px;line-height:1.7;color:#4b5563;margin:0 0 24px;">
                ${body}
            </p>
            <div style="font-size:32px;font-weight:700;letter-spacing:8px;direction:ltr;background:#f4f4f5;border-radius:10px;padding:16px 0;">
                ${otp}
            </div>
            <p style="font-size:13px;line-height:1.7;color:#8a8f9a;margin:24px 0 0;">
                إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة.
            </p>
        `),
    });
}

export async function sendPasswordResetEmail({ user, url }) {
    await sendEmail({
        to: user.email,
        subject: "إعادة تعيين كلمة المرور",
        html: layout(`
            <h1 style="font-size:20px;margin:0 0 12px;">إعادة تعيين كلمة المرور</h1>
            <p style="font-size:14px;line-height:1.7;color:#4b5563;margin:0 0 24px;">
                وصلنا طلب لإعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لاختيار كلمة مرور جديدة. الرابط صالح لمدة 15 دقيقة ولمرة واحدة فقط.
            </p>
            <a href="${url}" style="display:inline-block;background:#1f2430;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:12px 28px;border-radius:10px;">
                إعادة تعيين كلمة المرور
            </a>
            <p style="font-size:13px;line-height:1.7;color:#8a8f9a;margin:24px 0 0;">
                إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذه الرسالة.
            </p>
        `),
    });
}

