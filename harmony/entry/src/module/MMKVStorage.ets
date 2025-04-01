import { JSON } from "@kit.ArkTS"
import { MMKV } from "@tencent/mmkv"
import { common } from "@kit.AbilityKit"
import { KVStorage } from "./KVStorage"
import { nil } from "../api/iPlayDataSource"

export class MMKVStorage implements KVStorage {
  get<T>(key: string): T|nil {
    let kv = MMKV.defaultMMKV()
    let data = kv.decodeString(key)
    if (data == undefined) {
      return null
    }
    return JSON.parse(data!) as T|nil
  }

  set<T>(key: string, value: T|nil): void {
    let data = JSON.stringify(value)
    let kv = MMKV.defaultMMKV()
    kv.encodeString(key, data)
  }

  init(ctx: object): void {
    MMKV.initialize(ctx as common.ApplicationContext)
  }

}