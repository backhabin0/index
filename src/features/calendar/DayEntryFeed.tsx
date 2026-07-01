import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import type { Entry } from "../../models/entry";

interface DayEntryFeedProps {
  selectedDate: Date;
  entries: Entry[];
}

export default function DayEntryFeed({ selectedDate, entries }: DayEntryFeedProps) {
  const label = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 기록`;

  return (
    <section className="mx-5 mt-5 flex flex-1 flex-col gap-3 pb-4">
      <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">{label}</h2>

      {entries.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 이 날의 기록이 없어요."
            description="소중한 순간을 남겨보세요."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4 text-left">
              <p className="text-sm font-semibold text-[var(--color-ink)]">{entry.title}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{entry.body}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
