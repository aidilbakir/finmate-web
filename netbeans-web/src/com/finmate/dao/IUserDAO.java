package com.finmate.dao;

import com.finmate.model.User;
import com.finmate.exception.DatabaseException;

/**
 * Interface untuk User DAO operations
 * Extends IBaseDAO - demonstrasi Interface Inheritance
 */
public interface IUserDAO extends IBaseDAO<User, Integer> {
    
    /**
     * Find user by username
     * @param username Username
     * @return User or null if not found
     * @throws DatabaseException if database error occurs
     */
    User findByUsername(String username) throws DatabaseException;
    
    /**
     * Check if username exists
     * @param username Username to check
     * @return true if exists
     * @throws DatabaseException if database error occurs
     */
    boolean usernameExists(String username) throws DatabaseException;
}
