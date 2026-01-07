package com.finmate.exception;

/**
 * Base Exception class untuk semua custom exceptions di FinMate
 * Demonstrasi: Exception Handling & Inheritance
 */
public class FinMateException extends Exception {
    private String errorCode;
    
    public FinMateException(String message) {
        super(message);
    }
    
    public FinMateException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public FinMateException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public FinMateException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}
