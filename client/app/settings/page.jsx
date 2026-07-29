"use client";
import AppLayout from "@/components/AppLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import { ArrowUpRight, Globe } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { handlePassword, handleProfile, handleSocialLinks } from "@/lib/handlers";
import Tabs from "@/components/ui/Tabs";
import { UserContext } from "@/context/UserContext";
import { getProfile } from "@/lib/api";

const X = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={19}
        height={19}
        fill="var(--color-mid)"
        {...props}
    >
        <path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z" />
    </svg>
);

const YouTube = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={19}
        height={19}
        fill="var(--color-mid)"
        {...props}
    >
        <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z" />
    </svg>
);

const SettingRow = ({
    label,
    desc,
    value,
    control,
    topBorder = true,
    danger = false,
}) => (
    <div
        style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
            padding: "20px 0",
            borderTop: topBorder ? "1px solid var(--color-border)" : "none",
        }}
    >
        <div style={{ flex: 1 }}>
            <div
                style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: danger ? "var(--color-error)" : "var(--color-ink)",
                    marginBottom: desc ? 4 : 0,
                }}
            >
                {label}
            </div>
            {desc && (
                <p
                    style={{
                        fontSize: 13,
                        color: "var(--color-mid)",
                        margin: 0,
                        lineHeight: 1.55,
                    }}
                >
                    {desc}
                </p>
            )}
        </div>
        <div
            style={{
                flexShrink: 0,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
        >
            {value && (
                <span style={{ fontSize: 14, color: "var(--color-mid)" }}>
                    {value}
                </span>
            )}
            {control}
        </div>
    </div>
);

const SectionHead = ({ title, mt = 40 }) => (
    <h2
        style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--color-ink)",
            marginTop: mt,
            marginBottom: 0,
        }}
    >
        {title}
    </h2>
);

const TabAccount = ({ profile, userId, onProfileUpdated }) => {
    const [name, setName] = useState(profile.name || "");
    const [username, setUsername] = useState(profile.username || "");
    const [bio, setBio] = useState(profile.bio || "");
    const [website, setWebsite] = useState(profile.socialLinks?.website || "");
    const [youtube, setYoutube] = useState(profile.socialLinks?.youtube || "");
    const [xAccount, setXAccount] = useState(profile.socialLinks?.x || "");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [linksErrors, setLinksErrors] = useState({});
    const [linksLoading, setLinksLoading] = useState(false);

    const handleProfileSubmit = async () => {
        setErrors({});
        setLoading(true);
        const result = await handleProfile({ name, username, bio });
        setLoading(false);
        if (Object.keys(result).length > 0) {
            setErrors(result);
            return;
        }
        onProfileUpdated({ name, username, bio });
    };

    const handleLinksSubmit = async () => {
        setLinksErrors({});
        setLinksLoading(true);
        const result = await handleSocialLinks({ website, youtube, x: xAccount });
        setLinksLoading(false);
        if (Object.keys(result).length > 0) {
            setLinksErrors(result);
            return;
        }
        onProfileUpdated({ socialLinks: { website, youtube, x: xAccount } });
    };

    return (
        <div>
            <SectionHead title="الملف الشخصي" mt={32} />

            {errors.apiError && <p className="api-error">{errors.apiError}</p>}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginTop: 16,
                }}
            >
                <Input
                    label="الاسم"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors((p) => ({ ...p, name: "" }));
                    }}
                    error={errors.name}
                />
                <Input
                    label="اسم المستخدم"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setErrors((p) => ({ ...p, username: "" }));
                    }}
                    error={errors.username}
                />
                <div>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            marginBottom: 5,
                        }}
                    >
                        النبذة التعريفية
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--border-radius)",
                            fontSize: 14,
                            color: "var(--color-ink)",
                            background: "var(--color-white)",
                            outline: "none",
                            direction: "rtl",
                            resize: "vertical",
                            boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "var(--color-accent)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "var(--color-border)";
                        }}
                    />
                </div>
            </div>
            <Button style={{ marginTop: 16 }} onClick={handleProfileSubmit} loading={loading}>
                تحديث حسابك
            </Button>

            <SectionHead title="الروابط" />

            {linksErrors.apiError && <p className="api-error">{linksErrors.apiError}</p>}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginTop: 16,
                }}
            >
                <Input
                    placeholder="yoursite.com"
                    value={website}
                    onChange={(e) => {
                        setWebsite(e.target.value);
                        setLinksErrors((p) => ({ ...p, website: "" }));
                    }}
                    rightIcon={<Globe color="var(--color-mid)" size={19} />}
                />
                <Input
                    placeholder="youtube.com/@yourchannel"
                    value={youtube}
                    onChange={(e) => {
                        setYoutube(e.target.value);
                        setLinksErrors((p) => ({ ...p, youtube: "" }));
                    }}
                    rightIcon={<YouTube />}
                />
                <Input
                    placeholder="x.com/youraccount"
                    value={xAccount}
                    onChange={(e) => {
                        setXAccount(e.target.value);
                        setLinksErrors((p) => ({ ...p, x: "" }));
                    }}
                    rightIcon={<X />}
                />
            </div>

            <Button style={{ marginTop: 16 }} onClick={handleLinksSubmit} loading={linksLoading}>
                تحديث الروابط
            </Button>

            <SectionHead title="منطقة خطر" />
            <SettingRow
                topBorder={false}
                label="حذف الحساب"
                desc="سيؤدي هذا إلى حذف حسابك وجميع محتواك بصورة دائمة."
                danger
                control={<Button variant="error">حذف الحساب</Button>}
            />
        </div>
    );
};

