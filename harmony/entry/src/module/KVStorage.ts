import { nil } from "../api/iPlayDataSource"


export interface KVStorage {
  get<T>(key: string): T|nil
  set<T>(key: string, value: T|nil): void

  init(ctx: object): void
}

export class SimpleKVStorage implements KVStorage {
  real: KVStorage|nil

  get<T>(key: string): T | nil {
    return this.real?.get(key)
  }

  set<T>(key: string, value: nil | T): void {
    return this.real?.set(key, value)
  }

  init(ctx: object): void {
    this.real = ctx as KVStorage
  }

}

export let kv: KVStorage = new SimpleKVStorage()