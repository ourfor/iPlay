package top.ourfor.app.iplayx.module;

import com.fasterxml.jackson.core.type.TypeReference;

public class Type {
    public static <T> TypeReference<T> typeof(T obj) {
        return new TypeReference<T>() {};
    }
}
