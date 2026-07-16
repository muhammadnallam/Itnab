import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

import { generateFromEmail } from "unique-username-generator";

import { localization } from "better-auth-localization";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const baseAdapter = prismaAdapter(prisma, { provider: "postgresql" });

// BetterAuth doesn't invoke before database hook automatically, it is a limitation in the current architecture
const adapterFn = (schemaOptions: any) => {
    const adapter = baseAdapter(schemaOptions);
    const originalCreate = adapter.create.bind(adapter);

    adapter.create = async ({ model, data, select }: any) => {
        if (model === "user") {
            data = {
                ...data,
                username: data.username || generateFromEmail(data.email, 3),
            };
        }
        return originalCreate({ model, data, select });
    };

    return adapter;
};

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:5000", "https://itnab.com"],
    database: adapterFn as any,
    // BetterAuth generates non-UUID IDs by default
    advanced: {
        database: {
            generateId: "uuid",
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    plugins: [
        localization({
            defaultLocale: "ar-SA",
            fallbackLocale: "default",
            getLocale: () => {
                return "ar-SA";
            },
            translations: {
                "ar-SA": {
                    USER_NOT_FOUND:
                        "البريد الإلكتروني أو كلمة المرور غير صحيحة",
                    INVALID_EMAIL_OR_PASSWORD:
                        "البريد الإلكتروني أو كلمة المرور غير صحيحة",
                    INVALID_PASSWORD: "كلمة المرور غير صحيحة",
                    INVALID_EMAIL:
                        "صيغة البريد الإلكتروني غير صحيحة. تأكد من كتابته بشكل صحيح",
                    INVALID_USER:
                        "لا يمكن الوصول إلى هذا الحساب. يرجى المحاولة مرة أخرى أو التواصل مع الدعم",
                    INVALID_TOKEN: "الرمز المرسل غير صحيح أو انتهت صلاحيته",
                    TOKEN_EXPIRED: "انتهت صلاحية الرمز. اطلب واحدًا جديدًا",
                    SESSION_EXPIRED:
                        "جلستك انتهت من أجل أمانك. يرجى تسجيل الدخول مرة أخرى",
                    SESSION_NOT_FRESH:
                        "لأسباب أمنية، يرجى تسجيل الدخول مرة أخرى",
                    FAILED_TO_CREATE_SESSION:
                        "تعذر تسجيل دخولك. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
                    FAILED_TO_GET_SESSION:
                        "حدث خطأ في تحميل حسابك. يرجى تحديث الصفحة والمحاولة مرة أخرى",

                    // -- User --
                    USER_ALREADY_EXISTS:
                        "هذا البريد الإلكتروني مسجّل بالفعل. جرّب تسجيل الدخول أو استخدم بريدًا آخر",
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
                        "هذا البريد الإلكتروني مسجّل بالفعل. لديك حساب بالفعل؟ سجّل الدخول الآن",
                    USER_EMAIL_NOT_FOUND:
                        "لا يوجد حساب بهذا البريد الإلكتروني. هل تريد إنشاء حساب جديد؟",
                    FAILED_TO_CREATE_USER:
                        "تعذر إنشاء حسابك. يرجى المحاولة لاحقًا أو التواصل مع فريق الدعم إذا استمرت المشكلة",
                    FAILED_TO_UPDATE_USER:
                        "تعذر تحديث بيانات حسابك. يرجى التحقق والمحاولة مرة أخرى",
                    EMAIL_NOT_VERIFIED:
                        "البريد الإلكتروني لم يتم التحقق منه بعد. تحقق من صندوق بريدك أو اطلب رسالة تحقق جديدة",
                    EMAIL_ALREADY_VERIFIED:
                        "البريد الإلكتروني تم التحقق منه بالفعل ✓",
                    EMAIL_MISMATCH:
                        "البريد الإلكتروني المدخل لا يتطابق مع الحساب",
                    EMAIL_CAN_NOT_BE_UPDATED:
                        "لا يمكن تغيير البريد الإلكتروني الآن. حاول بعد ساعات قليلة أو تواصل مع الدعم",
                    CHANGE_EMAIL_DISABLED:
                        "ميزة تغيير البريد الإلكتروني معطلة مؤقتًا. عذرًا، سنعود قريبًا",

                    // -- Password --
                    PASSWORD_TOO_SHORT:
                        "كلمة المرور قصيرة جدًا. استخدم 8 أحرف على الأقل",
                    PASSWORD_TOO_LONG:
                        "كلمة المرور طويلة جدًا. الحد الأقصى 20 حرفًا",
                    PASSWORD_WEAK:
                        "كلمة المرور ضعيفة. استخدم حروفًا كبيرة وصغيرة وأرقامًا ورموزًا خاصة",
                    USER_ALREADY_HAS_PASSWORD:
                        "لديك بالفعل كلمة مرور. استخدمها لتسجيل الدخول",
                    PASSWORD_ALREADY_SET:
                        "إعادة تعيين كلمة المرور غير ممكنة الآن. تحقق من بريدك للحصول على رابط صحيح",

                    // -- Social / OAuth --
                    SOCIAL_ACCOUNT_ALREADY_LINKED:
                        "هذا الحساب (Google/Facebook) مرتبط بحساب آخر بالفعل. استخدم حساب اجتماعي آخر أو سجّل الدخول بطريقة أخرى",
                    LINKED_ACCOUNT_ALREADY_EXISTS:
                        "هذا الحساب الاجتماعي مرتبط بحساب آخر بالفعل",
                    FAILED_TO_UNLINK_LAST_ACCOUNT:
                        "لا يمكنك فصل الحساب الاجتماعي الأخير. تحتاج إلى طريقة تسجيل دخول واحدة على الأقل",
                    PROVIDER_NOT_FOUND:
                        "خدمة تسجيل الدخول هذه غير متاحة حاليًا. حاول طريقة أخرى أو تواصل مع الدعم",
                    FAILED_TO_GET_USER_INFO:
                        "تعذر استرجاع معلومات حسابك من خدمة التسجيل. حاول مرة أخرى أو استخدم طريقة أخرى",
                    ID_TOKEN_NOT_SUPPORTED:
                        "هذه الطريقة غير مدعومة حاليًا. استخدم طريقة تسجيل دخول أخرى",
                    CREDENTIAL_ACCOUNT_NOT_FOUND:
                        "لا يوجد حساب مرتبط بهذا البريد الإلكتروني. هل تريد إنشاء حساب جديد؟",

                    // -- Verification --
                    FAILED_TO_CREATE_VERIFICATIO:
                        "تعذر إرسال رمز التحقق. يرجى التحقق من البريد الإلكتروني والمحاولة مرة أخرى",
                    VERIFICATION_EMAIL_NOT_ENABLED:
                        "التحقق عبر البريد الإلكتروني غير متاح حاليًا. حاول لاحقًا أو استخدم طريقة أخرى",
                    INVALID_OTP:
                        "رمز التحقق غير صحيح. تأكد من إدخاله بشكل صحيح",
                    OTP_EXPIRED: "انتهت صلاحية رمز التحقق. اطلب رمزًا جديدًا",
                    OTP_ATTEMPTS_EXCEEDED:
                        "تجاوزت عدد محاولات التحقق المسموح بها. حاول مرة أخرى لاحقًا",

                    // -- Validation --
                    VALIDATION_ERROR:
                        "تحقق من البيانات المرسلة والمحاولة مرة أخرى",
                    MISSING_FIELD: "هذا الحقل مطلوب",
                    FIELD_NOT_ALLOWED: "لا يمكن تعديل هذا الحقل",
                    BODY_MUST_BE_AN_OBJECT:
                        "البيانات المرسلة غير صحيحة. تأكد من صيغتها",
                    ASYNC_VALIDATION_NOT_SUPPORTED:
                        "هذا النوع من التحقق غير مدعوم حاليًا",

                    // -- Security --
                    CROSS_SITE_NAVIGATION_LOGIN_BLOCKED:
                        "تم حظر هذه المحاولة لأسباب أمنية. حاول من جديد أو تواصل مع الدعم",
                    INVALID_ORIGIN:
                        "مصدر الطلب غير مصرح به. تأكد من الموقع الصحيح",
                    RATE_LIMIT_EXCEEDED:
                        "عدد المحاولات كثير جدًا. حاول مرة أخرى بعد قليل",
                    ACCOUNT_LOCKED:
                        "تم قفل الحساب مؤقتًا بسبب محاولات دخول متكررة. حاول مرة أخرى بعد 15 دقيقة",
                    ACCOUNT_SUSPENDED:
                        "تم إيقاف هذا الحساب. تواصل مع الدعم الفني لمزيد من التفاصيل",

                    // -- Redirect / Callback URLs --
                    INVALID_CALLBACK_URL:
                        "رابط الإعادة غير صحيح. تحقق من إعدادات التطبيق",
                    INVALID_REDIRECT_URL: "رابط التحويل غير صحيح",
                    INVALID_ERROR_CALLBACK_URL: "رابط إعادة الأخطاء غير صحيح",
                    NVALID_NEW_USER_CALLBACK_URL:
                        "رابط إعادة المستخدم الجديد غير صحيح",
                    MISSING_OR_NULL_ORIGIN:
                        "مصدر الطلب غير موجود. تحقق من الإعدادات",
                    CALLBACK_URL_REQUIRED: "رابط الإعادة مطلوب",

                    // -- Misc --
                    ACCOUNT_NOT_FOUND:
                        "الحساب غير موجود. قد يكون قد تم حذفه. تواصل مع الدعم للمزيد من المعلومات",
                    METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED:
                        "لا يمكن إكمال هذه العملية حاليًا. تحديث الصفحة قد يساعد",
                    SERVER_ERROR: "حدث خطأ من جانبنا. يرجى المحاولة لاحقًا",
                    NETWORK_ERROR:
                        "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
                },
            },
        }),
    ],
});
