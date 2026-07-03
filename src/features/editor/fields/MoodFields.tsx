import { labelClass } from "../fieldStyles";
import type { CategoryFieldsProps } from "./types";

export default function MoodFields({ draft, onChange }: CategoryFieldsProps) {
  const score = draft.moodScore ?? 5;

  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>오늘 기분 점수</label>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={score}
        onChange={(e) => onChange({ moodScore: Number(e.target.value) })}
        className="w-full accent-[var(--color-accent)]"
      />
      <p className="text-sm text-[var(--color-ink)]">현재 점수: {score} / 10</p>
    </div>
  );
}
