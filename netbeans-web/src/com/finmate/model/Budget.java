package com.finmate.model;

import java.sql.Timestamp;

/**
 * Budget Model Class
 * Represents a budget limit per category
 */
public class Budget {
    private int id;
    private int userId;
    private String category;
    private double budgetLimit;
    private double spent;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    // Constructors
    public Budget() {
    }
    
    public Budget(int userId, String category, double budgetLimit) {
        this.userId = userId;
        this.category = category;
        this.budgetLimit = budgetLimit;
        this.spent = 0;
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getUserId() {
        return userId;
    }
    
    public void setUserId(int userId) {
        this.userId = userId;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public double getBudgetLimit() {
        return budgetLimit;
    }
    
    public void setBudgetLimit(double budgetLimit) {
        this.budgetLimit = budgetLimit;
    }
    
    public double getSpent() {
        return spent;
    }
    
    public void setSpent(double spent) {
        this.spent = spent;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    public Timestamp getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Business methods
    public double getPercentage() {
        if (budgetLimit == 0) return 0;
        return (spent / budgetLimit) * 100;
    }
    
    public boolean isOverBudget() {
        return spent > budgetLimit;
    }
    
    public boolean isWarning() {
        return getPercentage() >= 80 && !isOverBudget();
    }
    
    @Override
    public String toString() {
        return "Budget{" +
                "id=" + id +
                ", userId=" + userId +
                ", category='" + category + '\'' +
                ", budgetLimit=" + budgetLimit +
                ", spent=" + spent +
                ", percentage=" + String.format("%.1f", getPercentage()) + "%" +
                '}';
    }
}
