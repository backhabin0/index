import { useCallback, useState } from "react";
import type { Entry } from "../models/entry";
import { entryRepository } from "../repositories/entryRepository";
import { photoRepository } from "../repositories/photoRepository";
import { parseDateKey } from "../utils/date";
import { useEntries } from "./useEntries";

type EditorState =
  | { mode: "create"; date: Date; initialEntry?: undefined }
  | { mode: "edit"; date: Date; initialEntry: Entry };

/**
 * HomeCalendarPage/SearchPage가 공통으로 쓰는 기록 목록 + 상세보기 + 작성/수정 + 삭제 흐름.
 * 두 화면 모두 entryRepository를 직접 다루지 않고 이 훅을 통해서만 상태를 갱신한다.
 */
export function useEntryWorkspace() {
  const { entries, isLoading, loadError, refreshEntries } = useEntries();
  const [detailEntry, setDetailEntry] = useState<Entry | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const openDetail = useCallback((entry: Entry) => setDetailEntry(entry), []);
  const closeDetail = useCallback(() => setDetailEntry(null), []);

  const openCreate = useCallback((date: Date) => {
    setEditorState({ mode: "create", date });
  }, []);

  const openEdit = useCallback((entry: Entry) => {
    setDetailEntry(null);
    setEditorState({ mode: "edit", date: parseDateKey(entry.date), initialEntry: entry });
  }, []);

  const closeEditor = useCallback(() => setEditorState(null), []);

  const handleSaved = useCallback(async () => {
    closeEditor();
    await refreshEntries();
  }, [closeEditor, refreshEntries]);

  const handleDelete = useCallback(
    async (entry: Entry) => {
      await entryRepository.deleteEntry(entry.id);
      if (entry.photoLocalIds && entry.photoLocalIds.length > 0) {
        await photoRepository.deletePhotos(entry.photoLocalIds);
      }
      setDetailEntry(null);
      await refreshEntries();
    },
    [refreshEntries],
  );

  return {
    entries,
    isLoading,
    loadError,
    refreshEntries,
    detailEntry,
    openDetail,
    closeDetail,
    editorState,
    openCreate,
    openEdit,
    closeEditor,
    handleSaved,
    handleDelete,
  };
}
