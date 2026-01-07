package com.finmate.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

/**
 * JSON Utility class untuk serialization/deserialization
 * Menggunakan Gson library
 */
public class JsonUtil {
    private static final Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd")
            .create();
    
    /**
     * Convert object to JSON string
     * @param obj Object to convert
     * @return JSON string
     */
    public static String toJson(Object obj) {
        return gson.toJson(obj);
    }
    
    /**
     * Convert JSON string to object
     * @param <T> Type of object
     * @param json JSON string
     * @param clazz Class of object
     * @return Deserialized object
     * @throws JsonSyntaxException if JSON is invalid
     */
    public static <T> T fromJson(String json, Class<T> clazz) throws JsonSyntaxException {
        return gson.fromJson(json, clazz);
    }
}
