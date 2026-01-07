# 📊 Database Setup Guide

## Quick Import

### Method 1: Via Command Line (Recommended)

```powershell
# Navigate to project
cd "c:\File\Projects\Joki\Finmate Financial Website"

# Import SQL file
mysql -u root -p < database\finmate.sql

# Enter password ketika diminta
```

### Method 2: Via MySQL Workbench

1. Open MySQL Workbench
2. Connect to localhost
3. File → Run SQL Script
4. Browse: `database/finmate.sql`
5. Run

### Method 3: Via phpMyAdmin (XAMPP)

1. Buka: http://localhost/phpmyadmin
2. Click tab "Import"
3. Choose file: `database/finmate.sql`
4. Click "Go"

---

## What's Included

### ✅ Tables (4):
- `users` - User accounts
- `transactions` - Income & expense records
- `budgets` - Budget limits per category
- `savings_goals` - Savings targets

### ✅ Stored Procedures (2):
- `update_budget_spent` - Auto-calculate spent from transactions
- `add_to_savings` - Add money to savings goal with transaction

### ✅ Triggers (3):
- Auto-update budget when transaction added
- Auto-update budget when transaction modified
- Auto-update budget when transaction deleted

### ✅ Views (1):
- `dashboard_stats` - Aggregated financial statistics

### ✅ Sample Data:
- **Demo user**: username `demo` / password `demo123`
- 15+ sample transactions (income & expense)
- 7 budget categories
- 4 savings goals

---

## Verify Installation

```sql
-- Login to MySQL
mysql -u root -p

-- Switch to database
USE finmate;

-- Check tables
SHOW TABLES;

-- Check demo user
SELECT * FROM users WHERE username='demo';

-- Check transactions
SELECT type, COUNT(*), SUM(amount) 
FROM transactions 
WHERE user_id = 1 
GROUP BY type;

-- Check budgets
SELECT category, budget_limit, spent 
FROM budgets 
WHERE user_id = 1;
```

---

## Demo Account

After import, you can login with:

**Username**: `demo`  
**Password**: `demo123`

This account has sample data including:
- 15+ transactions
- 7 budgets
- 4 savings goals

---

## Troubleshooting

### Error: "Database exists"
```sql
-- Drop existing database first
DROP DATABASE IF EXISTS finmate;
-- Then re-import
```

### Error: "Access denied"
```powershell
# Check MySQL password in .env file
# Make sure DB_PASSWORD matches your MySQL root password
```

### Connection test
```powershell
# Test MySQL connection
mysql -u root -p -e "SELECT 'Connection OK' AS Status;"
```

---

## After Import

Update your `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finmate
DB_USER=root
DB_PASSWORD=your_mysql_password  # ← Make sure this matches!
```

---

**Ready to test the application! 🚀**
