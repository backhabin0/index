import { TAB_ITEMS, type TabKey } from "./types";

interface BottomTabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export default function BottomTabBar({ activeTab, onSelectTab }: BottomTabBarProps) {
  return (
    <nav className="pb-safe absolute inset-x-0 bottom-0 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="flex items-stretch justify-around px-2 pt-2">
        {TAB_ITEMS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-xs font-medium transition"
            >
              <span
                className={`text-lg ${isActive ? "" : "opacity-40"}`}
                aria-hidden
              >
                {tab.icon}
              </span>
              <span
                className={
                  isActive
                    ? "text-[var(--color-accent-strong)]"
                    : "text-[var(--color-ink-muted)]"
                }
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
