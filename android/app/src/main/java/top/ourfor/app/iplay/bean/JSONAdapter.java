package top.ourfor.app.iplay.bean;

import com.fasterxml.jackson.core.type.TypeReference;

import java.lang.reflect.Type;

public interface JSONAdapter {

    default String toJSON(Object obj) {
        return null;
    }

    default <T> T fromJSON(String json, Class<T> clazz) {
        return null;
    }

    default <T> T fromJSON(String json, TypeReference<T> typeReference) {
        return null;
    }

    default <T> T fromJSON(String json, Type type) {
        return null;
    }
}
