"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { getUserLists } from "@/lib/api/feed";

export default function ListSelect({
    authorId,
    value,
    onChange,
    placeholder = "اختر قائمة",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const [debouncedQuery] = useDebounce(query, 200);

    const { data, isFetching } = useQuery({
        queryKey: queryKeys.listSearch(authorId, debouncedQuery),
        queryFn: () =>
            getUserLists(authorId, {
                q: debouncedQuery.trim() || undefined,
                limit: 20,
            }),
        enabled: open && !!authorId,
        staleTime: 30 * 1000,
    });

    const results = data?.items ?? [];
    const trimmed = debouncedQuery.trim();
    const exactMatch = results.some(
        (l) => l.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuery("");
        setHighlighted(0);
    }, [authorId]);

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

    const select = (list) => {
        onChange({ id: list.id, name: list.name });
        setOpen(false);
        setQuery("");
        setHighlighted(0);
    };

    const create = () => {
        onChange({ name: trimmed });
        setOpen(false);
        setQuery("");
        setHighlighted(0);
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (results[highlighted]) select(results[highlighted]);
            else if (trimmed.length > 0 && !exactMatch) create();
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
                {value ? value.name : placeholder}
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
                            placeholder="ابحث عن قائمة"
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
                        {isFetching && trimmed.length > 0 ? (
                            <div
                                style={{
                                    padding: "10px 12px",
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                }}
                            >
                                جارٍ البحث…
                            </div>
                        ) : trimmed.length === 0 && results.length === 0 ? (
                            <div
                                style={{
                                    padding: "10px 12px",
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                }}
                            >
                                لا توجد قوائم
                            </div>
                        ) : (
                            results.map((list, i) => {
                                const selected = value?.id === list.id;
                                const active = i === highlighted;
                                return (
                                    <button
                                        key={list.id}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onMouseEnter={() => setHighlighted(i)}
                                        onClick={() => select(list)}
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
                                                minWidth: 0,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {list.name}
                                        </span>
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                flexShrink: 0,
                                                fontSize: 12,
                                                color: "var(--color-mid)",
                                            }}
                                        >
                                            {list._count?.savedArticles ?? 0}{" "}
                                            مقال
                                            {selected && (
                                                <Check
                                                    size={15}
                                                    style={{
                                                        color: "var(--color-accent)",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                    {trimmed.length > 0 && !exactMatch && (
                        <button
                            type="button"
                            onClick={create}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: "100%",
                                padding: "10px 10px",
                                marginTop: 4,
                                border: "none",
                                borderTop: "1px solid var(--color-border)",
                                background: "transparent",
                                cursor: "pointer",
                                textAlign: "right",
                                fontSize: 14,
                                color: "var(--color-accent)",
                            }}
                        >
                            <Plus size={15} />
                            إنشاء قائمة «{trimmed}»
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
