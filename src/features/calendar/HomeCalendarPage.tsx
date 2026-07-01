import { useState } from "react";
import type { Entry } from "../../models/entry";
import { addMonths } from "../../utils/date";
import CalendarHeader from "./CalendarHeader";
import DayEntryFeed from "./DayEntryFeed";
import FloatingWriteButton from "./FloatingWriteButton";
import MonthCalendarGrid from "./MonthCalendarGrid";
import { SAMPLE_MARKERS } from "./sampleMarkers";

// 실제 기록 저장 기능은 아직 구현하지 않았으므로 항상 빈 배열을 사용한다.
const NO_ENTRIES: Entry[] = [];

export default function HomeCalendarPage() {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

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
        markersByDate={SAMPLE_MARKERS}
      />
      <DayEntryFeed selectedDate={selectedDate} entries={NO_ENTRIES} />
      <FloatingWriteButton />
    </div>
  );
}
