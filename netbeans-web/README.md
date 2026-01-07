# 💰 FinMate - Java Web Application (NetBeans + Tomcat + MySQL)

## 📖 Deskripsi
FinMate versi **Java Web Application** menggunakan:
- **Apache NetBeans IDE** - Development environment
- **Apache Tomcat** - Web server/servlet container
- **Java Servlets + JSP** - Backend logic & view
- **MySQL** - Database
- **JDBC** - Database connectivity
- **HTML/CSS/JavaScript** - Frontend

## 🛠️ Teknologi Stack
```
Frontend:  HTML5 + CSS3 + JavaScript + Bootstrap
Backend:   Java Servlets + JSP
Database:  MySQL 8.0+
Server:    Apache Tomcat 9.0+
IDE:       Apache NetBeans 12+
JDK:       Java 11 or higher
```

---

## 📋 Prasyarat

### 1. Install JDK (Java Development Kit)
- **Download:** https://www.oracle.com/java/technologies/downloads/
- **Version:** JDK 11 atau lebih tinggi
- **Verifikasi instalasi:**
  ```bash
  java -version
  javac -version
  ```

### 2. Install Apache NetBeans
- **Download:** https://netbeans.apache.org/download/
- **Version:** NetBeans 12 atau lebih tinggi
- **Include:** Java EE/Web bundle

### 3. Install Apache Tomcat
- **Download:** https://tomcat.apache.org/download-90.cgi
- **Version:** Tomcat 9.0
- **Extract to:** `C:\apache-tomcat-9.0.xx` (Windows) atau `/opt/tomcat` (Linux/Mac)

### 4. Install MySQL
- **Download:** https://dev.mysql.com/downloads/installer/
- **Version:** MySQL 8.0+
- **Setup:** 
  - Root password: (set your password)
  - Port: 3306 (default)

### 5. Install MySQL JDBC Driver
- **Download:** https://dev.mysql.com/downloads/connector/j/
- **File:** `mysql-connector-java-8.0.xx.jar`
- **Simpan untuk digunakan di project**

---

## 🚀 Step-by-Step Instalasi

### STEP 1: Setup MySQL Database

#### 1.1 Start MySQL Server
```bash
# Windows (MySQL Installer)
- Buka "MySQL 8.0 Command Line Client"
- Atau via Services: Start "MySQL80"

# Linux/Mac
sudo systemctl start mysql
# atau
sudo service mysql start
```

#### 1.2 Login ke MySQL
```bash
mysql -u root -p
# Enter password yang Anda set saat install
```

#### 1.3 Create Database
```sql
CREATE DATABASE finmate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finmate;
```

#### 1.4 Import Database Schema
```bash
# Exit dari MySQL prompt terlebih dahulu
exit;

# Import SQL file (pastikan path benar)
mysql -u root -p finmate < C:\path\to\finmate.sql
```

**Atau via MySQL Workbench:**
1. Buka MySQL Workbench
2. Connect ke local MySQL server
3. Klik "Server" → "Data Import"
4. Pilih "Import from Self-Contained File"
5. Browse ke `finmate.sql`
6. Target Schema: finmate
7. Klik "Start Import"

#### 1.5 Verify Database
```sql
USE finmate;
SHOW TABLES;
-- Harus muncul: users, transactions, budgets, savings_goals

SELECT * FROM users;
-- Harus ada demo user
```

### STEP 2: Setup Apache Tomcat di NetBeans

#### 2.1 Buka NetBeans
1. Launch Apache NetBeans IDE

#### 2.2 Add Tomcat Server
1. **Menu:** Tools → Servers
2. **Klik:** "Add Server"
3. **Choose Server:**
   - Server: Apache Tomcat or TomEE
   - Klik "Next"
4. **Server Location:**
   - Browse ke folder Tomcat: `C:\apache-tomcat-9.0.xx`
   - Klik "Next"
5. **Administrator Login:**
   - Username: admin
   - Password: admin
   - Klik "Finish"

#### 2.3 Verify Tomcat
1. Di tab "Services" (Ctrl+5)
2. Expand "Servers"
3. Right-click "Apache Tomcat"
4. Pilih "Start"
5. Buka browser: `http://localhost:8080`
6. Harus muncul Tomcat welcome page

### STEP 3: Create Java Web Project di NetBeans

#### 3.1 Create New Project
1. **Menu:** File → New Project
2. **Categories:** Java Web → Web Application
3. **Klik:** Next

#### 3.2 Project Settings
1. **Project Name:** FinMate
2. **Project Location:** Browse ke folder yang Anda inginkan
3. **Use Dedicated Folder:** ✓ (checked)
4. **Klik:** Next

