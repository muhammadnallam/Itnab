"use client";
import AppLayout from "@/components/AppLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Avatar from "@/components/ui/Avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ImagePicker";
import { ArrowUpRight, Globe, Pencil } from "lucide-react";
import { useState, useContext, useRef } from "react";
import { validatePasswordFields, validateProfileFields } from "@/lib/handlers";
import Tabs from "@/components/ui/Tabs";

import { UserContext } from "@/context/UserContext";
import { signOut } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { useUser } from "@/hooks/useUser";
import { Trash } from "lucide-react";
import { X, YouTube } from "@/components/ui/icons";

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

const TabAccount = ({
    profile,
    updateProfile,
    isUpdatingProfile,
    updateSocialLinks,
    isUpdatingSocialLinks,
    deleteAccount,
    isDeleting,
}) => {
    const [name, setName] = useState(profile.name || "");
    const [username, setUsername] = useState(profile.username || "");
    const [bio, setBio] = useState(profile.bio || "");
    const [avatar, setAvatar] = useState(profile.image || null);
    const [banner, setBanner] = useState(profile.bannerUrl || null);
    const [website, setWebsite] = useState(profile.socialLinks?.website || "");
    const [youtube, setYoutube] = useState(profile.socialLinks?.youtube || "");
    const [xAccount, setXAccount] = useState(profile.socialLinks?.x || "");
    const [profileError, setProfileError] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const { setUser } = useContext(UserContext);
    const avatarInputRef = useRef(null);
    const router = useRouter();

    const avatarDisplay =
        avatar && typeof avatar !== "string"
            ? URL.createObjectURL(avatar)
            : avatar;

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            setProfileError((p) => ({
                ...p,
                avatar: "الحد الأقصى 3 ميغابايت",
            }));
            return;
        }
        setProfileError((p) => ({ ...p, avatar: "" }));
        setAvatar(file);
    };

    const handleProfileSubmit = async () => {
        setProfileError({});
        const errors = validateProfileFields({
            name,
            username,
            bio,
            avatar,
            banner,
        });
        setProfileError(errors);
        if (Object.keys(errors).length > 0) return;
        try {
            const updated = await updateProfile({
                name,
                username,
                bio,
                avatar,
                banner,
            });
            setUser((prev) =>
                prev ? { ...prev, image: updated.image } : prev,
            );
            toast.success("تم تحديث الملف الشخصي", {
                action: {
                    label: "عرض الملف الشخصي",
                    onClick: () => router.push(`/profile/${profile.username}`),
                },
            });
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء تحديث الملف الشخصي");
        }
    };

    const handleLinksSubmit = async () => {
        try {
            await updateSocialLinks({
                socialLinks: { website, youtube, x: xAccount },
            });
            toast.success("تم تحديث الروابط");
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء تحديث الروابط");
        }
    };

    const handleAccountDelete = async () => {
        setDeleteError(null);
        try {
            await deleteAccount();
        } catch (err) {
            setDeleteError(err.message || "حدث خطأ أثناء حذف الحساب");
            return;
        }
        await signOut();
        setUser(null);
        redirect("/");
    };

    return (
        <div>
            <SectionHead title="الملف الشخصي" mt={32} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginTop: 16,
                }}
            >
                <div>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            marginBottom: 5,
                        }}
                    >
                        صورة الملف الشخصي
                    </label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: 88,
                                height: 88,
                                cursor: "pointer",
                            }}
                            onClick={() => avatarInputRef.current?.click()}
                        >
                            <Avatar
                                img={avatarDisplay}
                                initials={name?.trim()?.slice(0, 2) || ""}
                                size={88}
                                bg="var(--color-accent)"
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    bottom: 0,
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: "var(--color-ink)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid var(--color-white)",
                                }}
                            >
                                <Pencil size={14} color="var(--color-white)" />
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={avatarInputRef}
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>
                <div>
                    <label
                        style={{
                            display: "block",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            marginBottom: 5,
                        }}
                    >
                        صورة الغلاف
                    </label>
                    <div
                        style={{
                            borderRadius: "var(--border-radius)",
                            overflow: "hidden",
                        }}
                    >
                        <ImagePicker
                            image={banner}
                            setImage={setBanner}
                            aspectRatio="1000/200"
                            error={profileError.banner}
                            setError={(msg) =>
                                setProfileError((p) => ({ ...p, banner: msg }))
                            }
                            label="إضافة صورة غلاف"
                            changeLabel="تغيير صورة الغلاف"
                        />
                    </div>
                </div>
                <Input
                    label="الاسم"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setProfileError((p) => ({ ...p, name: "" }));
                    }}
                    error={profileError.name}
                />
                <Input
                    label="اسم المستخدم"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setProfileError((p) => ({ ...p, username: "" }));
                    }}
                    error={profileError.username}
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
            <Button
                style={{ marginTop: 16 }}
                onClick={handleProfileSubmit}
                loading={isUpdatingProfile}
            >
                تحديث حسابك
            </Button>
            <SectionHead title="الروابط" />
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
                    }}
                    rightIcon={<Globe color="var(--color-mid)" size={19} />}
                />
                <Input
                    placeholder="youtube.com/@yourchannel"
                    value={youtube}
                    onChange={(e) => {
                        setYoutube(e.target.value);
                    }}
                    rightIcon={<YouTube />}
                />
                <Input
                    placeholder="x.com/youraccount"
                    value={xAccount}
                    onChange={(e) => {
                        setXAccount(e.target.value);
                    }}
                    rightIcon={<X />}
                />
            </div>
            <Button
                style={{ marginTop: 16 + 5 }}
                onClick={handleLinksSubmit}
                loading={isUpdatingSocialLinks}
            >
                تحديث الروابط
            </Button>
            <SectionHead title="منطقة خطر" />
            <SettingRow
                topBorder={false}
                label="حذف الحساب"
                desc="سيؤدي هذا إلى حذف حسابك وجميع محتواك بصورة دائمة."
                danger
                control={
                    <Button
                        variant="error"
                        onClick={() => setConfirmDelete(true)}
                    >
                        حذف الحساب
                    </Button>
                }
            />
            <ConfirmModal
                isOpen={confirmDelete}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => handleAccountDelete()}
                icon={Trash}
                color={"var(--color-error)"}
                icoBackground={"var(--color-error-light)"}
                title={"حذف الحساب نهائيًا"}
                description={
                    "سيتم حذف حسابك وجميع محتواك بصورة دائمة. هذا الإجراء نهائي ولا يمكن التراجع عنه"
                }
                buttonText={"حذف الحساب"}
                loading={isDeleting}
                error={deleteError}
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

