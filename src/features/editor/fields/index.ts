import type { ComponentType } from "react";
import type { EntryCategory } from "../../../models/entry";
import BookFields from "./BookFields";
import FoodFields from "./FoodFields";
import MoodFields from "./MoodFields";
import MovieFields from "./MovieFields";
import PurchaseFields from "./PurchaseFields";
import TravelFields from "./TravelFields";
import type { CategoryFieldsProps } from "./types";

export const CATEGORY_FIELD_COMPONENTS: Record<EntryCategory, ComponentType<CategoryFieldsProps>> = {
  mood: MoodFields,
  movie: MovieFields,
  book: BookFields,
  travel: TravelFields,
  purchase: PurchaseFields,
  food: FoodFields,
};

export type { CategoryFieldsProps } from "./types";
