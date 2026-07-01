import { useState } from "react";
import HomeCalendarPage from "../features/calendar/HomeCalendarPage";
import BottomTabBar from "../features/navigation/BottomTabBar";
import type { TabKey } from "../features/navigation/types";
import SearchPage from "../features/search/SearchPage";
import SettingsPage from "../features/settings/SettingsPage";
import StatisticsPage from "../features/statistics/StatisticsPage";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-[var(--color-app-bg)]">
      <main className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+88px)]">
        {activeTab === "home" && <HomeCalendarPage />}
        {activeTab === "search" && <SearchPage />}
        {activeTab === "statistics" && <StatisticsPage />}
        {activeTab === "settings" && <SettingsPage />}
      </main>
      <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
