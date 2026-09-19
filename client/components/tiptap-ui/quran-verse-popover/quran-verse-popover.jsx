"use client";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";

import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { normalizeArabic } from "@itnab/normalize";

import { QuranIcon } from "@/components/tiptap-icons/quran-icon";

import { Button } from "@/components/tiptap-ui-primitive/button";
import {
    Popover,
    PopoverAnchor,
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

export const QuranVerseButton = forwardRef(
    ({ className, children, ...props }, ref) => {
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
                        <span className="tiptap-button-text">
                            آية قرءآنية
                        </span>
                    </>
                )}
            </Button>
        );
    },
);

QuranVerseButton.displayName = "QuranVerseButton";

/**
 * Shared search state and handlers for the Quran verse search input.
 */
function useQuranSearch({ onClose } = {}) {
    const { editor } = useTiptapEditor();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

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

    return {
        query,
        setQuery,
        selectedIndex,
        setSelectedIndex,
        results,
        handleSelect,
        handleKeyDown,
    };
}

function QuranVerseResults({
    results,
    selectedIndex,
    onSelect,
    onMouseEnter,
}) {
    return (
        <div className="quran-search-results">
            {results.length === 0 ? (
                <div className="quran-search-empty">لا توجد نتائج</div>
            ) : (
                results.map((result, index) => (
                    <div
                        key={`${result.surahId}-${result.verseNumber}`}
                        className="quran-result-item"
                        data-highlighted={index === selectedIndex}
                        onClick={() => onSelect(result)}
                        onMouseEnter={() => onMouseEnter(index)}
                    >
                        <div className="quran-result-info">
                            <div className="quran-result-surah">
                                {result.surahName}
                            </div>
                            <div className="quran-result-text">
                                {result.verseText}
                            </div>
                            <div className="quran-result-ref">
                                [ {result.surahName}: {result.verseNumber} ]
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

/**
 * Content for the desktop popover: input and results live together in a Card.
 */
export function QuranVerseContent({ onClose }) {
    const isMobile = useIsBreakpoint();
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const {
        query,
        setQuery,
        selectedIndex,
        setSelectedIndex,
        results,
        handleSelect,
        handleKeyDown,
    } = useQuranSearch({ onClose });

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
                    <QuranVerseResults
                        results={results}
                        selectedIndex={selectedIndex}
                        onSelect={handleSelect}
                        onMouseEnter={setSelectedIndex}
                    />
                )}
            </CardBody>
        </Card>
    );
}

/**
 * Content for the mobile toolbar: a bare input that replaces the toolbar, with
 * the results anchored to it in a portal so they keep floating as a dropdown.
 */
export function QuranVerseToolbarContent({ onClose }) {
    const {
        query,
        setQuery,
        selectedIndex,
        setSelectedIndex,
        results,
        handleSelect,
        handleKeyDown,
    } = useQuranSearch({ onClose });

    return (
        <Popover open={query.length >= 2} onOpenChange={() => {}}>
            <PopoverAnchor asChild>
                <div className="quran-toolbar-anchor">
                    <Input
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
                </div>
            </PopoverAnchor>
            <PopoverContent
                side="bottom"
                align="start"
                sideOffset={6}
                collisionPadding={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <Card>
                    <CardBody>
                        {query.length >= 2 && (
                            <QuranVerseResults
                                results={results}
                                selectedIndex={selectedIndex}
                                onSelect={handleSelect}
                                onMouseEnter={setSelectedIndex}
                            />
                        )}
                    </CardBody>
                </Card>
            </PopoverContent>
        </Popover>
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
