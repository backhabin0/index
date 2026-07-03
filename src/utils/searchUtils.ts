import { CATEGORY_LABELS } from "../models/category";
import type { Entry, EntryCategory } from "../models/entry";
import { sortEntriesByDate } from "./date";

export type SortOption = "latest" | "oldest" | "ratingDesc" | "priceDesc" | "moodDesc";

export function normalizeText(text?: string | null): string {
  return (text ?? "").toString().trim().toLowerCase();
}

function collectSearchableText(entry: Entry): string {
  const fields: Array<string | undefined> = [
    entry.title,
    entry.body,
    entry.category,
    CATEGORY_LABELS[entry.category],
    entry.locationName,
    entry.subtitle,
    entry.directorOrCast,
    entry.oneLineReview,
    entry.quote,
    entry.authorOrPublisher,
    entry.purchasePlace,
    entry.purchaseCategory,
    entry.mealType,
    entry.foodType,
    entry.restaurantName,
    ...(entry.tags ?? []),
    ...(entry.companions ?? []),
  ];
  return fields.map(normalizeText).join(" ");
}

export function entryMatchesQuery(entry: Entry, query: string): boolean {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return collectSearchableText(entry).includes(normalizedQuery);
}

export function entryMatchesCategory(entry: Entry, category: EntryCategory | "all"): boolean {
  return category === "all" || entry.category === category;
}

interface FilterOptions {
  query?: string;
  category?: EntryCategory | "all";
}

export function filterEntries(entries: Entry[], { query = "", category = "all" }: FilterOptions): Entry[] {
  return entries.filter(
    (entry) => entryMatchesCategory(entry, category) && entryMatchesQuery(entry, query),
  );
}

/** 값이 없는 기록은 정렬 기준에서 항상 뒤로 밀려나도록 -Infinity로 취급한다. */
function numericValueOrFallback(value: number | undefined): number {
  return value ?? -Infinity;
}

function sortByNumericFieldDesc(entries: Entry[], getValue: (entry: Entry) => number | undefined): Entry[] {
  return [...entries].sort((a, b) => {
    const diff = numericValueOrFallback(getValue(b)) - numericValueOrFallback(getValue(a));
    if (diff !== 0) return diff;
    return b.date.localeCompare(a.date);
  });
}

export function sortEntries(entries: Entry[], sortOption: SortOption): Entry[] {
  switch (sortOption) {
    case "oldest":
      return sortEntriesByDate(entries, "asc");
    case "ratingDesc":
      return sortByNumericFieldDesc(entries, (entry) => entry.rating);
    case "priceDesc":
      return sortByNumericFieldDesc(entries, (entry) => entry.price);
    case "moodDesc":
      return sortByNumericFieldDesc(entries, (entry) => entry.moodScore);
    case "latest":
    default:
      return sortEntriesByDate(entries, "desc");
  }
}