const TabPrivacy = () => {
    const [profilePublic, setProfilePublic] = useState(true);
    const [readingHistory, setReadingHistory] = useState(false);
    const [showClaps, setShowClaps] = useState(true);
    const [showReplies, setShowReplies] = useState(true);
    const [allowFollowers, setAllowFollowers] = useState(true);

    return (
        <>
            <SectionHead title="الخصوصية" mt={32} />

            <SettingRow
                topBorder={false}
                label="ملف شخصي عام"
                desc="عند التفعيل يمكن لأي شخص رؤية ملفك الشخصي وقصصك."
                control={
                    <Toggle
                        checked={profilePublic}
                        onChange={setProfilePublic}
                    />
                }
            />
            <SettingRow
                label="سجل القراءة"
                desc="احفظ قائمة بالقصص التي قرأتها."
                control={
                    <Toggle
                        checked={readingHistory}
                        onChange={setReadingHistory}
                    />
                }
            />
            <SettingRow
                label="إظهار التصفيقات"
                desc="اعرض التصفيقات التي أعطيتها لقصص الآخرين في ملفك الشخصي."
                control={<Toggle checked={showClaps} onChange={setShowClaps} />}
            />
            <SettingRow
                label="إظهار الردود"
                desc="اعرض تعليقاتك على القصص في ملفك الشخصي."
                control={
                    <Toggle checked={showReplies} onChange={setShowReplies} />
                }
            />
            <SettingRow
                label="السماح بالمتابعة"
                desc="اسمح للآخرين بمتابعتك وتلقي تحديثاتك."
                control={
                    <Toggle
                        checked={allowFollowers}
                        onChange={setAllowFollowers}
                    />
                }
            />

            <SectionHead title="البيانات والتتبع" />
            <SettingRow
                topBorder={false}
                label="تنزيل بياناتك"
                desc="احصل على نسخة من جميع بياناتك على المنصة."
                control={<ArrowUpRight />}
            />
        </>
    );
};

