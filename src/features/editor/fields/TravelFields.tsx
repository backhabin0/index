import { inputClass, labelClass } from "../fieldStyles";
import type { CategoryFieldsProps } from "./types";

export default function TravelFields({ draft, onChange }: CategoryFieldsProps) {
  const companionsText = (draft.companions ?? []).join(", ");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>장소명</label>
        <input
          className={inputClass}
          value={draft.locationName ?? ""}
          onChange={(e) => onChange({ locationName: e.target.value })}
          placeholder="예: 제주도 협재해변"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>동행인</label>
        <input
          className={inputClass}
          value={companionsText}
          onChange={(e) =>
            onChange({
              companions: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="쉼표로 구분해서 입력 (예: 지연, 민수)"
        />
      </div>

      <p className="text-xs text-[var(--color-ink-muted)]">
        사진은 아래 사진 첨부에서 여러 장 추가할 수 있어요.
      </p>
    </div>
  );
}
