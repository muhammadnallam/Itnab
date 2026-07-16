"use client";

import { useContext } from "react";
import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { WidthContext } from "@/context/ScreenContext";

export default function AppLayout({
    children,
    leftPanel,
    sidebarOpen = true,
    onToggleSidebar,
    onLogin,
}) {
    const width = useContext(WidthContext);
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1100;

    const HEADER_H = 57;

    const desktopGridColumns = () => {
        const base = isTablet
            ? sidebarOpen
                ? "240px 1fr"
                : "0px 1fr"
            : sidebarOpen
              ? "240px 1fr"
              : "0px 1fr";
        if (leftPanel && !isTablet) {
            return sidebarOpen ? "240px 1fr 350px" : "0px 1fr 350px";
        }
        return base;
    };

    const styles = {
        root: {
            direction: "rtl",
            background: "var(--color-bg)",
            minHeight: "100vh",
            color: "var(--color-ink)",
        },
        desktopGrid: {
            display: "grid",
            gridTemplateColumns: desktopGridColumns(),
            width: "100%",
            minHeight: `calc(100vh - ${HEADER_H}px)`,
            alignItems: "start",
            transition: "grid-template-columns 0.3s ease",
        },
        rightSidebarWrap: {
            borderLeft: "1px solid var(--color-border)",
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflow: "hidden",
            width: sidebarOpen ? 232 : 0,
        },
        centerWrap: {
            padding: isTablet ? "24px 32px" : "24px 48px",
            minWidth: 0,
            minHeight: `calc(100vh - ${HEADER_H}px)`,
            borderLeft: isTablet ? "none" : "1px solid var(--color-border)",
        },
        centerInner: {
            maxWidth: 640,
            margin: "0 auto",
        },
        leftPanelWrap: {
            padding: "24px",
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
        },
    };

    return (
        <div style={styles.root}>
            <Header
                onLogin={onLogin}
                onToggleSidebar={onToggleSidebar}
                isMobile={isMobile}
            />
            {isMobile ? (
                <>
                    <main style={{ padding: "16px 16px 80px" }}>
                        {children}
                    </main>
                    <MobileBottomNav />
                </>
            ) : (
                <div style={styles.desktopGrid}>
                    <div style={styles.rightSidebarWrap}>
                        <RightSidebar isOpen={sidebarOpen} />
                    </div>
                    <main style={styles.centerWrap}>
                        <div style={styles.centerInner}>{children}</div>
                    </main>
                    {leftPanel && (
                        <div
                            style={styles.leftPanelWrap}
                            className="hide-scroll"
                        >
                            {leftPanel}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
