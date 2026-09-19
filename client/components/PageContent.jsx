export default function PageContent({
    children,
    leftPanel,
    centerMaxWidth = 640,
    fullWidthContent,
}) {
    return (
        <>
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
                <aside className="app-left-panel hide-scroll">{leftPanel}</aside>
            )}
        </>
    );
}
