package com.finmate.exception;

/**
 * Exception untuk authentication/authorization errors
 * Extends FinMateException - demonstrasi Inheritance
 */
public class AuthenticationException extends FinMateException {
    
    public AuthenticationException(String message) {
        super("AUTH_ERROR", message);
    }
    
    public AuthenticationException(String message, Throwable cause) {
        super("AUTH_ERROR", message, cause);
    }
}
