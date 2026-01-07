-- FinMate Database Schema
-- MySQL Database for Financial Management System
-- Created: 2026-01-06

-- Drop database if exists (optional - uncomment if you want fresh install)
-- DROP DATABASE IF EXISTS finmate;

-- Create database with explicit collation
CREATE DATABASE IF NOT EXISTS finmate 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

USE finmate;

-- Set database collation explicitly
ALTER DATABASE finmate CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- =====================================================
-- TABLE STRUCTURES
-- =====================================================

-- Users Table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed password',
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Transactions Table
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Budgets Table
DROP TABLE IF EXISTS budgets;
CREATE TABLE budgets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget_limit DECIMAL(15, 2) NOT NULL,
    spent DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Savings Goals Table
DROP TABLE IF EXISTS savings_goals;
CREATE TABLE savings_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    deadline DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_completed (is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Drop existing procedures if any
DROP PROCEDURE IF EXISTS update_budget_spent;
DROP PROCEDURE IF EXISTS add_to_savings;

-- Procedure: Update Budget Spent Amount
DELIMITER //
CREATE PROCEDURE update_budget_spent(
    IN p_user_id INT, 
    IN p_category VARCHAR(50)
)
BEGIN
    DECLARE v_total_spent DECIMAL(15,2);
    
    -- Calculate total spent for this category
    SELECT COALESCE(SUM(amount), 0) INTO v_total_spent
    FROM transactions 
    WHERE user_id = p_user_id 
      AND category = p_category 
      AND type = 'expense';
    
    -- Update budget
    UPDATE budgets 
    SET spent = v_total_spent,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id 
      AND category = p_category;
      
    -- Create budget if not exists
    INSERT INTO budgets (user_id, category, budget_limit, spent)
    SELECT p_user_id, p_category, 0, v_total_spent
    WHERE NOT EXISTS (
        SELECT 1 FROM budgets 
        WHERE user_id = p_user_id AND category = p_category
    );
END //
DELIMITER ;

-- Procedure: Add Money to Savings Goal
DELIMITER //
CREATE PROCEDURE add_to_savings(
    IN p_user_id INT, 
    IN p_goal_id INT, 
    IN p_amount DECIMAL(15,2)
)
BEGIN
    DECLARE v_current_amount DECIMAL(15,2);
    DECLARE v_target_amount DECIMAL(15,2);
    DECLARE v_goal_name VARCHAR(100);
    
    -- Verify goal belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM savings_goals 
        WHERE id = p_goal_id AND user_id = p_user_id
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Savings goal not found or unauthorized';
    END IF;
    
    -- Get goal details
    SELECT name, current_amount, target_amount 
    INTO v_goal_name, v_current_amount, v_target_amount
    FROM savings_goals 
    WHERE id = p_goal_id;
    
    -- Add transaction record
    INSERT INTO transactions (user_id, type, category, amount, description, transaction_date)
    VALUES (p_user_id, 'income', 'savings', p_amount, 
            CONCAT('Added to savings: ', v_goal_name), CURDATE());
    
    -- Update savings goal amount
    UPDATE savings_goals 
    SET current_amount = current_amount + p_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_goal_id;
    
    -- Check if goal is now completed
    SET v_current_amount = v_current_amount + p_amount;
    IF v_current_amount >= v_target_amount THEN
        UPDATE savings_goals 
        SET is_completed = TRUE 
        WHERE id = p_goal_id;
    END IF;
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS after_transaction_insert;
DROP TRIGGER IF EXISTS after_transaction_update;
DROP TRIGGER IF EXISTS after_transaction_delete;

-- Trigger: After Insert Transaction
DELIMITER //
CREATE TRIGGER after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    -- Update budget if expense
    IF NEW.type = 'expense' THEN
        CALL update_budget_spent(NEW.user_id, NEW.category);
    END IF;
END //
DELIMITER ;

-- Trigger: After Update Transaction
DELIMITER //
CREATE TRIGGER after_transaction_update
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    -- Update old category budget if changed
    IF OLD.type = 'expense' AND (OLD.category != NEW.category OR OLD.amount != NEW.amount) THEN
        CALL update_budget_spent(OLD.user_id, OLD.category);
    END IF;
    
    -- Update new category budget
    IF NEW.type = 'expense' THEN
        CALL update_budget_spent(NEW.user_id, NEW.category);
    END IF;
END //
DELIMITER ;

-- Trigger: After Delete Transaction
DELIMITER //
CREATE TRIGGER after_transaction_delete
AFTER DELETE ON transactions
FOR EACH ROW
BEGIN
    -- Update budget if was expense
    IF OLD.type = 'expense' THEN
        CALL update_budget_spent(OLD.user_id, OLD.category);
    END IF;
END //
DELIMITER ;

-- =====================================================
-- VIEWS
-- =====================================================

-- Drop existing views if any
DROP VIEW IF EXISTS dashboard_stats;

-- View: Dashboard Statistics
CREATE VIEW dashboard_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS balance,
    COALESCE(SUM(CASE WHEN t.type = 'income' AND YEAR(t.transaction_date) = YEAR(CURDATE()) AND MONTH(t.transaction_date) = MONTH(CURDATE()) THEN t.amount ELSE 0 END), 0) AS monthly_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' AND YEAR(t.transaction_date) = YEAR(CURDATE()) AND MONTH(t.transaction_date) = MONTH(CURDATE()) THEN t.amount ELSE 0 END), 0) AS monthly_expense
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.username;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert Demo User
-- Password: demo123 (BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)
INSERT INTO users (username, password, name, email) VALUES 
('demo', '$2a$10$gcf4Z10KKc9nhzx4X5BVvuKnOwzwA6TfSQuGIb/hMsGc3Y9bBgap6', 'Demo User', 'demo@finmate.com'),
('student', '$2a$10$gcf4Z10KKc9nhzx4X5BVvuKnOwzwA6TfSQuGIb/hMsGc3Y9bBgap6', 'Student User', 'student@finmate.com');

-- Insert Sample Budgets for Demo User FIRST (before transactions to avoid trigger conflict)
-- Using INSERT IGNORE to skip if trigger already created them
INSERT IGNORE INTO budgets (user_id, category, budget_limit, spent) VALUES
(1, 'food', 1000000, 0),
(1, 'transport', 500000, 0),
(1, 'entertainment', 300000, 0),
(1, 'shopping', 700000, 0),
(1, 'bills', 400000, 0),
(1, 'education', 600000, 0),
(1, 'health', 200000, 0);

-- Insert Sample Transactions for Demo User
-- Note: Triggers will auto-update budget 'spent' amounts
INSERT INTO transactions (user_id, type, category, amount, description, transaction_date) VALUES
-- January 2025 Income
(1, 'income', 'salary', 5000000, 'Monthly Salary', '2025-01-01'),
(1, 'income', 'freelance', 1500000, 'Web Development Project', '2025-01-15'),
(1, 'income', 'other', 200000, 'Gift from Parents', '2025-01-10'),

-- January 2025 Expenses
(1, 'expense', 'food', 500000, 'Groceries - Indomaret', '2025-01-02'),
(1, 'expense', 'food', 350000, 'Restaurant & Cafe', '2025-01-05'),
(1, 'expense', 'transport', 200000, 'Motorcycle Gas', '2025-01-03'),
(1, 'expense', 'transport', 150000, 'Grab/Gojek', '2025-01-08'),
(1, 'expense', 'entertainment', 250000, 'Movie & Concert', '2025-01-06'),
(1, 'expense', 'shopping', 800000, 'Clothes & Accessories', '2025-01-12'),
(1, 'expense', 'bills', 300000, 'Internet & Phone Bill', '2025-01-01'),
(1, 'expense', 'education', 500000, 'Online Course', '2025-01-04'),
(1, 'expense', 'health', 150000, 'Vitamins', '2025-01-07'),

-- December 2024 (for history)
(1, 'income', 'salary', 5000000, 'Monthly Salary', '2024-12-01'),
(1, 'expense', 'food', 600000, 'December Groceries', '2024-12-15'),
(1, 'expense', 'entertainment', 400000, 'New Year Party', '2024-12-31');

-- Budgets already inserted above (before transactions)
-- Triggers have auto-calculated spent amounts

-- Insert Sample Savings Goals
INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, is_completed) VALUES
(1, 'Emergency Fund', 10000000, 2500000, '2025-12-31', FALSE),
(1, 'Vacation to Bali', 5000000, 800000, '2025-06-30', FALSE),
(1, 'New Laptop', 15000000, 5000000, '2025-08-31', FALSE),
(1, 'House Down Payment', 50000000, 3000000, '2026-12-31', FALSE);

