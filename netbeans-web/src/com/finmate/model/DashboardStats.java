package com.finmate.model;

/**
 * Dashboard Statistics DTO (Data Transfer Object)
 * Used for dashboard statistics response
 */
public class DashboardStats {
    private double totalIncome;
    private double totalExpense;
    private double totalBalance;
    private double monthlyIncome;
    private double monthlyExpense;
    private double totalSavings;
    
    public DashboardStats() {
    }
    
    public DashboardStats(double totalIncome, double totalExpense, double totalBalance,
                         double monthlyIncome, double monthlyExpense, double totalSavings) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.totalBalance = totalBalance;
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpense = monthlyExpense;
        this.totalSavings = totalSavings;
    }
    
    // Getters and Setters
    public double getTotalIncome() {
        return totalIncome;
    }
    
    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }
    
    public double getTotalExpense() {
        return totalExpense;
    }
    
    public void setTotalExpense(double totalExpense) {
        this.totalExpense = totalExpense;
    }
    
    public double getTotalBalance() {
        return totalBalance;
    }
    
    public void setTotalBalance(double totalBalance) {
        this.totalBalance = totalBalance;
    }
    
    public double getMonthlyIncome() {
        return monthlyIncome;
    }
    
    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    
    public double getMonthlyExpense() {
        return monthlyExpense;
    }
    
    public void setMonthlyExpense(double monthlyExpense) {
        this.monthlyExpense = monthlyExpense;
    }
    
    public double getTotalSavings() {
        return totalSavings;
    }
    
    public void setTotalSavings(double totalSavings) {
        this.totalSavings = totalSavings;
    }
}
