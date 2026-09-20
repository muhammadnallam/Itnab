"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export default function TopicSelect({
    value,
    onChange,
    options,
    placeholder = "اختر موضوعًا",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const filtered = useMemo(() => {
        const q = query.trim();
        if (!q) return options;
        return options.filter((option) => option.includes(q));
    }, [options, query]);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const select = (option) => {
        onChange(option);
        setOpen(false);
        setQuery("");
        setHighlighted(0);
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[highlighted]) select(filtered[highlighted]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                    width: "100%",
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: 14,
                    color: value ? "var(--color-ink)" : "var(--color-mid)",
                    boxSizing: "border-box",
                }}
            >
                {value || placeholder}
                <ChevronDown size={16} />
            </button>
            {open && (
                <div
                    style={{
                        marginTop: 8,
                        background: "var(--color-white)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                        padding: 6,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 10px",
                            borderBottom: "1px solid var(--color-border)",
                        }}
                    >
                        <Search
                            size={15}
                            style={{
                                color: "var(--color-mid)",
                                flexShrink: 0,
                            }}
                        />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setHighlighted(0);
                            }}
                            onKeyDown={onKeyDown}
                            placeholder="ابحث عن موضوع"
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                background: "none",
                                fontSize: 14,
                                color: "var(--color-ink)",
                                minWidth: 0,
                            }}
                        />
                    </div>
                    <div
                        role="listbox"
                        style={{
                            maxHeight: 220,
                            overflowY: "auto",
                            marginTop: 4,
                        }}
                    >
                        {filtered.length === 0 ? (
                            <div
                                style={{
                                    padding: "10px 12px",
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                }}
                            >
                                لا توجد نتائج
                            </div>
                        ) : (
                            filtered.map((option, i) => {
                                const selected = option === value;
                                const active = i === highlighted;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onMouseEnter={() => setHighlighted(i)}
                                        onClick={() => select(option)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 8,
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "right",
                                            fontSize: 14,
                                            background: active
                                                ? "var(--color-bg)"
                                                : "transparent",
                                            color: "var(--color-ink)",
                                        }}
                                    >
                                        {option}
                                        {selected && (
                                            <Check
                                                size={15}
                                                style={{
                                                    color: "var(--color-accent)",
                                                    flexShrink: 0,
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
