"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const GAP = 8;

const MoreMenu = ({ options = [], widthClass = "w-[260px]", children }) => {
    const [open, setOpen] = useState(false);
    const [positioned, setPositioned] = useState(false);
    const [placement, setPlacement] = useState({});
    const wrapperRef = useRef(null);
    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (!open) return;
        const anchor = wrapperRef.current;
        const menu = menuRef.current;
        if (!anchor || !menu) return;

        const anchorRect = anchor.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        const spaceBelow = window.innerHeight - anchorRect.bottom - GAP;

        const side = menuHeight <= spaceBelow ? "bottom" : "top";

        setPlacement(
            side === "bottom"
                ? { top: anchorRect.height + GAP }
                : { bottom: anchorRect.height + GAP },
        );
        setPositioned(true);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleScrollOrResize = () => setOpen(false);
        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [open]);

    const handleSelect = (item) => {
        setOpen(false);
        if (item.href) {
            window.location.assign(item.href);
            return;
        }
        item.onClick?.();
    };

    const toggle = () => {
        setPositioned(false);
        setOpen((v) => !v);
    };

    return (
        <div
            ref={wrapperRef}
            style={{ position: "relative", display: "inline-block" }}
        >
            <button
                type="button"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex cursor-pointer border-none bg-transparent p-0 text-mid hover:text-ink"
            >
                {children}
            </button>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    className={`card absolute left-0 z-80 ${widthClass} overflow-hidden p-2! shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                        positioned ? "visible" : "invisible"
                    }`}
                    style={{ top: placement.top, bottom: placement.bottom }}
                >
                    {options.map((item, i) => {
                        if (item.separator) {
                            return (
                                <div
                                    key={`sep-${i}`}
                                    className="my-2 h-px bg-border"
                                />
                            );
                        }
                        const Icon = item.icon;
                        const isRed = item.type === "red";
                        return (
                            <button
                                key={item.label ?? i}
                                type="button"
                                role="menuitem"
                                onClick={() => handleSelect(item)}
                                className={`flex w-full items-center gap-2 border-0 bg-transparent px-3 py-2 text-[13px] text-right rounded-none cursor-pointer transition-colors ${
                                    isRed
                                        ? "text-error"
                                        : "text-mid hover:text-ink"
                                }`}
                            >
                                <Icon size={18} stroke="currentColor" />
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MoreMenu;
