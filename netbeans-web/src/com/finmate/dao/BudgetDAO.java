package com.finmate.dao;

import com.finmate.model.Budget;
import com.finmate.exception.DatabaseException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Budget DAO Implementation
 * Demonstrates: CRUD Operations & Inheritance
 */
public class BudgetDAO extends BaseDAO<Budget, Integer> implements IBaseDAO<Budget, Integer> {
    
    @Override
    public Budget create(Budget budget) throws DatabaseException {
        String sql = "INSERT INTO budgets (user_id, category, budget_limit, spent) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet generatedKeys = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, budget.getUserId());
            stmt.setString(2, budget.getCategory());
            stmt.setDouble(3, budget.getBudgetLimit());
            stmt.setDouble(4, budget.getSpent());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new DatabaseException("Creating budget failed, no rows affected");
            }
            
            generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                budget.setId(generatedKeys.getInt(1));
            }
            
            return budget;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create budget: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, generatedKeys);
        }
    }
    
    @Override
    public Budget findById(Integer id) throws DatabaseException {
        String sql = "SELECT * FROM budgets WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToBudget(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find budget: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public List<Budget> findAll(int userId) throws DatabaseException {
        String sql = "SELECT * FROM budgets WHERE user_id = ? ORDER BY category";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Budget> budgets = new ArrayList<>();
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                budgets.add(mapResultSetToBudget(rs));
            }
            return budgets;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find budgets: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    /**
     * Find budget by category for a user
     */
    public Budget findByCategory(int userId, String category) throws DatabaseException {
        String sql = "SELECT * FROM budgets WHERE user_id = ? AND category = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.setString(2, category);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToBudget(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find budget by category: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public Budget update(Budget budget) throws DatabaseException {
        String sql = "UPDATE budgets SET budget_limit = ?, spent = ? WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql,
                budget.getBudgetLimit(),
                budget.getSpent(),
                budget.getId()
            );
            
            if (affectedRows == 0) {
                throw new DatabaseException("Updating budget failed, budget not found");
            }
            
            return findById(budget.getId());
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to update budget: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean delete(Integer id) throws DatabaseException {
        String sql = "DELETE FROM budgets WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql, id);
            return affectedRows > 0;
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to delete budget: " + e.getMessage(), e);
        }
    }
    
    /**
     * Helper method to map ResultSet to Budget object
     */
    private Budget mapResultSetToBudget(ResultSet rs) throws SQLException {
        Budget budget = new Budget();
        budget.setId(rs.getInt("id"));
        budget.setUserId(rs.getInt("user_id"));
        budget.setCategory(rs.getString("category"));
        budget.setBudgetLimit(rs.getDouble("budget_limit"));
        budget.setSpent(rs.getDouble("spent"));
        budget.setCreatedAt(rs.getTimestamp("created_at"));
        budget.setUpdatedAt(rs.getTimestamp("updated_at"));
        return budget;
    }
}
