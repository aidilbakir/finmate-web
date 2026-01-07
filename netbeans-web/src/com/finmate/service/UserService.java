package com.finmate.service;

import com.finmate.dao.UserDAO;
import com.finmate.model.User;
import com.finmate.exception.*;
import com.finmate.util.ValidationUtil;
import org.mindrot.jbcrypt.BCrypt;

/**
 * User Service - Business Logic Layer
 * Demonstrates: Inheritance, Exception Handling, Business Validation
 * Handles user registration, authentication, and profile management
 */
public class UserService {
    
    private final UserDAO userDAO;
    
    public UserService() {
        this.userDAO = new UserDAO();
    }
    
    /**
     * Register new user
     * @param username Username
     * @param password Plain password
     * @param name Full name
     * @param email Email
     * @return Created user
     * @throws ValidationException if validation fails
     * @throws DatabaseException if database error occurs
     * @throws AuthenticationException if username already exists
     */
    public User register(String username, String password, String name, String email) 
            throws ValidationException, DatabaseException, AuthenticationException {
        
        // Validation
        ValidationUtil.validateUsername(username);
        ValidationUtil.validatePassword(password);
        ValidationUtil.validateNotEmpty(name, "name");
        ValidationUtil.validateEmail(email);
        
        // Check if username already exists
        if (userDAO.usernameExists(username)) {
            throw new AuthenticationException("Username already exists");
        }
        
        // Hash password dengan BCrypt
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        
        // Create user
        User user = new User(username, hashedPassword, name, email);
        return userDAO.create(user);
    }
    
    /**
     * Authenticate user (login)
     * @param username Username
     * @param password Plain password
     * @return User if authentication successful
     * @throws AuthenticationException if credentials invalid
     * @throws DatabaseException if database error
     */
    public User authenticate(String username, String password) 
            throws AuthenticationException, DatabaseException {
        
        if (username == null || username.trim().isEmpty()) {
            throw new AuthenticationException("Username cannot be empty");
        }
        
        if (password == null || password.trim().isEmpty()) {
            throw new AuthenticationException("Password cannot be empty");
        }
        
        // Find user by username
        User user = userDAO.findByUsername(username);
        
        if (user == null) {
            throw new AuthenticationException("Invalid username or password");
        }
        
        // Verify password dengan BCrypt
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new AuthenticationException("Invalid username or password");
        }
        
        // Don't return password to client
        user.setPassword(null);
        
        return user;
    }
    
    /**
     * Get user by ID
     * @param userId User ID
     * @return User
     * @throws ResourceNotFoundException if user not found
     * @throws DatabaseException if database error
     */
    public User getUserById(int userId) throws ResourceNotFoundException, DatabaseException {
        User user = userDAO.findById(userId);
        
        if (user == null) {
            throw new ResourceNotFoundException("User", userId);
        }
        
        // Don't return password
        user.setPassword(null);
        
        return user;
    }
    
    /**
     * Update user profile
     * @param userId User ID
     * @param name New name
     * @param email New email
     * @return Updated user
     * @throws ValidationException if validation fails
     * @throws ResourceNotFoundException if user not found
     * @throws DatabaseException if database error
     */
    public User updateProfile(int userId, String name, String email) 
            throws ValidationException, ResourceNotFoundException, DatabaseException {
        
        // Validation
        ValidationUtil.validateNotEmpty(name, "name");
        ValidationUtil.validateEmail(email);
        
        // Get existing user
        User user = userDAO.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User", userId);
        }
        
        // Update fields
        user.setName(name);
        user.setEmail(email);
        
        // Save
        User updated = userDAO.update(user);
        updated.setPassword(null);
        
        return updated;
    }
    
    /**
     * Delete user account
     * @param userId User ID
     * @return true if deleted
     * @throws DatabaseException if database error
     */
    public boolean deleteUser(int userId) throws DatabaseException {
        return userDAO.delete(userId);
    }
}
