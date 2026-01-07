package com.finmate.dao;

import com.finmate.model.Transaction;
import com.finmate.exception.DatabaseException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Transaction DAO Implementation
 * Demonstrates: CRUD Operations & Inheritance
 */
public class TransactionDAO extends BaseDAO<Transaction, Integer> implements IBaseDAO<Transaction, Integer> {
    
    @Override
    public Transaction create(Transaction transaction) throws DatabaseException {
        String sql = "INSERT INTO transactions (user_id, type, category, amount, description, transaction_date) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet generatedKeys = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, transaction.getUserId());
            stmt.setString(2, transaction.getType());
            stmt.setString(3, transaction.getCategory());
            stmt.setDouble(4, transaction.getAmount());
            stmt.setString(5, transaction.getDescription());
            stmt.setDate(6, transaction.getTransactionDate());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new DatabaseException("Creating transaction failed, no rows affected");
            }
            
            generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                transaction.setId(generatedKeys.getInt(1));
            }
            
            return transaction;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create transaction: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, generatedKeys);
        }
    }
    
    @Override
    public Transaction findById(Integer id) throws DatabaseException {
        String sql = "SELECT * FROM transactions WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToTransaction(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find transaction: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public List<Transaction> findAll(int userId) throws DatabaseException {
        String sql = "SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC, created_at DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Transaction> transactions = new ArrayList<>();
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                transactions.add(mapResultSetToTransaction(rs));
            }
            return transactions;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find transactions: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    /**
     * Find transactions by type (income or expense)
     */
    public List<Transaction> findByType(int userId, String type) throws DatabaseException {
        String sql = "SELECT * FROM transactions WHERE user_id = ? AND type = ? ORDER BY transaction_date DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Transaction> transactions = new ArrayList<>();
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.setString(2, type);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                transactions.add(mapResultSetToTransaction(rs));
            }
            return transactions;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find transactions by type: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    /**
     * Get recent transactions (last N transactions)
     */
    public List<Transaction> findRecent(int userId, int limit) throws DatabaseException {
        String sql = "SELECT * FROM transactions WHERE user_id = ? " +
                    "ORDER BY transaction_date DESC, created_at DESC LIMIT ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Transaction> transactions = new ArrayList<>();
        
        try {
            conn = getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.setInt(2, limit);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                transactions.add(mapResultSetToTransaction(rs));
            }
            return transactions;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to find recent transactions: " + e.getMessage(), e);
        } finally {
            closeResources(conn, stmt, rs);
        }
    }
    
    @Override
    public Transaction update(Transaction transaction) throws DatabaseException {
        String sql = "UPDATE transactions SET type = ?, category = ?, amount = ?, " +
                    "description = ?, transaction_date = ? WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql, 
                transaction.getType(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getId()
            );
            
            if (affectedRows == 0) {
                throw new DatabaseException("Updating transaction failed, transaction not found");
            }
            
            return findById(transaction.getId());
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to update transaction: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean delete(Integer id) throws DatabaseException {
        String sql = "DELETE FROM transactions WHERE id = ?";
        
        try {
            int affectedRows = executeUpdate(sql, id);
            return affectedRows > 0;
        } catch (DatabaseException e) {
            throw new DatabaseException("Failed to delete transaction: " + e.getMessage(), e);
        }
    }
    
    /**
     * Helper method to map ResultSet to Transaction object
     */
    private Transaction mapResultSetToTransaction(ResultSet rs) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.setId(rs.getInt("id"));
        transaction.setUserId(rs.getInt("user_id"));
        transaction.setType(rs.getString("type"));
        transaction.setCategory(rs.getString("category"));
        transaction.setAmount(rs.getDouble("amount"));
        transaction.setDescription(rs.getString("description"));
        transaction.setTransactionDate(rs.getDate("transaction_date"));
        transaction.setCreatedAt(rs.getTimestamp("created_at"));
        transaction.setUpdatedAt(rs.getTimestamp("updated_at"));
        return transaction;
    }
}