const TabNotifications = () => {
    const [push, setPush] = useState(false);
    const [newFollower, setNewFollower] = useState(true);
    const [comments, setComments] = useState(true);
    const [claps, setClaps] = useState(false);
    const [digest, setDigest] = useState(true);
    const [updates, setUpdates] = useState(false);

    const NotifRow = ({
        label,
        email: e,
        push: p,
        onEmail,
        onPush,
        topBorder = true,
    }) => (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                padding: "16px 0",
                borderTop: topBorder ? "1px solid var(--color-border)" : "none",
            }}
        >
            <span style={{ fontSize: 14, color: "var(--color-ink)", flex: 1 }}>
                {label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <Toggle checked={e} onChange={onEmail} />
                <Toggle checked={p} onChange={onPush} />
            </div>
        </div>
    );

    return (
        <>
            <SectionHead title="الإشعارات" mt={32} />

            {/* Column headers */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-left",
                    gap: 24,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--color-border)",
                    marginTop: 16,
                }}
            >
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", gap: 40 }}>
                    <span
                        style={{
                            fontSize: 12,
                            color: "var(--color-mid)",
                            fontWeight: 600,
                        }}
                    >
                        بريد إلكتروني
                    </span>
                    <span
                        style={{
                            fontSize: 12,
                            color: "var(--color-mid)",
                            fontWeight: 600,
                        }}
                    >
                        إشعار فوري
                    </span>
                </div>
            </div>

            <NotifRow
                topBorder={false}
                label="متابع جديد"
                email={newFollower}
                push={push}
                onEmail={setNewFollower}
                onPush={setPush}
            />
            <NotifRow
                label="تعليقات على قصصي"
                email={comments}
                push={push}
                onEmail={setComments}
                onPush={setPush}
            />
            <NotifRow
                label="تصفيق على قصصي"
                email={claps}
                push={push}
                onEmail={setClaps}
                onPush={setPush}
            />
            <NotifRow
                label="النشرة الأسبوعية"
                email={digest}
                push={push}
                onEmail={setDigest}
                onPush={setPush}
            />
            <NotifRow
                label="تحديثات المنصة"
                email={updates}
                push={push}
                onEmail={setUpdates}
                onPush={setPush}
            />
        </>
    );
};

