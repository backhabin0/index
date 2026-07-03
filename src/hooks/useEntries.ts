import { useCallback, useEffect, useState } from "react";
import type { Entry } from "../models/entry";
import { entryRepository } from "../repositories/entryRepository";

/** entryRepository에서 전체 기록을 불러오고, 재조회(refreshEntries)를 제공하는 공통 훅. */
export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const all = await entryRepository.getAllEntries();
      setEntries(all);
    } catch {
      setLoadError("저장된 기록을 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return { entries, isLoading, loadError, refreshEntries: loadEntries };
}
