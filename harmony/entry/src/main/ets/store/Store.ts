import { EmbyApi } from "../../../api/emby/EmbyApi";
import { iPlayDataSourceApi, nil, SiteModel } from "../../../api/iPlayDataSource"
import { kv } from "../../../module/KVStorage";

export class Store {
    site: SiteModel|nil;
    sites: SiteModel[]|nil;
    api: iPlayDataSourceApi|nil;

    addSite(site: SiteModel) {
      this.site = site;
      this.sites = [...(this.sites ?? []), this.site]
      this.save()
    }

    load() {
      let old = kv.get<Store>("@store")
      this.site = old?.site
      this.sites = old?.sites
      if (this.site != null) {
        let api = new EmbyApi()
        this.api = api
      }
    }

    save() {
      kv.set("@store", this)
    }
}

export const store = new Store()