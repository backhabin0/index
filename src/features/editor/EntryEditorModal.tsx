import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABELS } from "../../models/category";
import type { Entry, EntryCategory } from "../../models/entry";
import { entryRepository } from "../../repositories/entryRepository";
import { photoRepository } from "../../repositories/photoRepository";
import { toDateKey } from "../../utils/date";
import CategorySelector from "./CategorySelector";
import { CATEGORY_FIELD_COMPONENTS } from "./fields";
import { inputClass, labelClass } from "./fieldStyles";
import PhotoPicker from "./PhotoPicker";

const CATEGORY_DRAFT_KEYS = [
  "moodScore",
  "rating",
  "price",
  "locationName",
  "tags",
  "subtitle",
  "directorOrCast",
  "oneLineReview",
  "quote",
  "authorOrPublisher",
  "readingStatus",
  "companions",
  "purchasePlace",
  "satisfaction",
  "purchaseCategory",
  "mealType",
  "foodType",
  "restaurantName",
] as const satisfies readonly (keyof Entry)[];

/** 수정 모드 진입 시, 기존 Entry에서 카테고리별 세부 필드만 뽑아 draft로 되돌린다. */
function extractCategoryDraft(entry: Entry): Partial<Entry> {
  const draft: Partial<Entry> = {};
  for (const key of CATEGORY_DRAFT_KEYS) {
    const value = entry[key];
    if (value !== undefined) {
      (draft as Record<string, unknown>)[key] = value;
    }
  }
  return draft;
}

interface EntryEditorModalProps {
  mode?: "create" | "edit";
  defaultDate: Date;
  initialEntry?: Entry;
  onClose: () => void;
  onSaved: (entry: Entry) => void;
}

export default function EntryEditorModal({
  mode = "create",
  defaultDate,
  initialEntry,
  onClose,
  onSaved,
}: EntryEditorModalProps) {
  const [date, setDate] = useState(() => initialEntry?.date ?? toDateKey(defaultDate));
  const [category, setCategory] = useState<EntryCategory>(initialEntry?.category ?? "mood");
  const [title, setTitle] = useState(initialEntry?.title ?? "");
  const [body, setBody] = useState(initialEntry?.body ?? "");
  const [categoryDraft, setCategoryDraft] = useState<Partial<Entry>>(() =>
    initialEntry ? extractCategoryDraft(initialEntry) : {},
  );
  const [photoIds, setPhotoIds] = useState<string[]>(initialEntry?.photoLocalIds ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 저장 완료 여부를 추적해, 저장하지 않고 닫힌 경우에는 이번 세션에서 새로 추가한 사진만
  // 저장소에서 정리한다. 수정 모드에서 원래 있던 사진은 건드리지 않는다.
  const savedRef = useRef(false);
  const newlyAddedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (!savedRef.current && newlyAddedIdsRef.current.size > 0) {
        photoRepository.deletePhotos([...newlyAddedIdsRef.current]).catch(() => {});
      }
    };
  }, []);

  const handleCategoryChange = (next: EntryCategory) => {
    setCategory(next);
    setCategoryDraft({});
  };

  const handleAddPhotoIds = (ids: string[]) => {
    ids.forEach((id) => newlyAddedIdsRef.current.add(id));
    setPhotoIds((prev) => [...prev, ...ids]);
  };

  const handleRemovePhotoId = (id: string) => {
    newlyAddedIdsRef.current.delete(id);
    setPhotoIds((prev) => prev.filter((photoId) => photoId !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    const now = new Date().toISOString();
    const isEdit = mode === "edit" && initialEntry;
    const entry: Entry = {
      id: isEdit ? initialEntry.id : crypto.randomUUID(),
      date,
      category,
      title: title.trim() || CATEGORY_LABELS[category],
      body,
      ...categoryDraft,
      photoLocalIds: photoIds,
      createdAt: isEdit ? initialEntry.createdAt : now,
      updatedAt: now,
    };

    try {
      const saved = isEdit
        ? await entryRepository.updateEntry(entry)
        : await entryRepository.createEntry(entry);
      savedRef.current = true;
      onSaved(saved);
    } catch {
      setIsSaving(false);
      setSaveError(
        isEdit
          ? "수정에 실패했어요. 잠시 후 다시 시도해주세요."
          : "저장에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    }
  };

  const CategoryFields = CATEGORY_FIELD_COMPONENTS[category];
  const modalTitle = mode === "edit" ? "기록 수정하기" : "기록 남기기";
  const saveLabel = isSaving
    ? mode === "edit"
      ? "수정 중..."
      : "저장 중..."
    : mode === "edit"
      ? "수정 완료"
      : "저장";

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
          <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">{modalTitle}</h2>
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
            <div className="flex flex-col gap-1">
              <label className={labelClass}>날짜</label>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>카테고리</label>
              <CategorySelector selected={category} onSelect={handleCategoryChange} />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>제목</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>본문</label>
              <textarea
                className={`${inputClass} min-h-24`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="오늘의 이야기를 자유롭게 적어보세요"
              />
            </div>

            <CategoryFields
              draft={categoryDraft}
              onChange={(patch) => setCategoryDraft((prev) => ({ ...prev, ...patch }))}
            />

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>사진 첨부</label>
              <PhotoPicker
                photoIds={photoIds}
                onAddIds={handleAddPhotoIds}
                onRemoveId={handleRemovePhotoId}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 pt-2 pb-5">
          {saveError && <p className="text-xs text-[var(--color-accent-strong)]">{saveError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-ink-muted)]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-2xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
