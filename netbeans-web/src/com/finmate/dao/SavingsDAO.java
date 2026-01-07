package com.finmate.dao;

import com.finmate.model.SavingsGoal;
import com.finmate.exception.DatabaseException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Savings Goal DAO Implementation
 * Demonstrates: CRUD Operations, Inheritance & Stored Procedure Calls
 */
public class SavingsDAO extends BaseDAO<SavingsGoal, Integer> implements IBaseDAO<SavingsGoal, Integer> {
    
    @Override
    public SavingsGoal create(SavingsGoal goal) throws DatabaseException {
        String sql = "INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline) " +
                    "VALUES (?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet generatedKeys = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, goal.getUserId());
            stmt.setString(2, goal.getName());
            stmt.setDouble(3, goal.getTargetAmount());
            stmt.setDouble(4, goal.getCurrentAmount());
            stmt.setDate(5, goal.getDeadline());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new DatabaseException("Creating savings goal failed, no rows affected");
            }
            
            generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                goal.setId(generatedKeys.getInt(1));
            }
            
            return goal;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create savings goal: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, generatedKeys);
        }
    }
    
    @Override
    public SavingsGoal findById(Integer id) throws DatabaseException {
        String sql = "SELECT * FROM savings_goals WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToSavingsGoal(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find savings goal: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public List<SavingsGoal> findAll(int userId) throws DatabaseException {
        String sql = "SELECT * FROM savings_goals WHERE user_id = ? ORDER BY deadline ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<SavingsGoal> goals = new ArrayList<>();
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                goals.add(mapResultSetToSavingsGoal(rs));
            }
            return goals;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find savings goals: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public SavingsGoal update(SavingsGoal goal) throws DatabaseException {
        String sql = "UPDATE savings_goals SET name = ?, target_amount = ?, " +
                    "current_amount = ?, deadline = ?, is_completed = ? WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql,
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getDeadline(),
                goal.isCompleted(),
                goal.getId()
            );
            
            if (affectedRows == 0) {
                throw new DatabaseException("Updating savings goal failed, goal not found");
            }
            
            return findById(goal.getId());
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to update savings goal: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean delete(Integer id) throws DatabaseException {
        String sql = "DELETE FROM savings_goals WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql, id);
            return affectedRows > 0;
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to delete savings goal: " + e.getMessage(), e);
        }
    }
    
    /**
     * Add money to savings goal using stored procedure
     * 
Demonstrasi: Stored Procedure Call
     */
    public void addToSavings(int userId, int goalId, double amount) throws DatabaseException {
        String sql = "{CALL add_to_savings(?, ?, ?)}";
        Connection conn = null;
        CallableStatement stmt = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareCall(sql);
            stmt.setInt(1, userId);
            stmt.setInt(2, goalId);
            stmt.setDouble(3, amount);
            
            stmt.execute();
        } catch (SQLException e) {
            throw new DatabaseException("Failed to add to savings: " + e.getMessage(), e);
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                System.err.println("Error closing resources: " + e.getMessage());
            }
        }
    }
    
    /**
     * Get total savings amount for a user
     */
    public double getTotalSavings(int userId) throws DatabaseException {
        String sql = "SELECT SUM(current_amount) as total FROM savings_goals WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getDouble("total");
            }
            return 0;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to get total savings: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    /**
     * Helper method to map ResultSet to SavingsGoal object
     */
    private SavingsGoal mapResultSetToSavingsGoal(ResultSet rs) throws SQLException {
        SavingsGoal goal = new SavingsGoal();
        goal.setId(rs.getInt("id"));
        goal.setUserId(rs.getInt("user_id"));
        goal.setName(rs.getString("name"));
        goal.setTargetAmount(rs.getDouble("target_amount"));
        goal.setCurrentAmount(rs.getDouble("current_amount"));
        goal.setDeadline(rs.getDate("deadline"));
        goal.setCompleted(rs.getBoolean("is_completed"));
        goal.setCreatedAt(rs.getTimestamp("created_at"));
        goal.setUpdatedAt(rs.getTimestamp("updated_at"));
        return goal;
    }
}
