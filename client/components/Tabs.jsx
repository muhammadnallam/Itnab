const Tabs = ({ active, setActive, tabList }) => (
    <>
        <style>{`
      .tabs-scroll::-webkit-scrollbar { display: none; }
    `}</style>

        <div
            className="tabs-scroll"
            style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                borderBottom: "1px solid var(--color-border)",
                marginBottom: 4,
                overflowX: "auto",
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE/Edge */,
                WebkitOverflowScrolling: "touch",
            }}
        >
            {tabList.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "12px 20px",
                        fontSize: 15,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        color:
                            active === tab.id
                                ? "var(--color-ink)"
                                : "var(--color-mid)",
                        fontWeight: 400,
                        borderBottom:
                            active === tab.id
                                ? "2px solid var(--color-ink)"
                                : "2px solid transparent",
                        marginBottom: -1,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => { if (active !== tab.id) e.currentTarget.style.color = "var(--color-ink)"; }}
                    onMouseLeave={(e) => { if (active !== tab.id) e.currentTarget.style.color = "var(--color-mid)"; }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    </>
);

export default Tabs;
