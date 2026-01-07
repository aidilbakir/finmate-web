package com.finmate.servlet;

import com.finmate.dao.BudgetDAO;
import com.finmate.model.Budget;
import com.finmate.exception.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

/**
 * Budget Servlet - CRUD operations for budgets
 */
@WebServlet(name = "BudgetServlet", urlPatterns = {"/api/budgets"})
public class BudgetServlet extends BaseServlet {
    
    private final BudgetDAO budgetDAO;
    
    public BudgetServlet() {
        this.budgetDAO = new BudgetDAO();
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
            List<Budget> budgets = budgetDAO.findAll(userId);
            sendSuccess(response, "Budgets retrieved", budgets);
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to retrieve budgets");
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
        
        try {
            JsonObject json = parseJsonRequest(request);
            
            String category = json.get("category").getAsString();
            double budgetLimit = json.get("budgetLimit").getAsDouble();
            
            if (budgetLimit <= 0) {
                sendBadRequest(response, "Budget limit must be positive");
                return;
            }
            
            Budget budget = new Budget(userId, category, budgetLimit);
            Budget created = budgetDAO.create(budget);
            
            sendSuccess(response, "Budget created successfully", created);
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to create budget");
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
                sendBadRequest(response, "Budget ID required");
                return;
            }
            
            int id = Integer.parseInt(idParam);
            Budget budget = budgetDAO.findById(id);
            
            if (budget == null || budget.getUserId() != userId) {
                sendNotFound(response, "Budget not found");
                return;
            }
            
            boolean deleted = budgetDAO.delete(id);
            if (deleted) {
                sendSuccess(response, "Budget deleted successfully");
            } else {
                sendNotFound(response, "Budget not found");
            }
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to delete budget");
        } catch (NumberFormatException e) {
            sendBadRequest(response, "Invalid budget ID");
        }
    }
    
    private JsonObject parseJsonRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return  JsonParser.parseString(sb.toString()).getAsJsonObject();
    }
}