const TabSecurity = ({ updatePassword, isUpdatingPassword }) => {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [errors, setErrors] = useState({});
    const { setUser } = useContext(UserContext);

    const handlePasswordClick = async () => {
        setErrors({});
        const errs = validatePasswordFields({
            currentPassword: currentPass,
            newPassword: newPass,
            confirmPass,
        });
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        try {
            await updatePassword({
                currentPassword: currentPass,
                newPassword: newPass,
            });
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء تحديث كلمة المرور");
            return;
        }

        toast.success("تم تحديث كلمة المرور");
        await signOut();
        setUser(null);
        return redirect("/");
    };

    return (
        <>
            <SectionHead title="كلمة المرور" mt={32} />

            <div style={{ maxWidth: 400, marginTop: 16 }}>
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
                <Button
                    onClick={handlePasswordClick}
                    loading={isUpdatingPassword}
                >
                    تحديث كلمة المرور
                </Button>
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
    const { user } = useContext(UserContext);
    const router = useRouter();
    const {
        profile,
        isLoading,
        updateProfile,
        isUpdatingProfile,
        updateSocialLinks,
        isUpdatingSocialLinks,
        updatePassword,
        isUpdatingPassword,
        deleteAccount,
        isDeleting,
    } = useUser(user?.username);

    const TABS = [
        {
            id: "account",
            label: "الحساب",
            panel: profile ? (
                <TabAccount
                    key={profile.username || "profile"}
                    profile={profile}
                    updateProfile={updateProfile}
                    isUpdatingProfile={isUpdatingProfile}
                    updateSocialLinks={updateSocialLinks}
                    isUpdatingSocialLinks={isUpdatingSocialLinks}
                    deleteAccount={deleteAccount}
                    isDeleting={isDeleting}
                />
            ) : null,
        },
        {
            id: "security",
            label: "الأمان",
            panel: (
                <TabSecurity
                    updatePassword={updatePassword}
                    isUpdatingPassword={isUpdatingPassword}
                />
            ),
        },
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
                            loading={isLoading}
                            loadingMessage="جاري التحميل..."
                        />

                        <div style={{ paddingBottom: 48 }}>
                            {!isLoading && activePanel}
                        </div>
                    </div>
                </div>
            </>
        </AppLayout>
    );
}
