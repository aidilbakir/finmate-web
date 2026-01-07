package com.finmate.dao;

import com.finmate.model.User;
import com.finmate.exception.DatabaseException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * User DAO Implementation
 * Demonstrates: CRUD Operations, Inheritance (extends BaseDAO), Interface Implementation
 * Handles all database operations untuk User entity
 */
public class UserDAO extends BaseDAO<User, Integer> implements IUserDAO {
    
    @Override
    public User create(User user) throws DatabaseException {
        String sql = "INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet generatedKeys = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getPassword());
            stmt.setString(3, user.getName());
            stmt.setString(4, user.getEmail());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new DatabaseException("Creating user failed, no rows affected");
            }
            
            generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                user.setId(generatedKeys.getInt(1));
            } else {
                throw new DatabaseException("Creating user failed, no ID obtained");
            }
            
            return user;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create user: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, generatedKeys);
        }
    }
    
    @Override
    public User findById(Integer id) throws DatabaseException {
        String sql = "SELECT * FROM users WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToUser(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find user by ID: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public User findByUsername(String username) throws DatabaseException {
        String sql = "SELECT * FROM users WHERE username = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToUser(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find user by username: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public List<User> findAll(int userId) throws DatabaseException {
        // For user table, this doesn't make much sense but implemented for interface compliance
        String sql = "SELECT * FROM users";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<User> users = new ArrayList<>();
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
            return users;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find all users: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public User update(User user) throws DatabaseException {
        String sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail());
            stmt.setInt(3, user.getId());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new DatabaseException("Updating user failed, user not found");
            }
            
            return findById(user.getId());
        } catch (SQLException e) {
            throw new DatabaseException("Failed to update user: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt);
        }
    }
    
    @Override
    public boolean delete(Integer id) throws DatabaseException {
        String sql = "DELETE FROM users WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql, id);
            return affectedRows > 0;
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to delete user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean usernameExists(String username) throws DatabaseException {
        String sql = "SELECT COUNT(*) as count FROM users WHERE username = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("count") > 0;
            }
            return false;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check username existence: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    /**
     * Helper method to map ResultSet to User object
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        user.setUpdatedAt(rs.getTimestamp("updated_at"));
        return user;
    }
}
