import type { Entry } from "../models/entry";
import { localDatabase } from "../services/localDatabase";

const ENTRIES_KEY = "entries";

export interface EntryRepository {
  getAllEntries(): Promise<Entry[]>;
  getEntryById(id: string): Promise<Entry | null>;
  getEntriesByDate(date: string): Promise<Entry[]>;
  createEntry(entry: Entry): Promise<Entry>;
  updateEntry(entry: Entry): Promise<Entry>;
  deleteEntry(id: string): Promise<void>;
  deleteAllEntries(): Promise<void>;
}

async function readEntryMap(): Promise<Record<string, Entry>> {
  const map = await localDatabase.getItem<Record<string, Entry>>("entries", ENTRIES_KEY);
  return map ?? {};
}

async function writeEntryMap(map: Record<string, Entry>): Promise<void> {
  await localDatabase.setItem("entries", ENTRIES_KEY, map);
}

/**
 * localForage(IndexedDB) 기반 구현. Entry 전체를 하나의 Record<id, Entry>로
 * "entries" store에 저장한다. 나중에 Firestore로 교체할 때도 이 EntryRepository
 * 인터페이스는 그대로 유지하면 된다.
 */
class LocalForageEntryRepository implements EntryRepository {
  async getAllEntries(): Promise<Entry[]> {
    const map = await readEntryMap();
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getEntryById(id: string): Promise<Entry | null> {
    const map = await readEntryMap();
    return map[id] ?? null;
  }

  async getEntriesByDate(date: string): Promise<Entry[]> {
    // date는 항상 YYYY-MM-DD 형식이므로 문자열 동등 비교만으로 안전하게 일치 여부를 판단할 수 있다.
    const map = await readEntryMap();
    return Object.values(map).filter((entry) => entry.date === date);
  }

  async createEntry(entry: Entry): Promise<Entry> {
    const map = await readEntryMap();
    map[entry.id] = entry;
    await writeEntryMap(map);
    return entry;
  }

  async updateEntry(entry: Entry): Promise<Entry> {
    const map = await readEntryMap();
    if (!map[entry.id]) {
      throw new Error(`수정할 기록을 찾을 수 없어요 (id: ${entry.id})`);
    }
    const updated: Entry = { ...entry, updatedAt: new Date().toISOString() };
    map[entry.id] = updated;
    await writeEntryMap(map);
    return updated;
  }

  async deleteEntry(id: string): Promise<void> {
    const map = await readEntryMap();
    delete map[id];
    await writeEntryMap(map);
  }

  async deleteAllEntries(): Promise<void> {
    await localDatabase.clear("entries");
  }
}

export const entryRepository: EntryRepository = new LocalForageEntryRepository();
