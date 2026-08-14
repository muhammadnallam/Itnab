"use client";

import { cloneElement, isValidElement, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalContext";

export default function RequireAuth({ children, onClick, mode = "login" }) {
    const { user, loading } = useContext(UserContext);
    const { openAuth } = useAuthModal();

    if (children == null) {
        return null;
    }

    if (!isValidElement(children)) {
        throw new Error("RequireAuth expects a single element child");
    }

    const guarded = (e) => {
        if (loading) {
            e.preventDefault();
            return;
        }
        if (!user) {
            e.preventDefault();
            e.stopPropagation();
            openAuth(mode);
            return;
        }
        if (typeof onClick === "function") onClick(e);
    };

    const childOnClick = children.props.onClick;
    const mergedOnClick = childOnClick
        ? (e) => {
              childOnClick(e);
              guarded(e);
          }
        : guarded;

    return cloneElement(children, { onClick: mergedOnClick });
}
