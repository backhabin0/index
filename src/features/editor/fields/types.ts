import type { Entry } from "../../../models/entry";

export interface CategoryFieldsProps {
  draft: Partial<Entry>;
  onChange: (patch: Partial<Entry>) => void;
}
