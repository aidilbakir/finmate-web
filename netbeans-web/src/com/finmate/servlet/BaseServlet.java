package com.finmate.servlet;

import com.finmate.util.JsonUtil;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * Base Servlet Class
 * Demonstrates: Inheritance & Common HTTP Response Methods
 * All servlet controllers extend this class
 */
public abstract class BaseServlet extends HttpServlet {
    
    /**
     * Send JSON response
     * @param response HttpServletResponse
     * @param data Data to send
     * @throws IOException if writing fails
     */
    protected void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        out.print(JsonUtil.toJson(data));
        out.flush();
    }
    
    /**
     * Send success response
     * @param response HttpServletResponse
     * @param message Success message
     * @throws IOException if writing fails
     */
    protected void sendSuccess(HttpServletResponse response, String message) throws IOException {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", message);
        sendJsonResponse(response, result);
    }
    
    /**
     * Send success response dengan data
     * @param response HttpServletResponse
     * @param message Success message
     * @param data Data to send
     * @throws IOException if writing fails
     */
    protected void sendSuccess(HttpServletResponse response, String message, Object data) throws IOException {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", message);
        result.put("data", data);
        sendJsonResponse(response, result);
    }
    
    /**
     * Send error response
     * @param response HttpServletResponse
     * @param statusCode HTTP status code
     * @param errorMessage Error message
     * @throws IOException if writing fails
     */
    protected void sendError(HttpServletResponse response, int statusCode, String errorMessage) throws IOException {
        response.setStatus(statusCode);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("error", errorMessage);
        
        sendJsonResponse(response, result);
    }
    
    /**
     * Send 400 Bad Request
     */
    protected void sendBadRequest(HttpServletResponse response, String message) throws IOException {
        sendError(response, HttpServletResponse.SC_BAD_REQUEST, message);
    }
    
    /**
     * Send 401 Unauthorized
     */
    protected void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        sendError(response, HttpServletResponse.SC_UNAUTHORIZED, message);
    }
    
    /**
     * Send 404 Not Found
     */
    protected void sendNotFound(HttpServletResponse response, String message) throws IOException {
        sendError(response, HttpServletResponse.SC_NOT_FOUND, message);
    }
    
    /**
     * Send 500 Internal Server Error
     */
    protected void sendInternalError(HttpServletResponse response, String message) throws IOException {
        sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, message);
    }
    
    /**
     * Get user ID from session
     * @return User ID or null if not logged in
     */
    protected Integer getUserIdFromSession(javax.servlet.http.HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        return userId;
    }
    
    /**
     * Check if user is authenticated
     * @return true if authenticated
     */
    protected boolean isAuthenticated(javax.servlet.http.HttpServletRequest request) {
        return getUserIdFromSession(request) != null;
    }
}
