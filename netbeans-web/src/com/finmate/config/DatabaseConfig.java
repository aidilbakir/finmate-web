package com.finmate.config;

import com.finmate.util.EnvUtil;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Database Configuration dengan HikariCP Connection Pooling
 * Menggunakan environment variables dari .env file
 * Singleton pattern untuk manage database connections
 */
public class DatabaseConfig {
    // Load dari .env file
    private static final String DB_HOST = EnvUtil.get("DB_HOST", "localhost");
    private static final String DB_PORT = EnvUtil.get("DB_PORT", "3306");
    private static final String DB_NAME = EnvUtil.get("DB_NAME", "finmate");
    private static final String DB_USER = EnvUtil.get("DB_USER", "root");
    private static final String DB_PASSWORD = EnvUtil.get("DB_PASSWORD", "");
    
    private static final String DB_URL = String.format(
        "jdbc:mysql://%s:%s/%s?useSSL=false&serverTimezone=UTC",
        DB_HOST, DB_PORT, DB_NAME
    );
    
    private static HikariDataSource dataSource;
    
    static {
        try {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException e) {
                System.err.println("❌ MySQL Driver class not found in classpath!");
                e.printStackTrace();
            }

            HikariConfig config = new HikariConfig();
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            config.setJdbcUrl(DB_URL);
            config.setUsername(DB_USER);
            config.setPassword(DB_PASSWORD);
            
            // Connection pool settings
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000); // 30 seconds
            config.setIdleTimeout(600000); // 10 minutes
            config.setMaxLifetime(1800000); // 30 minutes
            
            // Performance settings
            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            
            dataSource = new HikariDataSource(config);
            
            System.out.println("✅ Database connection pool initialized successfully!");
            System.out.println("📍 Connected to: " + DB_HOST + ":" + DB_PORT + "/" + DB_NAME);
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize database connection pool!");
            e.printStackTrace();
            throw new RuntimeException("Database initialization failed", e);
        }
    }
    
    /**
     * Get database connection from pool
     * @return Connection object
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    /**
     * Close connection pool (call on application shutdown)
     */
    public static void close() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            System.out.println("✅ Database connection pool closed");
        }
    }
    
    /**
     * Test database connection
     * @return true if connection successful
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("❌ Database connection test failed: " + e.getMessage());
            return false;
        }
    }
}
