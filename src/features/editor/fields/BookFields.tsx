import StarRating from "../../../components/common/StarRating";
import { inputClass, labelClass, pillClass } from "../fieldStyles";
import type { CategoryFieldsProps } from "./types";

const READING_STATUSES = [
  { value: "reading", label: "읽는 중" },
  { value: "completed", label: "완독" },
] as const;

export default function BookFields({ draft, onChange }: CategoryFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>저자/출판사</label>
        <input
          className={inputClass}
          value={draft.authorOrPublisher ?? ""}
          onChange={(e) => onChange({ authorOrPublisher: e.target.value })}
          placeholder="예: 김영하 / 문학동네"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>읽는 상태</label>
        <div className="flex gap-2">
          {READING_STATUSES.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => onChange({ readingStatus: status.value })}
              className={pillClass(draft.readingStatus === status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>별점</label>
        <StarRating value={draft.rating ?? 0} onChange={(v) => onChange({ rating: v })} />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>인상 깊은 구절</label>
        <textarea
          className={`${inputClass} min-h-16`}
          value={draft.quote ?? ""}
          onChange={(e) => onChange({ quote: e.target.value })}
          placeholder="마음에 남는 문장을 적어보세요"
        />
      </div>
    </div>
  );
}
