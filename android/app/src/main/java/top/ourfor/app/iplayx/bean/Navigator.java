package top.ourfor.app.iplayx.bean;

import java.util.Map;

import top.ourfor.app.iplayx.common.model.HomeTabModel;
import top.ourfor.app.iplayx.page.Page;

public interface Navigator {
    default void pushPage(int id, Map<String, Object> params) {}
    default void pushPage(String name, Map<String, Object> params) {}
    default void pushPage(Page page, Map<String, Object> params) {}
    default boolean popPage() {
        return true;
    }

    default boolean canGoBack() {
        return true;
    }

    default Page getCurrentPage() {
        return null;
    };

    default int getCurrentPageId() {
        return 0;
    }

    default Map<String, HomeTabModel> getHomeTabs() {
        return null;
    }
}
