"use client";

import { useState, useContext } from "react";
import { Plus, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";
import { UserContext } from "@/context/UserContext";
import { useLists, useCreateList, useSaveToList, useUnsaveFromList } from "@/hooks/useLists";

const ListPicker = ({ open, onClose, articleId }) => {
    const { user } = useContext(UserContext);
    const { items, loading, hasMore, loadMore, loadingMore } = useLists({
        author: user?.id,
        articleId,
        enabled: open,
    });
    const saveToList = useSaveToList(articleId);
    const unsaveFromList = useUnsaveFromList(articleId);
    const createList = useCreateList();
    const [newName, setNewName] = useState("");

    const handleToggle = async (listId, containsArticle) => {
        try {
            if (containsArticle) {
                await unsaveFromList.mutateAsync(listId);
                toast.success("تم إزالة المقال من القائمة", {
                    duration: 5000,
                    action: {
                        label: "تراجع",
                        onClick: async () => {
                            try {
                                await saveToList.mutateAsync(listId);
                                toast.success("تم حفظ المقال في القائمة");
                            } catch (err) {
                                toast.error(
                                    err?.message || "حدث خطأ أثناء تنفيذ العملية",
                                );
                            }
                        },
                    },
                });
            } else {
                await saveToList.mutateAsync(listId);
                toast.success("تم حفظ المقال في القائمة");
            }
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        }
    };

    const handleCreate = async () => {
        const name = newName.trim();
        if (!name) return;
        try {
            const list = await createList.mutateAsync(name);
            await saveToList.mutateAsync(list.id);
            setNewName("");
            toast.success("تم إنشاء القائمة وحفظ المقال");
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        }
    };

    const isPending = saveToList.isPending || unsaveFromList.isPending;

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="font-semibold text-lg mb-1">حفظ إلى قائمة</h2>
            <p className="text-sm text-(--color-light) mb-4">
                اختر قائمة لحفظ هذا المقال.
            </p>

            <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto hide-scroll">
                {loading && (
                    <div className="flex items-center justify-center py-6 text-mid">
                        <Loader2 size={20} className="animate-spin" />
                    </div>
                )}

                {!loading && items.length === 0 && (
                    <p className="text-sm text-(--color-light) py-4 text-center">
                        لا توجد قوائم بعد. أنشئ قائمة جديدة بالأسفل.
                    </p>
                )}

                {items.map((list) => (
                    <label
                        key={list.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg cursor-pointer transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={list.containsArticle}
                            onChange={() => handleToggle(list.id, list.containsArticle)}
                            disabled={isPending}
                            className="accent-(--color-accent) shrink-0"
                        />
                        <span className="min-w-0">
                            <span className="block font-medium truncate">
                                {list.name}
                            </span>
                            <span className="block text-xs text-(--color-light)">
                                {list.storyCount} مقال
                            </span>
                        </span>
                    </label>
                ))}

                {hasMore && (
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="text-sm text-mid hover:text-ink py-2"
                    >
                        {loadingMore ? "جاري التحميل..." : "عرض المزيد"}
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="إنشاء قائمة جديدة"
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-border bg-(--color-white) outline-none focus:border-accent"
                />
                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={!newName.trim() || createList.isPending}
                    className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-accent text-white disabled:opacity-50"
                >
                    {createList.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Plus size={16} />
                    )}
                    إنشاء
                </button>
            </div>
        </Modal>
    );
};

export default ListPicker;
