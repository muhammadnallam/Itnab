"use client";

import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useSidebar } from "@/context/SidebarContext";

export default function AppLayout({ children }) {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="app-root">
            <Header onToggleSidebar={toggleSidebar} />
            <div className="app-body">
                <aside className="app-sidebar">
                    <RightSidebar />
                </aside>
                <div className="app-main">{children}</div>
            </div>
            <MobileBottomNav />
        </div>
    );
}
