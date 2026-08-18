"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

const Slider = ({
    children,
    gap = 8,
    scrollAmountFactor = 0.8,
    isMobile: isMobileOverride,
    style,
    trackStyle,
    ariaLabelNext = "Next",
    ariaLabelPrev = "Previous",
}) => {
    const autoMobile = useIsBreakpoint("max", 768);
    const isMobile = isMobileOverride ?? autoMobile;
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
        const track = trackRef.current;
        if (!track) return;

        window.addEventListener("resize", syncArrows);
        const observer = new ResizeObserver(syncArrows);
        observer.observe(track);
        return () => {
            window.removeEventListener("resize", syncArrows);
            observer.disconnect();
        };
    }, [syncArrows, children]);

    const navigate = (direction) => {
        const track = trackRef.current;
        if (!track) return;

        const amount = track.clientWidth * scrollAmountFactor;
        track.scrollBy({
            left: direction * rtlScrollSign.current * amount,
            behavior: "smooth",
        });
    };

    const navButtonStyle = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        flexShrink: 0,
        background: "var(--color-bg, #fff)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--border-radius)",
        cursor: "pointer",
        color: "var(--color-ink)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "opacity 0.15s",
        zIndex: 2,
    };

    return (
        <div
            dir="rtl"
            style={{ position: "relative", width: "100%", ...style }}
        >
            {!isMobile && canNext && (
                <button
                    type="button"
                    aria-label={ariaLabelNext}
                    onClick={() => navigate(1)}
                    style={{ ...navButtonStyle, left: -4 }}
                >
                    <ChevronLeft size={16} />
                </button>
            )}

            <style>{`
                .itn-slider-track::-webkit-scrollbar { display: none; }
            `}</style>

            <div
                ref={trackRef}
                onScroll={syncArrows}
                className="itn-slider-track"
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap,
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-x",
                    ...trackStyle,
                }}
            >
                {children}
            </div>

            {!isMobile && canPrev && (
                <button
                    type="button"
                    aria-label={ariaLabelPrev}
                    onClick={() => navigate(-1)}
                    style={{ ...navButtonStyle, right: -4 }}
                >
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
};

export default Slider;