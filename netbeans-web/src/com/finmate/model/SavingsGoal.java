package com.finmate.model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * SavingsGoal Model Class
 * Represents a savings goal/target
 */
public class SavingsGoal {
    private int id;
    private int userId;
    private String name;
    private double targetAmount;
    private double currentAmount;
    private Date deadline;
    private boolean isCompleted;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    // Constructors
    public SavingsGoal() {
    }
    
    public SavingsGoal(int userId, String name, double targetAmount, Date deadline) {
        this.userId = userId;
        this.name = name;
        this.targetAmount = targetAmount;
        this.currentAmount = 0;
        this.deadline = deadline;
        this.isCompleted = false;
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
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public double getTargetAmount() {
        return targetAmount;
    }
    
    public void setTargetAmount(double targetAmount) {
        this.targetAmount = targetAmount;
    }
    
    public double getCurrentAmount() {
        return currentAmount;
    }
    
    public void setCurrentAmount(double currentAmount) {
        this.currentAmount = currentAmount;
    }
    
    public Date getDeadline() {
        return deadline;
    }
    
    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }
    
    public boolean isCompleted() {
        return isCompleted;
    }
    
    public void setCompleted(boolean completed) {
        isCompleted = completed;
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
    public double getProgress() {
        if (targetAmount == 0) return 0;
        return (currentAmount / targetAmount) * 100;
    }
    
    public double getRemainingAmount() {
        return Math.max(0, targetAmount - currentAmount);
    }
    
    @Override
    public String toString() {
        return "SavingsGoal{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", targetAmount=" + targetAmount +
                ", currentAmount=" + currentAmount +
                ", progress=" + String.format("%.1f", getProgress()) + "%" +
                ", deadline=" + deadline +
                ", isCompleted=" + isCompleted +
                '}';
    }
}