const TabSecurity = () => {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const [sessions] = useState([
        {
            device: "Chrome — Windows",
            location: "الجيزة, مصر",
            last: "الآن",
            current: true,
        },
        {
            device: "Safari — iPhone",
            location: "الجيزة, مصر",
            last: "منذ ساعتين",
            current: false,
        },
        {
            device: "Firefox — MacOS",
            location: "لندن، المملكة المتحدة",
            last: "منذ ٣ أيام",
            current: false,
        },
    ]);

    const handlePasswordClick = async () => {
        setErrors({});
        setPasswordUpdated(false);
        setLoading(true);
        const result = await handlePassword({
            currentPassword: currentPass,
            newPassword: newPass,
            confirmPass,
        });
        setLoading(false);
        if (Object.keys(result).length > 0) {
            setErrors(result);
            return;
        }
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
        setPasswordUpdated(true);
    };

    return (
        <>
            <SectionHead title="كلمة المرور" mt={32} />

            <div style={{ maxWidth: 400, marginTop: 16 }}>
                {errors.apiError && <p className="api-error">{errors.apiError}</p>}

                {passwordUpdated && (
                    <p
                        style={{
                            margin: "0 0 16px",
                            padding: "8px 12px",
                            fontSize: 13,
                            color: "var(--color-accent)",
                            background: "var(--color-accent-light)",
                            borderRadius: "var(--border-radius)",
                            textAlign: "center",
                        }}
                    >
                        تم تحديث كلمة المرور بنجاح
                    </p>
                )}

                <div style={{ marginBottom: 14 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            marginBottom: 5,
                            textAlign: "right",
                        }}
                    >
                        كلمة المرور الحالية
                    </label>
                    <Input
                        type="password"
                        value={currentPass}
                        onChange={(e) => {
                            setCurrentPass(e.target.value);
                            setErrors((p) => ({ ...p, currentPass: "" }));
                        }}
                        placeholder="••••••••"
                        error={errors.currentPass}
                    />
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            marginBottom: 5,
                            textAlign: "right",
                        }}
                    >
                        كلمة المرور الجديدة
                    </label>
                    <Input
                        type="password"
                        value={newPass}
                        onChange={(e) => {
                            setNewPass(e.target.value);
                            setErrors((p) => ({ ...p, newPass: "" }));
                        }}
                        placeholder="٨ أحرف على الأقل"
                        error={errors.newPass}
                    />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            marginBottom: 5,
                            textAlign: "right",
                        }}
                    >
                        تأكيد كلمة المرور الجديدة
                    </label>
                    <Input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => {
                            setConfirmPass(e.target.value);
                            setErrors((p) => ({ ...p, confirmPass: "" }));
                        }}
                        placeholder="أعد إدخال كلمة المرور"
                        error={errors.confirmPass}
                    />
                </div>
                <Button onClick={handlePasswordClick} loading={loading}>
                    تحديث كلمة المرور
                </Button>
            </div>

            <SectionHead title="الجلسات النشطة" />
            <div style={{ marginTop: 12 }}>
                {sessions.map((s, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 0",
                            borderTop:
                                i === 0
                                    ? "none"
                                    : "1px solid var(--color-border)",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 3,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    {s.device}
                                </span>
                                {s.current && (
                                    <span
                                        style={{
                                            fontSize: 11,
                                            background:
                                                "var(--color-accent-light)",
                                            color: "var(--color-accent)",
                                            borderRadius: 99,
                                            padding: "2px 8px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        الجلسة الحالية
                                    </span>
                                )}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "var(--color-mid)",
                                }}
                            >
                                {s.location} · {s.last}
                            </div>
                        </div>
                        {!s.current && (
                            <button
                                style={{
                                    background: "none",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 4,
                                    padding: "5px 12px",
                                    fontSize: 12,
                                    color: "var(--color-error)",
                                    cursor: "pointer",
                                    transition: "border-color 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--color-error)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        "var(--color-border)")
                                }
                            >
                                إنهاء
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

const helpLinks = [
    "كيفية تسجيل الدخول أو إنشاء حساب",
    "تعديل صفحة ملفك الشخصي",
    "كتابة ونشر قصتك الأولى",
    "نظام التوزيع والانتشار في المنصة",
    "البدء ببرنامج شركاء نقش",
];

const HelpPanel = () => (
    <div className="card" style={{ padding: "24px 20px" }}>
        <h4
            style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-ink)",
                marginBottom: 16,
            }}
        >
            مقالات مساعدة مقترحة
        </h4>
        {helpLinks.map((link, i) => (
            <button
                key={i}
                style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    textAlign: "right",
                    padding: "12px 0",
                    fontSize: 13,
                    color: "var(--color-ink)",
                    cursor: "pointer",
                    lineHeight: 1.45,
                    borderBottom:
                        i < helpLinks.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                    transition: "color 0.15s",
                }}
            >
                {link}
            </button>
        ))}
    </div>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (!user) return;
        getProfile(user.username)
            .then(setProfile)
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, [user]);

    const handleProfileUpdated = (updated) => {
        setProfile((prev) => ({ ...prev, ...updated }));
    };

    const TABS = [
        { id: "account", label: "الحساب", panel: profile ? <TabAccount key={profile.username || "profile"} profile={profile} userId={user?.id} onProfileUpdated={handleProfileUpdated} /> : null },
        { id: "privacy", label: "الخصوصية", panel: <TabPrivacy /> },
        { id: "notifications", label: "الإشعارات", panel: <TabNotifications /> },
        { id: "security", label: "الأمان", panel: <TabSecurity /> },
    ];

    const activePanel = TABS.find((t) => t.id === activeTab)?.panel;

    return (
        <AppLayout leftPanel={<HelpPanel />}>
            <>
                <div>
                    <div
                        style={{
                            maxWidth: 640,
                            margin: "0 auto",
                            padding: "0 10px",
                        }}
                    >
                        <Tabs
                            active={activeTab}
                            setActive={setActiveTab}
                            tabList={TABS}
                        />

                        <div style={{ paddingBottom: 48 }}>
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
                                    <span style={{ color: "var(--color-mid)", fontSize: 14 }}>جاري التحميل...</span>
                                </div>
                            ) : activePanel}
                        </div>
                    </div>
                </div>
            </>
        </AppLayout>
    );
}
