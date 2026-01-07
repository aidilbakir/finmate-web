package com.finmate.servlet;

import com.finmate.dao.SavingsDAO;
import com.finmate.model.SavingsGoal;
import com.finmate.exception.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Date;
import java.util.List;

/**
 * Savings Servlet - CRUD operations + add money
 */
@WebServlet(name = "SavingsServlet", urlPatterns = {"/api/savings"})
public class SavingsServlet extends BaseServlet {
    
    private final SavingsDAO savingsDAO;
    
    public SavingsServlet() {
        this.savingsDAO = new SavingsDAO();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        if (!isAuthenticated(request)) {
            sendUnauthorized(response, "Please login first");
            return;
        }
        
        Integer userId = getUserIdFromSession(request);
        
        try {
            String action = request.getParameter("action");
            
            if ("total".equals(action)) {
                double total = savingsDAO.getTotalSavings(userId);
                sendSuccess(response, "Total savings retrieved", total);
            } else {
                List<SavingsGoal> goals = savingsDAO.findAll(userId);
                sendSuccess(response, "Savings goals retrieved", goals);
            }
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to retrieve savings goals");
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        if (!isAuthenticated(request)) {
            sendUnauthorized(response, "Please login first");
            return;
        }
        
        Integer userId = getUserIdFromSession(request);
        String action = request.getParameter("action");
        
        try {
            JsonObject json = parseJsonRequest(request);
            
            if ("add_money".equals(action)) {
                // Add money to existing goal
                int goalId = json.get("goalId").getAsInt();
                double amount = json.get("amount").getAsDouble();
                
                if (amount <= 0) {
                    sendBadRequest(response, "Amount must be positive");
                    return;
                }
                
                // Verify goal ownership
                SavingsGoal goal = savingsDAO.findById(goalId);
                if (goal == null || goal.getUserId() != userId) {
                    sendNotFound(response, "Savings goal not found");
                    return;
                }
                
                savingsDAO.addToSavings(userId, goalId, amount);
                SavingsGoal updated = savingsDAO.findById(goalId);
                
                sendSuccess(response, "Money added to savings successfully", updated);
                
            } else {
                // Create new savings goal
                String name = json.get("name").getAsString();
                double targetAmount = json.get("targetAmount").getAsDouble();
                String deadlineStr = json.get("deadline").getAsString();
                
                if (targetAmount <= 0) {
                    sendBadRequest(response, "Target amount must be positive");
                    return;
                }
                
                Date deadline = Date.valueOf(deadlineStr);
                SavingsGoal goal = new SavingsGoal(userId, name, targetAmount, deadline);
                
                SavingsGoal created = savingsDAO.create(goal);
                sendSuccess(response, "Savings goal created successfully", created);
            }
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to process savings request");
        } catch (Exception e) {
            sendBadRequest(response, "Invalid request: " + e.getMessage());
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        if (!isAuthenticated(request)) {
            sendUnauthorized(response, "Please login first");
            return;
        }
        
        Integer userId = getUserIdFromSession(request);
        
        try {
            String idParam = request.getParameter("id");
            if (idParam == null) {
                sendBadRequest(response, "Savings goal ID required");
                return;
            }
            
            int id = Integer.parseInt(idParam);
            SavingsGoal goal = savingsDAO.findById(id);
            
            if (goal == null || goal.getUserId() != userId) {
                sendNotFound(response, "Savings goal not found");
                return;
            }
            
            boolean deleted = savingsDAO.delete(id);
            if (deleted) {
                sendSuccess(response, "Savings goal deleted successfully");
            } else {
                sendNotFound(response, "Savings goal not found");
            }
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to delete savings goal");
        } catch (NumberFormatException e) {
            sendBadRequest(response, "Invalid savings goal ID");
        }
    }
    
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
