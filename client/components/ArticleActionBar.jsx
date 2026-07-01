import { useState } from "react";
import { IcoClap, IcoComment, IcoShare, IcoBookmark, IcoMoreH } from "./Icons";


const ArticleActionBar = ({ claps, comments, reposts, saved, onSave }) => {
    const [clapCount, setClapCount] = useState(
        parseInt(claps.replace(/[^\d]/g, "")) || 0,
    );
    const [clapped, setClapped] = useState(false);

    const btnStyle = (active = false) => ({
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--color-accent)" : "var(--color-mid)",
        fontSize: 13,
        fontFamily: "inherit",
        padding: "6px 0",
        transition: "color 0.15s",
    });

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 0",
                borderTop: "1px solid var(--color-border)",
                borderBottom: "1px solid var(--color-border)",
                marginTop: 32,
                marginBottom: 32,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                    onClick={() => {
                        setClapped(true);
                        setClapCount((c) => c + 1);
                    }}
                    style={{ ...btnStyle(clapped), gap: 0 }}
                >
                    <IcoClap size={18} />
                </button>
                <span style={{ fontSize: 13, color: clapped ? "var(--color-accent)" : "var(--color-mid)" }}>
                    {clapCount.toLocaleString("ar")}
                </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button style={btnStyle()}>
                    <IcoComment size={18} />
                </button>
                <span style={{ fontSize: 13, color: "var(--color-mid)" }}>{comments}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button style={btnStyle()}>
                    <IcoShare size={18} />
                </button>
                <span style={{ fontSize: 13, color: "var(--color-mid)" }}>{reposts}</span>
            </div>

            <div style={{ flex: 1 }} />

            <button onClick={onSave} style={btnStyle(saved)}>
                <IcoBookmark size={18} />
            </button>

            <button style={btnStyle()}>
                <IcoShare size={18} />
            </button>

            <button style={btnStyle()}>
                <IcoMoreH size={18} />
            </button>
        </div>
    );
};

export default ArticleActionBar;