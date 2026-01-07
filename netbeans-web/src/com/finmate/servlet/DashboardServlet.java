package com.finmate.servlet;

import com.finmate.dao.*;
import com.finmate.model.*;
import com.finmate.exception.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Dashboard Servlet - Statistics and aggregated data
 */
@WebServlet(name = "DashboardServlet", urlPatterns = {"/api/dashboard"})
public class DashboardServlet extends BaseServlet {
    
    private final TransactionDAO transactionDAO;
    private final SavingsDAO savingsDAO;
    
    public DashboardServlet() {
        this.transactionDAO = new TransactionDAO();
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
            // Calculate statistics
            List<Transaction> allTransactions = transactionDAO.findAll(userId);
            
            double totalIncome = 0;
            double totalExpense = 0;
            
            for (Transaction t : allTransactions) {
                if ("income".equals(t.getType())) {
                    totalIncome += t.getAmount();
                } else {
                    totalExpense += t.getAmount();
                }
            }
            
            double totalBalance = totalIncome - totalExpense;
            double totalSavings = savingsDAO.getTotalSavings(userId);
            
            // Get recent transactions
            List<Transaction> recentTransactions = transactionDAO.findRecent(userId, 5);
            
            // Create response object
            DashboardStats stats = new DashboardStats();
            stats.setTotalIncome(totalIncome);
            stats.setTotalExpense(totalExpense);
            stats.setTotalBalance(totalBalance);
            stats.setTotalSavings(totalSavings);
            stats.setMonthlyIncome(0); // TODO: Calculate current month
            stats.setMonthlyExpense(0); // TODO: Calculate current month
            
            // Build response
            java.util.Map<String, Object> dashboardData = new java.util.HashMap<>();
            dashboardData.put("stats", stats);
            dashboardData.put("recentTransactions", recentTransactions);
            
            sendSuccess(response, "Dashboard data retrieved", dashboardData);
            
        } catch (DatabaseException e) {
            sendInternalError(response, "Failed to retrieve dashboard data");
        }
    }
}
