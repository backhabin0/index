import type { EntryCategory } from "../../models/entry";
import { toDateKey } from "../../utils/date";

/**
 * 실제 기록 데이터가 아직 없으므로, 달력에 카테고리 아이콘 자리를 보여주기 위한
 * 최소한의 더미 표시용 데이터. 오늘 기준 상대 날짜로 만들어 항상 이번 달에 보이게 한다.
 */
function buildSampleMarkers(): Record<string, EntryCategory[]> {
  const today = new Date();
  const offset = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d;
  };

  return {
    [toDateKey(offset(-4))]: ["mood"],
    [toDateKey(offset(-2))]: ["food", "purchase"],
    [toDateKey(offset(0))]: ["movie"],
    [toDateKey(offset(3))]: ["book"],
    [toDateKey(offset(6))]: ["travel", "food"],
  };
}

export const SAMPLE_MARKERS = buildSampleMarkers();
