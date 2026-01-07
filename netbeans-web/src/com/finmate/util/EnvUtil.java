package com.finmate.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Environment Configuration Utility
 * Membaca konfigurasi dari file .env
 */
public class EnvUtil {
    private static final Properties properties = new Properties();
    private static boolean loaded = false;
    
    static {
        loadEnv();
    }
    
    /**
     * Load .env file from project root
     */
    private static void loadEnv() {
        if (loaded) return;
        
            // Priority 1: Try loading from Classpath (Standard for Web Apps)
            try (java.io.InputStream is = EnvUtil.class.getClassLoader().getResourceAsStream(".env")) {
                if (is != null) {
                    properties.load(is);
                    loaded = true;
                    System.out.println("✅ Loaded .env from Classpath");
                    return;
                }
            } catch (Exception e) { 
                System.out.println("ℹ️ .env not found in classpath, checking file system...");
            }

            try {
            // Try multiple possible locations
            String[] possiblePaths = {
                ".env",
                "../.env",
                "../../.env",
                System.getProperty("user.dir") + "/.env",
                System.getProperty("catalina.base") + "/../../.env"
            };
            
            for (String path : possiblePaths) {
                try (FileInputStream fis = new FileInputStream(path)) {
                    properties.load(fis);
                    loaded = true;
                    System.out.println("✅ Loaded .env from: " + path);
                    return;
                } catch (IOException e) {
                    // Try next path
                }
            }
            
            System.err.println("⚠️ Warning: .env file not found, using defaults");
            
        } catch (Exception e) {
            System.err.println("❌ Error loading .env: " + e.getMessage());
        }
    }
    
    /**
     * Get environment variable
     * @param key Variable name
     * @param defaultValue Default value if not found
     * @return Variable value or default
     */
    public static String get(String key, String defaultValue) {
        // First check system environment
        String value = System.getenv(key);
        if (value != null && !value.isEmpty()) {
            return value;
        }
        
        // Then check .env file
        value = properties.getProperty(key);
        if (value != null && !value.isEmpty()) {
            return value;
        }
        
        return defaultValue;
    }
    
    /**
     * Get environment variable (no default)
     * @param key Variable name
     * @return Variable value or null
     */
    public static String get(String key) {
        return get(key, null);
    }
    
    /**
     * Get integer environment variable
     * @param key Variable name
     * @param defaultValue Default value
     * @return Integer value
     */
    public static int getInt(String key, int defaultValue) {
        String value = get(key);
        if (value == null) return defaultValue;
        
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    /**
     * Get long environment variable
     * @param key Variable name
     * @param defaultValue Default value
     * @return Long value
     */
    public static long getLong(String key, long defaultValue) {
        String value = get(key);
        if (value == null) return defaultValue;
        
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    /**
     * Check if running in development mode
     */
    public static boolean isDevelopment() {
        return "development".equalsIgnoreCase(get("APP_ENV", "development"));
    }
    
    /**
     * Check if running in production mode
     */
    public static boolean isProduction() {
        return "production".equalsIgnoreCase(get("APP_ENV", "development"));
    }
}
