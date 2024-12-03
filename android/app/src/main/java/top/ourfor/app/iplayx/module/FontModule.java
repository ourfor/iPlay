package top.ourfor.app.iplayx.module;

import android.content.Context;
import android.graphics.Typeface;
import android.util.Log;

import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import top.ourfor.app.iplayx.config.AppSetting;

@Slf4j
public class FontModule {
    static private Map<String, Typeface> systemFontMap;

    static Map<String, Typeface> getSystemFontMap() throws NoSuchFieldException, IllegalAccessException {
        Typeface typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL);
        Field field = Typeface.class.getDeclaredField("sSystemFontMap");
        field.setAccessible(true);
        Map<String, Typeface> systemFontMap = (Map<String, Typeface>) field.get(typeface);
        return systemFontMap;
    }

    static public void obtainSystemFont() {
        try {
            systemFontMap = getSystemFontMap();
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error("obtain system font failed", e);
        }
    }

    public static List<String> getFontFamilyList() {
        if (systemFontMap == null) {
            obtainSystemFont();
        }
        return new ArrayList<>(systemFontMap.keySet());
    }

    public static Typeface getThemeFont() {
        return getFont(AppSetting.shared.fontFamily);
    }
    public static Typeface getFont(String familyName) {
        if (systemFontMap == null) {
            obtainSystemFont();
        }
        return systemFontMap.get(familyName);
    }

    public static String getFontPath(Context context) {
        File filesDir = context.getExternalFilesDir("");
        File fontDir = new File(filesDir, "font");
        return fontDir.getPath();
    }

    public static void initFont(Context context) {
        try {
            scanExternalFont(context);
        } catch (Exception e) {
            log.error("scan external font failed", e);
        }
    }

    public static void scanExternalFont(Context context) throws IllegalAccessException, NoSuchMethodException, NoSuchFieldException {
        File filesDir = context.getExternalFilesDir("");
        File fontDir = new File(filesDir, "font");
        if (!fontDir.exists()) {
            boolean created = fontDir.mkdirs();
            if (created) {
                log.debug("create fontDir success: {}", fontDir.getPath());
            } else {
                log.debug("create fontDir failed: {}", fontDir.getPath());
            }
        }

        File[] ttfs = fontDir.listFiles(f -> f.isFile() && f.getName().endsWith("ttf"));
        Map<String, Typeface> fontMap = getSystemFontMap();
        for (File ttf : ttfs) {
            Typeface font = Typeface.createFromFile(ttf);
            String familyName = ttf.getName().replace(".ttf", "");
            fontMap.put(familyName, font);
        }
    }

}
