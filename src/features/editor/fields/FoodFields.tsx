import StarRating from "../../../components/common/StarRating";
import { inputClass, labelClass, pillClass } from "../fieldStyles";
import type { CategoryFieldsProps } from "./types";

const MEAL_TYPES = ["아침", "점심", "저녁", "디저트", "야식"];
const FOOD_TYPES = ["외식", "집밥", "배달"];

export default function FoodFields({ draft, onChange }: CategoryFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>식사 종류</label>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ mealType: m })}
              className={pillClass(draft.mealType === m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>구분</label>
        <div className="flex flex-wrap gap-2">
          {FOOD_TYPES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onChange({ foodType: f })}
              className={pillClass(draft.foodType === f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>식당명</label>
        <input
          className={inputClass}
          value={draft.restaurantName ?? ""}
          onChange={(e) => onChange({ restaurantName: e.target.value })}
          placeholder="예: 을지로 골목식당"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>맛 별점</label>
        <StarRating value={draft.rating ?? 0} onChange={(v) => onChange({ rating: v })} />
      </div>
    </div>
  );
}
