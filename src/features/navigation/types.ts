export type TabKey = "home" | "search" | "statistics" | "settings";

export interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

export const TAB_ITEMS: TabItem[] = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "search", label: "Search", icon: "🔍" },
  { key: "statistics", label: "Statistics", icon: "📊" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];
