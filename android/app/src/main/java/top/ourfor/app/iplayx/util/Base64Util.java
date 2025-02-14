package top.ourfor.app.iplayx.util;


import android.util.Base64;

import javax.annotation.Nonnull;

public class Base64Util {

    @Nonnull
    public static String encode(String content) {
        return Base64.encodeToString(content.getBytes(), Base64.URL_SAFE | Base64.NO_WRAP);
    }
}
