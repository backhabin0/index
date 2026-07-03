import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import EntryCard from "../../components/common/EntryCard";
import type { Entry } from "../../models/entry";

interface DayEntryFeedProps {
  selectedDate: Date;
  entries: Entry[];
  isLoading?: boolean;
  loadError?: string | null;
  onSelectEntry?: (entry: Entry) => void;
}

export default function DayEntryFeed({
  selectedDate,
  entries,
  isLoading = false,
  loadError = null,
  onSelectEntry,
}: DayEntryFeedProps) {
  const label = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 기록`;

  return (
    <section className="mx-5 mt-5 flex flex-1 flex-col gap-3 pb-4">
      <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">{label}</h2>

      {isLoading ? (
        <Card>
          <EmptyState title="기록을 불러오는 중이에요." />
        </Card>
      ) : loadError ? (
        <Card>
          <EmptyState title={loadError} description="새로고침 후 다시 시도해주세요." />
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 이 날의 기록이 없어요."
            description="소중한 순간을 남겨보세요."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onClick={onSelectEntry ? () => onSelectEntry(entry) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
