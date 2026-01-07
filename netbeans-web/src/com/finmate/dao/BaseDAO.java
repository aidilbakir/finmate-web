package com.finmate.dao;

import com.finmate.config.DatabaseConfig;
import com.finmate.exception.DatabaseException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Abstract Base DAO Class
 * Demonstrasi: Inheritance & Abstract Class
 * Provides common database operations untuk semua DAO classes
 * 
 * @param <T> Entity type
 * @param <ID> ID type
 */
public abstract class BaseDAO<T, ID> {
    
    /**
     * Get database connection
     * @return Connection
     * @throws DatabaseException if connection fails
     */
    protected Connection getConnection() throws DatabaseException {
        try {
            return DatabaseConfig.getConnection();
        } catch (SQLException e) {
            throw new DatabaseException("Failed to get database connection", e);
        }
    }
    
    /**
     * Close database resources safely
     * @param conn Connection to close
     * @param stmt Statement to close
     * @param rs ResultSet to close
     */
    protected void closeResources(Connection conn, PreparedStatement stmt, ResultSet rs) {
        try {
            if (rs != null) rs.close();
        } catch (SQLException e) {
            System.err.println("Error closing ResultSet: " + e.getMessage());
        }
        
        try {
            if (stmt != null) stmt.close();
        } catch (SQLException e) {
            System.err.println("Error closing Statement: " + e.getMessage());
        }
        
        try {
            if (conn != null) conn.close();
        } catch (SQLException e) {
            System.err.println("Error closing Connection: " + e.getMessage());
        }
    }
    
    /**
     * Close resources (without ResultSet)
     */
    protected void closeResources(Connection conn, PreparedStatement stmt) {
        closeResources(conn, stmt, null);
    }
    
    /**
     * Execute update query (INSERT, UPDATE, DELETE)
     * @param sql SQL query
     * @param params Parameters for prepared statement
     * @return Number of affected rows
     * @throws DatabaseException if query fails
     */
    protected int executeUpdate(String sql, Object... params) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            
            for (int i = 0; i < params.length; i++) {
                stmt.setObject(i + 1, params[i]);
            }
            
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new DatabaseException("Failed to execute update: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt);
        }
    }
    
    /**
     * Execute query (SELECT)
     * @param sql SQL query
     * @param params Parameters for prepared statement
     * @return ResultSet
     * @throws DatabaseException if query fails
     */
    protected ResultSet executeQuery(String sql, Object... params) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            
            for (int i = 0; i < params.length; i++) {
                stmt.setObject(i + 1, params[i]);
            }
            
            rs = stmt.executeQuery();
            return rs;
        } catch (SQLException e) {
            closeResources(conn, stmt, rs);
            throw new DatabaseException("Failed to execute query: " + e.getMessage(), e);
        }
    }
}