#### 3.3 Server Settings
1. **Server:** Apache Tomcat (yang sudah di-add)
2. **Java EE Version:** Java EE 7 Web atau Java EE 8 Web
3. **Context Path:** /FinMate
4. **Klik:** Next

#### 3.4 Framework (Optional)
1. **Skip frameworks** (kita pakai plain Servlets+JSP)
2. **Klik:** Finish

### STEP 4: Add MySQL JDBC Driver

#### 4.1 Copy JAR File
1. Copy file `mysql-connector-java-8.0.xx.jar`
2. Paste ke folder: `FinMate/web/WEB-INF/lib/`

#### 4.2 Add Library di NetBeans
1. Di Project Explorer, expand **FinMate**
2. Right-click **Libraries**
3. Pilih **Add JAR/Folder**
4. Browse ke `mysql-connector-java-8.0.xx.jar`
5. Klik **Open**

### STEP 5: Create Project Structure

#### 5.1 Package Structure
```
FinMate/
├── src/
│   └── java/
│       └── com/
│           └── finmate/
│               ├── config/
│               │   └── DatabaseConfig.java
│               ├── dao/
│               │   ├── UserDAO.java
│               │   ├── TransactionDAO.java
│               │   ├── BudgetDAO.java
│               │   └── SavingsDAO.java
│               ├── model/
│               │   ├── User.java
│               │   ├── Transaction.java
│               │   ├── Budget.java
│               │   └── SavingsGoal.java
│               ├── servlet/
│               │   ├── AuthServlet.java
│               │   ├── TransactionServlet.java
│               │   ├── BudgetServlet.java
│               │   ├── SavingsServlet.java
│               │   └── DashboardServlet.java
│               └── util/
│                   └── JsonUtil.java
└── web/
    ├── WEB-INF/
    │   ├── lib/
    │   │   └── mysql-connector-java-8.0.xx.jar
    │   └── web.xml
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    └── index.jsp
```

#### 5.2 Create Packages di NetBeans
1. Right-click **Source Packages**
2. New → Java Package
3. Package Name: `com.finmate.config`
4. Ulangi untuk: dao, model, servlet, util

### STEP 6: Copy Source Files

#### 6.1 Copy Java Files
Dari folder `/netbeans-web/src/` yang akan saya buat, copy semua file .java ke package yang sesuai di NetBeans project.

#### 6.2 Copy Web Files
1. Copy `index.jsp`, `dashboard.jsp` ke folder `web/`
2. Copy `style.css` ke folder `web/css/`
3. Copy `app.js` ke folder `web/js/`

#### 6.3 Configure web.xml
File `web.xml` sudah auto-generated, akan di-update dengan servlet mappings.

### STEP 7: Configure Database Connection

#### 7.1 Edit DatabaseConfig.java
```java
private static final String URL = "jdbc:mysql://localhost:3306/finmate";
private static final String USER = "root";
private static final String PASSWORD = "your_mysql_password"; // UBAH INI!
```

**⚠️ PENTING:** Ganti `your_mysql_password` dengan password MySQL Anda!

### STEP 8: Build Project

#### 8.1 Clean and Build
1. Right-click **FinMate** project
2. Pilih **Clean and Build**
3. Tunggu sampai selesai
4. Cek Output window untuk errors

#### 8.2 Resolve Errors (jika ada)
- Missing imports: Alt+Enter untuk auto-import
- Compilation errors: Check syntax
- Library errors: Verify JDBC driver di-add dengan benar

### STEP 9: Deploy dan Run

#### 9.1 Run Project
1. Right-click **FinMate** project
2. Pilih **Run**
3. NetBeans akan:
   - Start Tomcat (jika belum running)
   - Deploy aplikasi
   - Buka browser

#### 9.2 Verify Deployment
Browser akan auto-open ke:
```
http://localhost:8080/FinMate/
```

Jika tidak auto-open, buka manual URL tersebut.

### STEP 10: Test Aplikasi

#### 10.1 Test Login (Demo Account)
```
Username: demo
Password: demo123
```

#### 10.2 Test Register
1. Klik "Register"
2. Isi form:
   - Nama: Test User
   - Username: testuser
   - Password: test123
3. Submit → harus berhasil
4. Login dengan akun baru

#### 10.3 Test Features
1. ✅ Dashboard loading
2. ✅ Add transaction
3. ✅ Add budget
4. ✅ Create savings goal
5. ✅ Add to savings
6. ✅ Delete operations
7. ✅ Logout

---

## 🔧 Troubleshooting

### Problem 1: Database Connection Failed
**Error:** `Communications link failure`

**Solution:**
```
1. Check MySQL is running:
   - Windows: Services → MySQL80 → Status "Running"
   - Linux: sudo systemctl status mysql

2. Verify credentials di DatabaseConfig.java:
   - URL: jdbc:mysql://localhost:3306/finmate
   - USER: root
   - PASSWORD: (your password)

3. Test connection:
   mysql -u root -p
   USE finmate;
```

