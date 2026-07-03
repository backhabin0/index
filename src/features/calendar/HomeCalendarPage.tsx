import { useMemo, useState } from "react";
import EntryDetailModal from "../editor/EntryDetailModal";
import EntryEditorModal from "../editor/EntryEditorModal";
import { useEntryWorkspace } from "../../hooks/useEntryWorkspace";
import type { EntryCategory } from "../../models/entry";
import { addMonths, toDateKey } from "../../utils/date";
import CalendarHeader from "./CalendarHeader";
import DayEntryFeed from "./DayEntryFeed";
import FloatingWriteButton from "./FloatingWriteButton";
import MonthCalendarGrid from "./MonthCalendarGrid";

export default function HomeCalendarPage() {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const {
    entries,
    isLoading,
    loadError,
    detailEntry,
    openDetail,
    closeDetail,
    editorState,
    openCreate,
    openEdit,
    closeEditor,
    handleSaved,
    handleDelete,
  } = useEntryWorkspace();

  const markersByDate = useMemo(() => {
    const merged: Record<string, EntryCategory[]> = {};
    for (const entry of entries) {
      const categories = new Set([...(merged[entry.date] ?? []), entry.category]);
      merged[entry.date] = [...categories];
    }
    return merged;
  }, [entries]);

  const entriesForSelectedDate = entries.filter(
    (entry) => entry.date === toDateKey(selectedDate),
  );

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        monthDate={monthDate}
        onPrevMonth={() => setMonthDate((prev) => addMonths(prev, -1))}
        onNextMonth={() => setMonthDate((prev) => addMonths(prev, 1))}
      />
      <MonthCalendarGrid
        monthDate={monthDate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        markersByDate={markersByDate}
      />
      <DayEntryFeed
        selectedDate={selectedDate}
        entries={entriesForSelectedDate}
        isLoading={isLoading}
        loadError={loadError}
        onSelectEntry={openDetail}
      />
      <FloatingWriteButton onClick={() => openCreate(selectedDate)} />
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
