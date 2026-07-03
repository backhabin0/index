import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_ORDER } from "../../models/category";
import type { EntryCategory } from "../../models/entry";
import { pillClass } from "../editor/fieldStyles";

interface CategoryFilterChipsProps {
  selected: EntryCategory | "all";
  onSelect: (category: EntryCategory | "all") => void;
}

export default function CategoryFilterChips({ selected, onSelect }: CategoryFilterChipsProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={`shrink-0 ${pillClass(selected === "all")}`}
      >
        전체
      </button>
      {CATEGORY_ORDER.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`flex shrink-0 items-center gap-1.5 ${pillClass(selected === category)}`}
        >
          <span aria-hidden>{CATEGORY_ICONS[category]}</span>
          <span>{CATEGORY_LABELS[category]}</span>
        </button>
      ))}
    </div>
  );
}
