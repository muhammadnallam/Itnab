"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

const AvatarSlider = ({
    writers = [],
    avatarSize = 65,
    title = "الإشتراكات",
}) => {
    const isMobile = useIsBreakpoint("max", 768);
    const trackRef = useRef(null);
    const rtlScrollSign = useRef(-1);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    useEffect(() => {
        const probe = document.createElement("div");
        probe.style.cssText =
            "direction:rtl;overflow-x:auto;width:10px;position:absolute;visibility:hidden;";
        probe.innerHTML = "<div style='width:200px;height:1px'></div>";
        document.body.appendChild(probe);
        probe.scrollLeft = 100;
        rtlScrollSign.current = probe.scrollLeft <= 0 ? -1 : 1;
        document.body.removeChild(probe);
    }, []);

    const syncArrows = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const { scrollLeft, scrollWidth, clientWidth } = track;
        const maxScroll = scrollWidth - clientWidth;
        const scrolledFromStart = Math.abs(scrollLeft);

        setCanPrev(scrolledFromStart > 2);
        setCanNext(scrolledFromStart < maxScroll - 2);
    }, []);

    useEffect(() => {
        syncArrows();
        window.addEventListener("resize", syncArrows);
        return () => window.removeEventListener("resize", syncArrows);
    }, [syncArrows, isMobile]);

    const navigate = (direction) => {
        const track = trackRef.current;
        if (!track) return;

        const amount = track.clientWidth * 0.8;
        track.scrollBy({
            left: direction * rtlScrollSign.current * amount,
            behavior: "smooth",
        });
    };

    const navButtonStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        flexShrink: 0,
        background: "var(--color-bg, #fff)",
        border: "none",
        borderRadius: 99,
        cursor: "pointer",
        color: "var(--color-ink)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "opacity 0.15s",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <span
                    style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                    }}
                >
                    {title}
                </span>
                {/* <button
                    aria-label="More"
                    onClick={onMenuClick}
                    style={iconButtonStyle}
                >
                    <MoreHorizontal size={18} />
                </button> */}
            </div>

            <div
                dir="rtl"
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-start",
                }}
            >
                {!isMobile && canNext && (
                    <>
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 40,
                                background:
                                    "linear-gradient(to right, var(--color-bg, #fff), transparent)",
                                zIndex: 1,
                                pointerEvents: "none",
                            }}
                        />
                        <button
                            aria-label="Next"
                            onClick={() => navigate(1)}
                            style={{
                                ...navButtonStyle,
                                position: "absolute",
                                left: -4,
                                top: avatarSize / 2 - 14,
                                zIndex: 2,
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                    </>
                )}

                <div
                    ref={trackRef}
                    onScroll={syncArrows}
                    className="hide-scroll"
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0,
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                        flex: 1,
                        minWidth: 0,
                        paddingBottom: 2,
                    }}
                >
                    {writers.map((writer) => (
                        <Link
                            key={writer.username}
                            href={`/@${writer.username}`}
                            style={{ textDecoration: "none", flexShrink: 0 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    width: avatarSize + 16,
                                }}
                            >
                                <Avatar
                                    initials={writer.avatar}
                                    size={avatarSize}
                                    bg="var(--color-accent)"
                                />
                                <span
                                    style={{
                                        width: "100%",
                                        fontSize: 12.5,
                                        color: "var(--color-mid)",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {writer.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {writers.map((writer) => (
                        <Link
                            key={writer.username}
                            href={`/@${writer.username}`}
                            style={{ textDecoration: "none", flexShrink: 0 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    width: avatarSize + 16,
                                }}
                            >
                                <Avatar
                                    initials={writer.avatar}
                                    size={avatarSize}
                                    bg="var(--color-accent)"
                                />
                                <span
                                    style={{
                                        width: "100%",
                                        fontSize: 12.5,
                                        color: "var(--color-mid)",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {writer.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {writers.map((writer) => (
                        <Link
                            key={writer.username}
                            href={`/@${writer.username}`}
                            style={{ textDecoration: "none", flexShrink: 0 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    width: avatarSize + 16,
                                }}
                            >
                                <Avatar
                                    initials={writer.avatar}
                                    size={avatarSize}
                                    bg="var(--color-accent)"
                                />
                                <span
                                    style={{
                                        width: "100%",
                                        fontSize: 12.5,
                                        color: "var(--color-mid)",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {writer.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {writers.map((writer) => (
                        <Link
                            key={writer.username}
                            href={`/@${writer.username}`}
                            style={{ textDecoration: "none", flexShrink: 0 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    width: avatarSize + 16,
                                }}
                            >
                                <Avatar
                                    initials={writer.avatar}
                                    size={avatarSize}
                                    bg="var(--color-accent)"
                                />
                                <span
                                    style={{
                                        width: "100%",
                                        fontSize: 12.5,
                                        color: "var(--color-mid)",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {writer.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {!isMobile && canPrev && (
                    <>
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: 40,
                                background:
                                    "linear-gradient(to left, var(--color-bg, #fff), transparent)",
                                zIndex: 1,
                                pointerEvents: "none",
                            }}
                        />
                        <button
                            aria-label="Previous"
                            onClick={() => navigate(-1)}
                            style={{
                                ...navButtonStyle,
                                position: "absolute",
                                right: -4,
                                top: avatarSize / 2 - 14,
                                zIndex: 2,
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AvatarSlider;