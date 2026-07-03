import localforage from "localforage";

const DB_NAME = "index-pwa";

/** 새 store가 필요하면 이 union에 이름만 추가하면 된다. */
export type StoreName = "entries" | "photos";

export class LocalDatabaseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LocalDatabaseError";
  }
}

const instances = new Map<StoreName, LocalForage>();

function getStore(storeName: StoreName): LocalForage {
  const existing = instances.get(storeName);
  if (existing) return existing;

  const instance = localforage.createInstance({
    name: DB_NAME,
    storeName,
  });
  instances.set(storeName, instance);
  return instance;
}

/**
 * localForage(IndexedDB 우선, 미지원 환경에서는 자동으로 다른 드라이버로 대체) 기반의
 * 얇은 래퍼. 모든 메서드는 실패 시 LocalDatabaseError로 감싸 던지므로,
 * 호출부에서 저장 실패를 사용자에게 안내하기 쉽다.
 */
export const localDatabase = {
  async getItem<T>(storeName: StoreName, key: string): Promise<T | null> {
    try {
      return await getStore(storeName).getItem<T>(key);
    } catch (error) {
      throw new LocalDatabaseError(`데이터를 불러오지 못했어요 (${storeName}/${key})`, {
        cause: error,
      });
    }
  },

  async setItem<T>(storeName: StoreName, key: string, value: T): Promise<T> {
    try {
      return await getStore(storeName).setItem(key, value);
    } catch (error) {
      throw new LocalDatabaseError(`데이터를 저장하지 못했어요 (${storeName}/${key})`, {
        cause: error,
      });
    }
  },

  async removeItem(storeName: StoreName, key: string): Promise<void> {
    try {
      await getStore(storeName).removeItem(key);
    } catch (error) {
      throw new LocalDatabaseError(`데이터를 삭제하지 못했어요 (${storeName}/${key})`, {
        cause: error,
      });
    }
  },

  async keys(storeName: StoreName): Promise<string[]> {
    try {
      return await getStore(storeName).keys();
    } catch (error) {
      throw new LocalDatabaseError(`목록을 불러오지 못했어요 (${storeName})`, { cause: error });
    }
  },

  async clear(storeName: StoreName): Promise<void> {
    try {
      await getStore(storeName).clear();
    } catch (error) {
      throw new LocalDatabaseError(`저장소를 초기화하지 못했어요 (${storeName})`, {
        cause: error,
      });
    }
  },
};
