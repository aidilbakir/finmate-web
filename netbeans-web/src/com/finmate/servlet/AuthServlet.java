package com.finmate.servlet;

import com.finmate.service.UserService;
import com.finmate.model.User;
import com.finmate.exception.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;

/**
 * Authentication Servlet
 * Handles: register, login, logout, check session
 * Demonstrates: MVC Controller Pattern (Servlet = Controller in MVC)
 */
@WebServlet(name = "AuthServlet", urlPatterns = {"/api/auth"})
public class AuthServlet extends BaseServlet {
    
    private final UserService userService;
    
    public AuthServlet() {
        this.userService = new UserService();
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        
        if (action == null) {
            sendBadRequest(response, "Action parameter required");
            return;
        }
        
        switch (action) {
            case "register":
                handleRegister(request, response);
                break;
            case "login":
                handleLogin(request, response);
                break;
            default:
                sendBadRequest(response, "Invalid action");
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        
        if (action == null) {
            sendBadRequest(response, "Action parameter required");
            return;
        }
        
        switch (action) {
            case "logout":
                handleLogout(request, response);
                break;
            case "check":
                handleCheckSession(request, response);
                break;
            default:
                sendBadRequest(response, "Invalid action");
        }
    }
    
    /**
     * Handle user registration
     */
    private void handleRegister(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // Parse JSON request body
            JsonObject json = parseJsonRequest(request);
            
            String username = json.get("username").getAsString();
            String password = json.get("password").getAsString();
            String name = json.get("name").getAsString();
            String email = json.has("email") ? json.get("email").getAsString() : null;
            
            // Register user
            User user = userService.register(username, password, name, email);
            
            // Auto-login after registration
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            
            sendSuccess(response, "User registered successfully", user);
            
        } catch (ValidationException e) {
            sendBadRequest(response, e.getMessage());
        } catch (AuthenticationException e) {
            sendError(response, HttpServletResponse.SC_CONFLICT, e.getMessage());
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to register user");
        } catch (Exception e) {
            sendBadRequest(response, "Invalid request format");
        }
    }
    
    /**
     * Handle user login
     */
    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // Parse JSON request body
            JsonObject json = parseJsonRequest(request);
            
            String username = json.get("username").getAsString();
            String password = json.get("password").getAsString();
            
            // Authenticate user
            User user = userService.authenticate(username, password);
            
            // Create session
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            
            sendSuccess(response, "Login successful", user);
            
        } catch (AuthenticationException e) {
            sendUnauthorized(response, e.getMessage());
        } catch (DatabaseException e) {
            sendInternalError(response, "Authentication failed");
        } catch (Exception e) {
            sendBadRequest(response, "Invalid request format");
        }
    }
    
    /**
     * Handle user logout
     */
    private void handleLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        sendSuccess(response, "Logout successful");
    }
    
    /**
     * Check if session is valid
     */
    private void handleCheckSession(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        if (isAuthenticated(request)) {
            Integer userId = getUserIdFromSession(request);
            String username = (String) request.getSession().getAttribute("username");
            
            User user = new User();
            user.setId(userId);
            user.setUsername(username);
            
            sendSuccess(response, "Session valid", user);
        } else {
            sendUnauthorized(response, "Not authenticated");
        }
    }
    
    /**
     * Helper method to parse JSON from request body
     */
    private JsonObject parseJsonRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return JsonParser.parseString(sb.toString()).getAsJsonObject();
    }
}
