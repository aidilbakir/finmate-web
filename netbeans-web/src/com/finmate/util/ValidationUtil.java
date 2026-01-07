package com.finmate.util;

import com.finmate.exception.ValidationException;
import java.util.regex.Pattern;

/**
 * Validation Utility class untuk common validation operations
 */
public class ValidationUtil {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    /**
     * Validate if string is not null or empty
     * @param value String to validate
     * @param fieldName Field name for error message
     * @throws ValidationException if validation fails
     */
    public static void validateNotEmpty(String value, String fieldName) throws ValidationException {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(fieldName, "cannot be empty");
        }
    }
    
    /**
     * Validate email format
     * @param email Email to validate
     * @throws ValidationException if email is invalid
     */
    public static void validateEmail(String email) throws ValidationException {
        if (email != null && !email.trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new ValidationException("email", "invalid email format");
            }
        }
    }
    
    /**
     * Validate password strength
     * @param password Password to validate
     * @throws ValidationException if password is weak
     */
    public static void validatePassword(String password) throws ValidationException {
        validateNotEmpty(password, "password");
        if (password.length() < 6) {
            throw new ValidationException("password", "must be at least 6 characters");
        }
    }
    
    /**
     * Validate positive number
     * @param value Value to validate
     * @param fieldName Field name for error message
     * @throws ValidationException if value is not positive
     */
    public static void validatePositive(double value, String fieldName) throws ValidationException {
        if (value <= 0) {
            throw new ValidationException(fieldName, "must be positive");
        }
    }
    
    /**
     * Validate username format
     * @param username Username to validate
     * @throws ValidationException if username is invalid
     */
    public static void validateUsername(String username) throws ValidationException {
        validateNotEmpty(username, "username");
        if (username.length() < 3) {
            throw new ValidationException("username", "must be at least 3 characters");
        }
        if (username.length() > 50) {
            throw new ValidationException("username", "must not exceed 50 characters");
        }
        if (!username.matches("^[a-zA-Z0-9_]+$")) {
            throw new ValidationException("username", "can only contain letters, numbers, and underscores");
        }
    }
}
