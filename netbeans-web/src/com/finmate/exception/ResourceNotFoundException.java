package com.finmate.exception;

/**
 * Exception ketika resource tidak ditemukan (404)
 * Extends FinMateException - demonstrasi Inheritance
 */
public class ResourceNotFoundException extends FinMateException {
    
    public ResourceNotFoundException(String resourceType, Object id) {
        super("NOT_FOUND", resourceType + " with id " + id + " not found");
    }
    
    public ResourceNotFoundException(String message) {
        super("NOT_FOUND", message);
    }
}
