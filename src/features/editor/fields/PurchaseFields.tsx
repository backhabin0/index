import { inputClass, labelClass, pillClass } from "../fieldStyles";
import type { CategoryFieldsProps } from "./types";

const SATISFACTIONS = ["최고예요", "좋아요", "보통이에요", "아쉬워요"];
const PURCHASE_CATEGORIES = ["패션", "전자기기", "리빙", "취미", "기타"];

export default function PurchaseFields({ draft, onChange }: CategoryFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>가격</label>
        <input
          type="number"
          inputMode="numeric"
          className={inputClass}
          value={draft.price ?? ""}
          onChange={(e) =>
            onChange({ price: e.target.value === "" ? undefined : Number(e.target.value) })
          }
          placeholder="예: 39000"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>구매처</label>
        <input
          className={inputClass}
          value={draft.purchasePlace ?? ""}
          onChange={(e) => onChange({ purchasePlace: e.target.value })}
          placeholder="예: 무신사"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>만족도</label>
        <div className="flex flex-wrap gap-2">
          {SATISFACTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ satisfaction: s })}
              className={pillClass(draft.satisfaction === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>소비 카테고리</label>
        <div className="flex flex-wrap gap-2">
          {PURCHASE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ purchaseCategory: c })}
              className={pillClass(draft.purchaseCategory === c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
