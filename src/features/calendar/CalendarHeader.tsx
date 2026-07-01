import RoundIconButton from "../../components/common/RoundIconButton";
import { formatMonthTitle } from "../../utils/date";

interface CalendarHeaderProps {
  monthDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({
  monthDate,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <header className="pt-safe flex flex-col gap-3 px-5 pt-4">
      <p className="text-lg font-semibold tracking-tight text-[var(--color-accent-strong)]">
        Index
      </p>
      <div className="flex items-center justify-between">
        <RoundIconButton aria-label="이전 달" onClick={onPrevMonth}>
          <span aria-hidden>‹</span>
        </RoundIconButton>
        <h1 className="text-[17px] font-semibold text-[var(--color-ink)]">
          {formatMonthTitle(monthDate)}
        </h1>
        <RoundIconButton aria-label="다음 달" onClick={onNextMonth}>
          <span aria-hidden>›</span>
        </RoundIconButton>
      </div>
    </header>
  );
}
