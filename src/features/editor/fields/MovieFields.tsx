import StarRating from "../../../components/common/StarRating";
import { inputClass, labelClass } from "../fieldStyles";
import type { CategoryFieldsProps } from "./types";

export default function MovieFields({ draft, onChange }: CategoryFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>감독/출연진</label>
        <input
          className={inputClass}
          value={draft.directorOrCast ?? ""}
          onChange={(e) => onChange({ directorOrCast: e.target.value })}
          placeholder="예: 봉준호"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>별점</label>
        <StarRating value={draft.rating ?? 0} onChange={(v) => onChange({ rating: v })} />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>한줄평</label>
        <input
          className={inputClass}
          value={draft.oneLineReview ?? ""}
          onChange={(e) => onChange({ oneLineReview: e.target.value })}
          placeholder="한 줄로 남기는 감상평"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>명대사</label>
        <input
          className={inputClass}
          value={draft.quote ?? ""}
          onChange={(e) => onChange({ quote: e.target.value })}
          placeholder="기억에 남는 대사"
        />
      </div>
    </div>
  );
}
