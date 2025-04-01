import { nil } from '../api/iPlayDataSource';
import { KVStorage } from './KVStorage';
import { preferences } from "@kit.ArkData"
import { common } from '@kit.AbilityKit';

export class PreferencesStorage implements KVStorage {
  client: preferences.Preferences|nil = null

  get<T>(key: string): T | nil {
    let data = this.client?.getSync(key, null)
    if (data == undefined) {
      return null
    }
    return JSON.parse(data as string)
  }

  set<T>(key: string, value: nil | T): void {
    this.client?.put(key, JSON.stringify(value))
  }

  init(ctx: object): void {
    this.client = preferences.getPreferencesSync(ctx as common.ApplicationContext, {
      name: "global"
    })
  }

}