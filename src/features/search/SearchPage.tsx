import { useMemo, useState } from "react";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import EntryCard from "../../components/common/EntryCard";
import EntryDetailModal from "../editor/EntryDetailModal";
import EntryEditorModal from "../editor/EntryEditorModal";
import { useEntryWorkspace } from "../../hooks/useEntryWorkspace";
import type { EntryCategory } from "../../models/entry";
import { filterEntries, sortEntries, type SortOption } from "../../utils/searchUtils";
import CategoryFilterChips from "./CategoryFilterChips";
import SortChips from "./SortChips";

export default function SearchPage() {
  const {
    entries,
    isLoading,
    loadError,
    detailEntry,
    openDetail,
    closeDetail,
    editorState,
    openEdit,
    closeEditor,
    handleSaved,
    handleDelete,
  } = useEntryWorkspace();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<EntryCategory | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("latest");

  const results = useMemo(() => {
    const filtered = filterEntries(entries, { query, category });
    return sortEntries(filtered, sortOption);
  }, [entries, query, category, sortOption]);

  return (
    <div className="flex h-full flex-col">
      <header className="pt-safe flex flex-col gap-3 px-5 pt-4">
        <p className="text-lg font-semibold tracking-tight text-[var(--color-accent-strong)]">
          검색
        </p>
        <div className="relative">
          <span
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
            aria-hidden
          >
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 본문, 태그, 장소 등으로 검색"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pr-4 pl-11 text-sm text-[var(--color-ink)] shadow-[var(--shadow-soft)] placeholder:text-[var(--color-ink-muted)] focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          />
        </div>
        <CategoryFilterChips selected={category} onSelect={setCategory} />
        <SortChips selected={sortOption} onSelect={setSortOption} />
      </header>

      <div className="mx-5 mt-3">
        <p className="text-xs text-[var(--color-ink-muted)]">총 {results.length}개의 기록</p>
      </div>

      <div className="mx-5 mt-2 flex flex-1 flex-col gap-3 pb-6">
        {isLoading ? (
          <Card>
            <EmptyState title="기록을 불러오는 중이에요." />
          </Card>
        ) : loadError ? (
          <Card>
            <EmptyState title={loadError} description="새로고침 후 다시 시도해주세요." />
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <EmptyState
              title={entries.length === 0 ? "아직 작성한 기록이 없어요." : "검색 결과가 없어요."}
              description={
                entries.length === 0
                  ? "Home에서 첫 기록을 남겨보세요."
                  : "다른 단어나 카테고리로 검색해보세요."
              }
            />
          </Card>
        ) : (
          results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onClick={() => openDetail(entry)} />
          ))
        )}
      </div>

      {editorState && (
        <EntryEditorModal
          mode={editorState.mode}
          defaultDate={editorState.date}
          initialEntry={editorState.initialEntry}
          onClose={closeEditor}
          onSaved={handleSaved}
        />
      )}
      {detailEntry && (
        <EntryDetailModal
          entry={detailEntry}
          onClose={closeDetail}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
