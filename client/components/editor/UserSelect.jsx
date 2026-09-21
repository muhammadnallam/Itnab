"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Search } from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { searchUsers } from "@/lib/api/user";

export default function UserSelect({
    value,
    onChange,
    placeholder = "اختر مستخدمًا",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const [debouncedQuery] = useDebounce(query, 200);

    const { data: users = [], isFetching } = useQuery({
        queryKey: queryKeys.userSearch(debouncedQuery),
        queryFn: ({ signal }) => searchUsers(debouncedQuery, { signal }),
        enabled: open && debouncedQuery.trim().length > 0,
        staleTime: 30 * 1000,
    });

    const trimmed = debouncedQuery.trim();
    const loading = isFetching && trimmed.length > 0;

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

    const select = (user) => {
        onChange(user);
        setOpen(false);
        setQuery("");
        setHighlighted(0);
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((i) => Math.min(i + 1, users.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (users[highlighted]) select(users[highlighted]);
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
                {value ? "@" + value.username : placeholder}
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
                            placeholder="ابحث عن مستخدم"
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
                        {trimmed.length === 0 ? null : loading ? (
                            <div
                                style={{
                                    padding: "10px 12px",
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                }}
                            >
                                جارٍ البحث…
                            </div>
                        ) : users.length === 0 ? (
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
                            users.map((user, i) => {
                                const selected = value?.id === user.id;
                                const active = i === highlighted;
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onMouseEnter={() => setHighlighted(i)}
                                        onClick={() => select(user)}
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
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                minWidth: 0,
                                            }}
                                        >
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt=""
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        background:
                                                            "var(--color-border)",
                                                        color: "var(--color-mid)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize: 12,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {(
                                                        user.name ||
                                                        user.username ||
                                                        "?"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                            <span
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    minWidth: 0,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "var(--color-ink)",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    @{user.username}
                                                </span>
                                                {user.name && (
                                                    <span
                                                        style={{
                                                            fontSize: 12,
                                                            color: "var(--color-mid)",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                    >
                                                        {user.name}
                                                    </span>
                                                )}
                                            </span>
                                        </span>
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
