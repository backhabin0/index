import { useState } from "react";
import { usePhotoUrls } from "../../hooks/usePhotoUrls";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "../../models/category";
import type { Entry } from "../../models/entry";
import { formatDate } from "../../utils/date";
import EntryDetailFields, { getTitleLabel } from "./EntryDetailFields";

interface EntryDetailModalProps {
  entry: Entry;
  onClose: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => Promise<void>;
}

export default function EntryDetailModal({ entry, onClose, onEdit, onDelete }: EntryDetailModalProps) {
  const photoUrls = usePhotoUrls(entry.photoLocalIds);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "이 기록을 삭제할까요? 첨부한 사진도 함께 삭제되며 되돌릴 수 없어요.",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(entry);
    } catch {
      setDeleteError("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="pb-safe flex max-h-[92dvh] w-full flex-col rounded-t-[32px] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-1.5">
            <span aria-hidden>{CATEGORY_ICONS[entry.category]}</span>
            <span className="text-sm font-medium text-[var(--color-ink-muted)]">
              {CATEGORY_LABELS[entry.category]}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] hover:bg-[var(--color-app-bg)]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[var(--color-ink-muted)]">{formatDate(entry.date)}</p>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--color-ink-muted)]">
                {getTitleLabel(entry.category)}
              </span>
              <h2 className="text-[19px] font-semibold text-[var(--color-ink)]">{entry.title}</h2>
            </div>

            {photoUrls.length > 0 && (
              <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
                {photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt=""
                    className="h-48 w-auto shrink-0 snap-center rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}

            {entry.body && (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink)]">
                {entry.body}
              </p>
            )}

            <EntryDetailFields entry={entry} />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 pt-2 pb-5">
          {deleteError && (
            <p className="text-xs text-[var(--color-accent-strong)]">{deleteError}</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onEdit(entry)}
              className="flex-1 rounded-2xl border border-[var(--color-border)] py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex-1 rounded-2xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
