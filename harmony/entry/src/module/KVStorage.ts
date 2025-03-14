import { nil } from "../api/iPlayDataSource"

export interface KVStorage {
  get<T>(key: string): T|nil
  set<T>(key: string, value: T|nil)
}

class SimpleStorage implements KVStorage {
  get<T>(key: string): T|nil {
    return AppStorage.get<T>(key)
  }

  set<T>(key: any, value: T|nil): void {
    PersistentStorage.persistProp<T>(key, value)
  }

}

export const kv: KVStorage = new SimpleStorage()