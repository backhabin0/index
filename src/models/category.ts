import type { EntryCategory } from "./entry";

export const CATEGORY_ICONS: Record<EntryCategory, string> = {
  mood: "😊",
  movie: "🎬",
  book: "📚",
  travel: "🧳",
  purchase: "🛍️",
  food: "🍔",
};

export const CATEGORY_LABELS: Record<EntryCategory, string> = {
  mood: "마음 일기",
  movie: "영화감상",
  book: "독서록",
  travel: "여행일지",
  purchase: "내돈내산",
  food: "푸드로그",
};

export const CATEGORY_ORDER: EntryCategory[] = [
  "mood",
  "movie",
  "book",
  "travel",
  "purchase",
  "food",
];
