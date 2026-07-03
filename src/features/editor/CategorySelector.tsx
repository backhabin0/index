import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_ORDER } from "../../models/category";
import type { EntryCategory } from "../../models/entry";
import { pillClass } from "./fieldStyles";

interface CategorySelectorProps {
  selected: EntryCategory;
  onSelect: (category: EntryCategory) => void;
}

export default function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {CATEGORY_ORDER.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`flex shrink-0 items-center gap-1.5 ${pillClass(category === selected)}`}
        >
          <span aria-hidden>{CATEGORY_ICONS[category]}</span>
          <span>{CATEGORY_LABELS[category]}</span>
        </button>
      ))}
    </div>
  );
}
