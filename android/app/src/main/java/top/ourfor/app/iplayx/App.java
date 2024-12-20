package top.ourfor.app.iplayx;

import static top.ourfor.app.iplayx.module.Bean.XSET;

import android.app.Application;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatDelegate;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import dagger.hilt.android.HiltAndroidApp;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import top.ourfor.app.iplayx.bean.JSONAdapter;
import top.ourfor.app.iplayx.bean.KVStorage;
import top.ourfor.app.iplayx.config.AppSetting;
import top.ourfor.app.iplayx.module.FontModule;
import top.ourfor.app.iplayx.util.DeviceUtil;
import top.ourfor.app.iplayx.util.JacksonJsonAdapter;
import top.ourfor.app.iplayx.util.MMKVStorage;
import top.ourfor.app.iplayx.module.CrashManager;
import top.ourfor.app.iplayx.store.GlobalStore;

@Slf4j
@HiltAndroidApp
public class App extends Application {
    private ThreadPoolExecutor executor = null;

    @Override
    public void onCreate() {
        super.onCreate();
        val context = getApplicationContext();
        FontModule.initFont(context);
        DeviceUtil.init(context);
        XSET(Application.class, this);
        XSET(Context.class, context);
        XSET(JSONAdapter.class, JacksonJsonAdapter.shared);
        XSET(KVStorage.class, MMKVStorage.shared);
        XSET(GlobalStore.class, GlobalStore.shared);
        // get device cpu core count
        val coreCount = DeviceUtil.cpuCoreCount();
        executor = new ThreadPoolExecutor(coreCount, coreCount * 2, 60, TimeUnit.SECONDS, new LinkedBlockingQueue<>());
        XSET(ThreadPoolExecutor.class, executor);
        AppCompatDelegate.setDefaultNightMode(AppSetting.shared.appTheme());
        setupExceptionHandler();
    }

    void setupExceptionHandler() {
        val crashManager = new CrashManager(this);
        Thread.setDefaultUncaughtExceptionHandler(crashManager);
        var exitAfterCrash = AppSetting.shared.exitAfterCrash;
        if (exitAfterCrash) {
            return;
        }

        new Handler(Looper.getMainLooper()).post(() -> {
            //noinspection InfiniteLoopStatement
            while (true) {
                try {
                    Looper.loop();
                } catch (Throwable e) {
                    log.error("loop error", e);
                }
            }
        });
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        executor = null;
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        log.info("on low memory");
    }
}

