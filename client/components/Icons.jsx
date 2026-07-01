const Ico = ({
    d,
    size = 20,
    stroke = "currentColor",
    fill = "none",
    sw = 1.8,
    ...rest
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
    >
        {typeof d === "string" ? <path d={d} /> : d}
    </svg>
);

export const IcoHome = (p) => (
    <Ico
        {...p}
        d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.75z"
    />
);

export const IcoInbox = (p) => (
    <Ico
        {...p}
        d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 012 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"
    />
);

export const IcoDash = (p) => <Ico {...p} d="M18 20V10M12 20V4M6 20v-6" />;

export const IcoProfile = (p) => (
    <Ico
        {...p}
        d={
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </>
        }
    />
);

export const IcoSearch = (p) => (
    <Ico
        {...p}
        d={
            <>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </>
        }
    />
);

export const IcoBell = (p) => (
    <Ico
        {...p}
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
    />
);

export const IcoClap = (p) => (
    <Ico
        {...p}
        d="M14.5 2.5c0-1.5-2-1.5-2 0v6c0-1.5-2-1.5-2 0v-4c0-1.5-2-1.5-2 0v8l-2-2.5c-1-1-2.5.5-1.5 1.5l4 5c1 1.5 2.5 2.5 5 2.5 3 0 5-2 5-5v-7.5c0-1.5-2-1.5-2 0"
    />
);

export const IcoComment = (p) => (
    <Ico {...p} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
);

export const IcoBookmark = (p) => (
    <Ico {...p} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
);

export const IcoMoreH = (p) => (
    <Ico
        {...p}
        fill="currentColor"
        stroke="none"
        d={
            <>
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
            </>
        }
    />
);

export const IcoMoreV = (p) => (
    <Ico
        {...p}
        fill="currentColor"
        stroke="none"
        d={
            <>
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
            </>
        }
    />
);

export const IcoPlus = (p) => (
    <Ico
        {...p}
        d={
            <>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </>
        }
    />
);

export const IcoX = (p) => (
    <Ico
        {...p}
        d={
            <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </>
        }
    />
);

export const IcoChevron = (p) => <Ico {...p} d="M6 9l6 6 6-6" />;

export const IcoReshare = (p) => (
    <Ico
        {...p}
        d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
    />
);

export const IcoShare = (p) => (
    <Ico
        {...p}
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
    />
);

export const IcoGoogle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

export const EyeIcon = ({ show }) => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-mid)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {show ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);
