package com.finmate.servlet;

import com.finmate.dao.TransactionDAO;
import com.finmate.model.Transaction;
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
 * Transaction Servlet
 * Handles: CRUD operations for transactions
 * Demonstrates: MVC Controller, CRUD Operations
 */
@WebServlet(name = "TransactionServlet", urlPatterns = {"/api/transactions"})
public class TransactionServlet extends BaseServlet {
    
    private final TransactionDAO transactionDAO;
    
    public TransactionServlet() {
        this.transactionDAO = new TransactionDAO();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Check authentication
        if (!isAuthenticated(request)) {
            sendUnauthorized(response, "Please login first");
            return;
        }
        
        Integer userId = getUserIdFromSession(request);
        
        try {
            String idParam = request.getParameter("id");
            
            if (idParam != null) {
                // Get single transaction
                int id = Integer.parseInt(idParam);
                Transaction transaction = transactionDAO.findById(id);
                
                if (transaction == null || transaction.getUserId() != userId) {
                    sendNotFound(response, "Transaction not found");
                    return;
                }
                
                sendSuccess(response, "Transaction retrieved", transaction);
            } else {
                // Get all transactions for user
                List<Transaction> transactions = transactionDAO.findAll(userId);
                sendSuccess(response, "Transactions retrieved", transactions);
            }
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to retrieve transactions");
        } catch (NumberFormatException e) {
            sendBadRequest(response, "Invalid transaction ID");
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Check authentication
        if (!isAuthenticated(request)) {
            sendUnauthorized(response, "Please login first");
            return;
        }
        
        Integer userId = getUserIdFromSession(request);
        
        try {
            // Parse JSON
            JsonObject json = parseJsonRequest(request);
            
            String type = json.get("type").getAsString();
            String category = json.get("category").getAsString();
            double amount = json.get("amount").getAsDouble();
            String description = json.has("description") ? json.get("description").getAsString() : "";
            String transactionDateStr = json.get("transactionDate").getAsString();
            
            // Validate
            if (!type.equals("income") && !type.equals("expense")) {
                sendBadRequest(response, "Type must be 'income' or 'expense'");
                return;
            }
            
            if (amount <= 0) {
                sendBadRequest(response, "Amount must be positive");
                return;
            }
            
            // Create transaction
            Date transactionDate = Date.valueOf(transactionDateStr);
            Transaction transaction = new Transaction(userId, type, category, amount, description, transactionDate);
            
            Transaction created = transactionDAO.create(transaction);
            
            sendSuccess(response, "Transaction created successfully", created);
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to create transaction");
        } catch (Exception e) {
            sendBadRequest(response, "Invalid request: " + e.getMessage());
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Check authentication
        if (!isAuthenticated(request)) {
            sendUnauthorized(response, "Please login first");
            return;
        }
        
        Integer userId = getUserIdFromSession(request);
        
        try {
            String idParam = request.getParameter("id");
            
            if (idParam == null) {
                sendBadRequest(response, "Transaction ID required");
                return;
            }
            
            int id = Integer.parseInt(idParam);
            
            // Check ownership
            Transaction transaction = transactionDAO.findById(id);
            if (transaction == null || transaction.getUserId() != userId) {
                sendNotFound(response, "Transaction not found");
                return;
            }
            
            // Delete
            boolean deleted = transactionDAO.delete(id);
            
            if (deleted) {
                sendSuccess(response, "Transaction deleted successfully");
            } else {
                sendNotFound(response, "Transaction not found");
            }
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to delete transaction");
        } catch (NumberFormatException e) {
            sendBadRequest(response, "Invalid transaction ID");
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
