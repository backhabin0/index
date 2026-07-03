import type { SortOption } from "../../utils/searchUtils";
import { pillClass } from "../editor/fieldStyles";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "ratingDesc", label: "별점 높은순" },
  { value: "priceDesc", label: "가격 높은순" },
  { value: "moodDesc", label: "기분 점수 높은순" },
];

interface SortChipsProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

export default function SortChips({ selected, onSelect }: SortChipsProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`shrink-0 ${pillClass(selected === option.value)}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
