import { Copy, X, MessageCircle, Send, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

const FACEBOOK_PATH =
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";

const LINKEDIN_PATH =
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";

function BrandIcon({ size = 18, path }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d={path} />
        </svg>
    );
}

const FacebookIcon = (props) => <BrandIcon {...props} path={FACEBOOK_PATH} />;
const LinkedinIcon = (props) => <BrandIcon {...props} path={LINKEDIN_PATH} />;

export const SHARE_PLATFORMS = [
    { id: "copy", label: "نسخ الرابط", icon: Copy, kind: "copy" },
    {
        id: "x",
        label: "إكس (تويتر)",
        icon: X,
        kind: "open",
        url: (u) =>
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}`,
    },
    {
        id: "facebook",
        label: "فيسبوك",
        icon: FacebookIcon,
        kind: "open",
        url: (u) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    },
    {
        id: "linkedin",
        label: "لينكدإن",
        icon: LinkedinIcon,
        kind: "open",
        url: (u) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    },
    {
        id: "whatsapp",
        label: "واتساب",
        icon: MessageCircle,
        kind: "open",
        url: (u) => `https://wa.me/?text=${encodeURIComponent(u)}`,
    },
    {
        id: "telegram",
        label: "تيليجرام",
        icon: Send,
        kind: "open",
        url: (u) => `https://t.me/share/url?url=${encodeURIComponent(u)}`,
    },
    {
        id: "email",
        label: "البريد الإلكتروني",
        icon: Mail,
        kind: "open",
        url: (u) => `mailto:?body=${encodeURIComponent(u)}`,
    },
    { id: "native", label: "مشاركة", icon: Share2, kind: "native" },
];

export function openShare(platform, url) {
    const def = SHARE_PLATFORMS.find((p) => p.id === platform);
    if (!def) return;
    if (def.kind === "copy") {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(url).then(() => toast.success("تم نسخ الرابط"));
        }
    } else if (def.kind === "open" && def.url) {
        window.open(def.url(url), "_blank", "noopener,noreferrer");
    } else if (def.kind === "native") {
        if (navigator.share) {
            navigator.share({ url });
        }
    }
}