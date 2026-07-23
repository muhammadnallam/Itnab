import { BadgeCheck, Copy, Download, Link2 } from "lucide-react";

const iconButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "1px solid var(--color-border)",
    background: "none",
    color: "var(--color-ink)",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
};

const profile = {
    name: "محمد ناصر",
    bio: "كاتب مخضرم شاب, يكتب في أشياء كثيرة كلها مهمة وجديرة بالقراءة",
    avatar: "https://i.pinimg.com/736x/cd/51/81/cd5181f04427e0089d390e74322080b1.jpg",
    following: 5,
    followers: 65,
    verified: true,
    handle: "",
}

const ProfileCard = () => {
    return (
        <div
            dir="rtl"
            style={{
                width: 320,
                padding: "28px 24px",
                borderRadius: "var(--border-radius)",
                background: "var(--color-white)",
                border: "1px solid var(--color-border)",
                color: "var(--color-ink)",
                textAlign: "center",
                boxShadow: "none",
            }}
        >
            {/* Avatar */}
            <img
                src={profile.avatar}
                alt={profile.name}
                style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto 14px",
                    display: "block",
                }}
            />

            {/* Name + verified badge */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    marginBottom: 4,
                }}
            >
                <span style={{ fontSize: 18, fontWeight: 700 }}>
                    {profile.name}
                </span>
                {profile.verified && (
                    <BadgeCheck size={16} color="#fff" fill="#1DA1F2" />
                )}
            </div>

            {/* Handle */}
            <div
                style={{
                    fontSize: 14,
                    color: "var(--color-light)",
                    marginBottom: 14,
                }}
            >
                {profile.handle}
            </div>

            {/* Bio */}
            <p
                style={{
                    fontSize: 14,
                    color: "var(--color-mid)",
                    lineHeight: 1.8,
                    marginBottom: 18,
                }}
            >
                {profile.bio}
            </p>

            {/* Action icons */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginBottom: 22,
                }}
            >
                <button
                    aria-label="Copy"
                    style={iconButtonStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                >
                    <Copy size={15} />
                </button>
                <button
                    aria-label="Download"
                    style={iconButtonStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                >
                    <Download size={15} />
                </button>
                <button
                    aria-label="Share link"
                    style={iconButtonStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                >
                    <Link2 size={15} />
                </button>
            </div>

            {/* Stats */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 48,
                }}
            >
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                        {profile.following}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-light)" }}>
                        يتابع
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                        {profile.followers}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-light)" }}>
                        متابع
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
