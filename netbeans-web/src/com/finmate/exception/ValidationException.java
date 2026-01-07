package com.finmate.exception;

/**
 * Exception untuk validation errors
 * Extends FinMateException - demonstrasi Inheritance
 */
public class ValidationException extends FinMateException {
    
    public ValidationException(String message) {
        super("VALIDATION_ERROR", message);
    }
    
    public ValidationException(String field, String message) {
        super("VALIDATION_ERROR", field + ": " + message);
    }
}
