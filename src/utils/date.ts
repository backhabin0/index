const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatMonthTitle(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

/** "YYYY-MM-DD" 문자열을 로컬 타임존 기준 Date로 안전하게 되돌린다. */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

/** 기록 상세 화면 등에 쓰는 사람이 읽기 좋은 날짜 표기. 예: "2026년 7월 2일 (목)" */
export function formatDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_LABELS[date.getDay()]})`;
}

/** date(및 동률 시 createdAt) 기준으로 정렬한 새 배열을 반환한다. 원본 배열은 변경하지 않는다. */
export function sortEntriesByDate<T extends { date: string; createdAt: string }>(
  entries: T[],
  direction: "asc" | "desc" = "desc",
): T[] {
  const sorted = [...entries].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.createdAt.localeCompare(b.createdAt);
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}

export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
}

/** 달력 그리드에 표시할 6주(42칸) 분량의 날짜 셀을 만든다. */
export function buildMonthGrid(monthDate: Date): CalendarCell[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay(); // 0(일) ~ 6(토)
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return { date, isCurrentMonth: date.getMonth() === month };
  });
}

export { WEEKDAY_LABELS };
