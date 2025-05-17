package top.ourfor.app.iplay.module;

import static top.ourfor.app.iplay.module.Bean.XGET;
import top.ourfor.app.iplay.store.GlobalStore;

public class ModuleManager {

    public CacheModule defaultCacheModule() {
        return new CacheModule();
    }

    public GlobalStore defaultGlobalStore() {
        return XGET(GlobalStore.class);
    }
}
