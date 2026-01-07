package com.finmate.exception;

/**
 * Exception untuk database-related errors
 * Extends FinMateException - demonstrasi Inheritance
 */
public class DatabaseException extends FinMateException {
    
    public DatabaseException(String message) {
        super("DB_ERROR", message);
    }
    
    public DatabaseException(String message, Throwable cause) {
        super("DB_ERROR", message, cause);
    }
}
