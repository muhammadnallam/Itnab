"use client";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";

import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { normalizeArabic } from "@itnab/normalize";

import { QuranIcon } from "@/components/tiptap-icons/quran-icon";

import { Button } from "@/components/tiptap-ui-primitive/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/tiptap-ui-primitive/popover";
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card";
import { Input } from "@/components/tiptap-ui-primitive/input";

import { quran } from "@/data/quran";

import "./quran-verse-popover.scss";

const MAX_RESULTS = 50;

function searchQuran(query) {
    if (!query || query.length < 2) return [];

    const normalizedQuery = normalizeArabic(query);
    const results = [];

    for (const surah of quran) {
        for (const verse of surah.verses) {
            const normalizedVerse = normalizeArabic(verse.text);
            const normalizedSurah = normalizeArabic(surah.name);

            if (
                normalizedVerse.includes(normalizedQuery) ||
                normalizedSurah.includes(normalizedQuery)
            ) {
                results.push({
                    verseText: verse.text,
                    surahName: surah.name,
                    surahId: surah.id,
                    verseNumber: verse.id,
                });

                if (results.length >= MAX_RESULTS) return results;
            }
        }
    }

    return results;
}

const QuranVerseButton = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <Button
            type="button"
            className={className}
            variant="ghost"
            role="button"
            tabIndex={-1}
            aria-label="آية قرءآنية"
            tooltip="آية قرءآنية"
            ref={ref}
            {...props}
        >
            {children ?? (
                <>
                    <QuranIcon className="tiptap-button-icon" />
                    <span className="tiptap-button-text">آية قرءآنية</span>
                </>
            )}
        </Button>
    );
});

QuranVerseButton.displayName = "QuranVerseButton";

function QuranVerseContent({ onClose }) {
    const { editor } = useTiptapEditor();
    const isMobile = useIsBreakpoint();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const results = useMemo(() => searchQuran(query), [query]);

    const handleSelect = useCallback(
        (result) => {
            if (!editor) return;

            editor
                .chain()
                .focus()
                .insertQuranVerse({
                    verseText: result.verseText,
                    surahName: result.surahName,
                    verseNumber: result.verseNumber,
                })
                .run();

            onClose?.();
        },
        [editor, onClose],
    );

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : prev,
                );
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            }
        },
        [results, selectedIndex, handleSelect],
    );

    return (
        <Card
            ref={containerRef}
            tabIndex={0}
            style={isMobile ? { boxShadow: "none", border: 0 } : {}}
        >
            <CardBody style={isMobile ? { padding: 0 } : {}}>
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="ابحث عن آية..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    className="quran-search-input"
                />
                {query.length >= 2 && (
                    <div className="quran-search-results">
                        {results.length === 0 ? (
                            <div className="quran-search-empty">
                                لا توجد نتائج
                            </div>
                        ) : (
                            results.map((result, index) => (
                                <div
                                    key={`${result.surahId}-${result.verseNumber}`}
                                    className="quran-result-item"
                                    data-highlighted={index === selectedIndex}
                                    onClick={() => handleSelect(result)}
                                    onMouseEnter={() =>
                                        setSelectedIndex(index)
                                    }
                                >
                                    <div className="quran-result-info">
                                        <div className="quran-result-surah">
                                            {result.surahName}
                                        </div>
                                        <div className="quran-result-text">
                                            {result.verseText}
                                        </div>
                                        <div className="quran-result-ref">
                                            [ {result.surahName}:{" "}
                                            {result.verseNumber} ]
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

export const QuranVersePopover = forwardRef(
    ({ editor: providedEditor, ...props }, ref) => {
        const { editor } = useTiptapEditor(providedEditor);
        const [isOpen, setIsOpen] = useState(false);

        const handleClose = useCallback(() => {
            setIsOpen(false);
        }, []);

        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <QuranVerseButton ref={ref} {...props} />
                </PopoverTrigger>
                <PopoverContent collisionPadding={4}>
                    <QuranVerseContent onClose={handleClose} />
                </PopoverContent>
            </Popover>
        );
    },
);

QuranVersePopover.displayName = "QuranVersePopover";

export default QuranVersePopover;
