import Card from "../../components/common/Card";
import { CATEGORY_ICONS } from "../../models/category";
import type { EntryCategory } from "../../models/entry";
import { buildMonthGrid, isSameDay, toDateKey, WEEKDAY_LABELS } from "../../utils/date";

interface MonthCalendarGridProps {
  monthDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markersByDate: Record<string, EntryCategory[]>;
}

export default function MonthCalendarGrid({
  monthDate,
  selectedDate,
  onSelectDate,
  markersByDate,
}: MonthCalendarGridProps) {
  const cells = buildMonthGrid(monthDate);
  const today = new Date();

  return (
    <Card className="mx-5 mt-4 p-4">
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={label}
            className={`py-1 text-xs font-medium ${
              index === 0
                ? "text-[var(--color-accent-strong)]"
                : index === 6
                  ? "text-[var(--color-lavender)]"
                  : "text-[var(--color-ink-muted)]"
            }`}
          >
            {label}
          </span>
        ))}

        {cells.map(({ date, isCurrentMonth }) => {
          const dateKey = toDateKey(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const categories = markersByDate[dateKey] ?? [];

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`m-0.5 flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl text-sm transition ${
                isSelected
                  ? "bg-[var(--color-accent)] text-white shadow-[var(--shadow-soft)]"
                  : isToday
                    ? "bg-[var(--color-lavender-soft)] text-[var(--color-ink)]"
                    : isCurrentMonth
                      ? "text-[var(--color-ink)] hover:bg-[var(--color-app-bg)]"
                      : "text-[var(--color-ink-muted)]/40"
              }`}
            >
              <span>{date.getDate()}</span>
              <span className="flex h-3 items-center gap-0.5 text-[10px] leading-none">
                {categories.slice(0, 2).map((category, i) => (
                  <span key={i} aria-hidden>
                    {CATEGORY_ICONS[category]}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
