"use client";

import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useSidebar } from "@/context/SidebarContext";

export default function AppLayout({
    children,
    leftPanel,
    centerMaxWidth = 640,
    fullWidthContent,
}) {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="app-root">
            <Header onToggleSidebar={toggleSidebar} />
            <div
                className={`app-body${leftPanel ? " app-body--has-left" : ""}`}
            >
                <aside className="app-sidebar">
                    <RightSidebar />
                </aside>
                <div className="app-center">
                    {fullWidthContent}
                    <div className="app-center-wrap">
                        <div
                            className="app-center-inner"
                            style={{
                                "--center-max-width": `${centerMaxWidth}px`,
                            }}
                        >
                            {children}
                        </div>
                    </div>
                </div>
                {leftPanel && (
                    <aside className="app-left-panel hide-scroll">
                        {leftPanel}
                    </aside>
                )}
            </div>
            <MobileBottomNav />
        </div>
    );
}