### Problem 2: ClassNotFoundException: com.mysql.cj.jdbc.Driver
**Error:** JDBC driver not found

**Solution:**
```
1. Verify mysql-connector-java-8.0.xx.jar di folder:
   FinMate/web/WEB-INF/lib/

2. Di NetBeans:
   - Libraries → Add JAR/Folder → pilih JDBC jar

3. Clean and Build ulang project
```

### Problem 3: HTTP 404 - Not Found
**Error:** Page not found saat akses URL

**Solution:**
```
1. Check URL benar:
   http://localhost:8080/FinMate/
   (perhatikan huruf besar/kecil)

2. Check deployment:
   - NetBeans → Services → Servers → Apache Tomcat
   - Expand → harus ada "FinMate"

3. Redeploy:
   - Right-click project → Clean and Build
   - Right-click project → Run
```

### Problem 4: HTTP 500 - Internal Server Error
**Error:** Server error

**Solution:**
```
1. Check Tomcat logs:
   - NetBeans → Output → tab "Apache Tomcat"
   - Baca error message

2. Common issues:
   - NullPointerException: check database connection
   - SQLException: check SQL queries
   - ClassCastException: check data types

3. Debug:
   - Set breakpoints di servlet
   - Run → Debug Project (Ctrl+F5)
```

### Problem 5: Session Expired Terus
**Error:** User logout otomatis

**Solution:**
```
1. Check session timeout di web.xml:
   <session-config>
       <session-timeout>30</session-timeout>
   </session-config>

2. Increase timeout jika perlu (dalam menit)

3. Clear browser cookies
```

### Problem 6: Tomcat Start Failed
**Error:** Port already in use

**Solution:**
```
1. Check port 8080 dipakai aplikasi lain:
   netstat -ano | findstr :8080

2. Kill process atau change Tomcat port:
   - Edit: apache-tomcat/conf/server.xml
   - Find: <Connector port="8080"
   - Change to: <Connector port="8081"

3. Update URL jadi: http://localhost:8081/FinMate/
```

---

## 🎯 Project Structure Explanation

### Java Packages

#### 1. com.finmate.config
```java
DatabaseConfig.java
- Database connection management
- Connection pooling (optional)
- Database credentials
```

#### 2. com.finmate.model
```java
User.java         - User entity (id, username, password, name, email)
Transaction.java  - Transaction entity (id, type, category, amount, etc)
Budget.java       - Budget entity (id, category, limit, spent)
SavingsGoal.java  - Savings goal entity (id, name, target, current, deadline)
```

#### 3. com.finmate.dao (Data Access Object)
```java
UserDAO.java        - User database operations (CRUD)
TransactionDAO.java - Transaction database operations
BudgetDAO.java      - Budget database operations
SavingsDAO.java     - Savings goal database operations

Methods:
- create()
- findById()
- findAll()
- update()
- delete()
```

#### 4. com.finmate.servlet
```java
AuthServlet.java        - Handle register, login, logout
TransactionServlet.java - Handle transaction CRUD
BudgetServlet.java      - Handle budget CRUD
SavingsServlet.java     - Handle savings CRUD + add money
DashboardServlet.java   - Get dashboard statistics

Servlet mapping di web.xml:
/auth          → AuthServlet
/transactions  → TransactionServlet
/budgets       → BudgetServlet
/savings       → SavingsServlet
/dashboard     → DashboardServlet
```

#### 5. com.finmate.util
```java
JsonUtil.java - JSON serialization/deserialization
- toJson(Object obj)
- fromJson(String json, Class<T> clazz)
```

### Web Files

#### 1. index.jsp
```jsp
- Login/Register page
- Form handling
- Redirect to dashboard after login
```

#### 2. dashboard.jsp
```jsp
- Main application page
- Tabs: Dashboard, Transactions, Budgets, Savings
- AJAX calls to servlets
- Dynamic content rendering
```

#### 3. web.xml
```xml
- Servlet mappings
- Session config
- Welcome files
- Error pages
```

---

## 📊 Servlet Workflow

### Request Flow
```
Browser → HTTP Request
    ↓
Tomcat Server
    ↓
web.xml (URL mapping)
    ↓
Servlet (doGet/doPost)
    ↓
DAO (Database operations)
    ↓
MySQL Database
    ↓
DAO (Return data)
    ↓
Servlet (Process & JSON response)
    ↓
HTTP Response → Browser
    ↓
JavaScript (Update UI)
```