-- =====================================================
-- DATA VERIFICATION QUERIES
-- =====================================================

-- Show all tables
SELECT 'Tables created:' AS Status;
SHOW TABLES;

-- Show demo user
SELECT 'Demo user created:' AS Status;
SELECT id, username, name, email, created_at FROM users WHERE username = 'demo';

-- Show transaction summary
SELECT 'Transaction summary:' AS Status;
SELECT 
    type, 
    COUNT(*) AS count, 
    SUM(amount) AS total 
FROM transactions 
WHERE user_id = 1 
GROUP BY type;

-- Show budgets with spent amounts
SELECT 'Budget overview:' AS Status;
SELECT 
    category, 
    budget_limit, 
    spent,
    ROUND((spent / budget_limit * 100), 2) AS percentage
FROM budgets 
WHERE user_id = 1;

-- Show savings goals
SELECT 'Savings goals:' AS Status;
SELECT 
    name, 
    target_amount, 
    current_amount,
    ROUND((current_amount / target_amount * 100), 2) AS progress,
    deadline,
    is_completed
FROM savings_goals 
WHERE user_id = 1;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

SELECT '✅ Database setup complete!' AS Status;
SELECT 'Demo account:' AS Info, 'username: demo' AS Detail1, 'password: demo123' AS Detail2;