### Example: Add Transaction
```
1. User submit form (frontend)
   ↓
2. AJAX POST /FinMate/transactions
   ↓
3. TransactionServlet.doPost()
   ↓
4. Parse JSON data
   ↓
5. Validate data
   ↓
6. TransactionDAO.create(transaction)
   ↓
7. SQL: INSERT INTO transactions...
   ↓
8. Trigger: update_budget_spent (MySQL)
   ↓
9. Return transaction object
   ↓
10. Servlet response JSON
   ↓
11. Frontend update UI
```

---

## 🔐 Security Features

### 1. Password Hashing
```java
// Register
String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

// Login
boolean valid = BCrypt.checkpw(password, hashedPassword);
```

### 2. SQL Injection Prevention
```java
// Use PreparedStatement
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, username);
ResultSet rs = stmt.executeQuery();
```

### 3. Session Management
```java
// Set session
HttpSession session = request.getSession();
session.setAttribute("userId", user.getId());

// Check session
Integer userId = (Integer) session.getAttribute("userId");
if (userId == null) {
    response.sendError(401, "Unauthorized");
}

// Logout
session.invalidate();
```

### 4. XSS Prevention
```jsp
<!-- Use JSTL c:out to escape HTML -->
<c:out value="${user.name}" />

<!-- Or escapeXml attribute -->
${fn:escapeXml(user.name)}
```

---

## 📚 Additional Libraries (Optional)

### 1. JSON Processing (Gson)
```xml
<!-- Add to pom.xml if using Maven -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.9</version>
</dependency>
```

**Or download JAR:**
- https://github.com/google/gson
- Add to `WEB-INF/lib/`

### 2. Password Hashing (BCrypt)
```
Download: jbcrypt-0.4.jar
From: https://www.mindrot.org/projects/jBCrypt/
Add to: WEB-INF/lib/
```

### 3. JSTL (JSP Standard Tag Library)
```
Download: jstl-1.2.jar
From: https://tomcat.apache.org/taglibs/
Add to: WEB-INF/lib/
```

---

## 🚦 Development Workflow

### Day-to-day Development
```
1. Start NetBeans
   ↓
2. Open FinMate project
   ↓
3. Make code changes
   ↓
4. Save (Ctrl+S)
   ↓
5. Build (F11)
   ↓
6. Run (F6)
   ↓
7. Test di browser
   ↓
8. Check logs di Output window
   ↓
9. Debug jika ada error (Ctrl+F5)
```

### Hot Deployment (Untuk testing cepat)
```
1. Make changes di JSP/CSS/JS
   ↓
2. Save file
   ↓
3. Refresh browser (F5)
   ↓
4. Changes langsung terlihat (no rebuild needed!)

Note: 
- Java files need rebuild
- JSP/CSS/JS langsung update
```

---

## 📦 Deployment ke Production

### Export WAR File
```
1. Right-click project
2. Clean and Build
3. WAR file created at:
   FinMate/dist/FinMate.war
```

### Deploy ke Tomcat Production
```
1. Copy FinMate.war ke:
   /tomcat/webapps/

2. Tomcat auto-deploy

3. Access via:
   http://your-domain.com:8080/FinMate/
```

### Configure Production Database
```
1. Edit DatabaseConfig.java:
   - Change localhost to production DB host
   - Change credentials
   
2. Rebuild project

3. Redeploy WAR
```

---

## 🎓 Learning Resources

### NetBeans Tutorials
- Official Docs: https://netbeans.apache.org/kb/
- Java Web: https://netbeans.apache.org/kb/docs/web/

### Servlet/JSP Tutorials
- Oracle: https://docs.oracle.com/javaee/7/tutorial/
- Servlet API: https://javaee.github.io/servlet-spec/

### MySQL JDBC
- JDBC Tutorial: https://dev.mysql.com/doc/connector-j/8.0/en/

---

## ✅ Quick Start Checklist

- [ ] JDK installed (java -version)
- [ ] NetBeans installed
- [ ] Tomcat installed
- [ ] MySQL installed & running
- [ ] Database created (finmate)
- [ ] SQL schema imported
- [ ] JDBC driver downloaded
- [ ] NetBeans project created
- [ ] Tomcat server added to NetBeans
- [ ] JDBC driver added to project
- [ ] Source files copied
- [ ] DatabaseConfig.java credentials updated
- [ ] Project built successfully
- [ ] Application running on http://localhost:8080/FinMate/
- [ ] Demo login works (demo/demo123)
- [ ] All features tested

---

## 🎉 Selamat!

Aplikasi FinMate Java Web sudah siap digunakan!

**Access URL:** `http://localhost:8080/FinMate/`

**Demo Login:**
- Username: `demo`
- Password: `demo123`

---

**Happy Coding!** 💻🚀

Untuk bantuan lebih lanjut, lihat:
- `STEP_BY_STEP.md` - Panduan detail
- `ARCHITECTURE.md` - Arsitektur aplikasi
- Source code comments - Penjelasan inline
