# 🔄 Panduan Konversi: PHP (XAMPP) → Java (NetBeans + Tomcat)

## 📋 Daftar Isi
1. [Perbedaan Fundamental](#perbedaan-fundamental)
2. [Mapping Komponen](#mapping-komponen)
3. [Konversi Database Layer](#konversi-database-layer)
4. [Konversi Business Logic](#konversi-business-logic)
5. [Konversi Web Layer](#konversi-web-layer)
6. [Deployment Comparison](#deployment-comparison)

---

## 1. Perbedaan Fundamental

### PHP (XAMPP) vs Java (NetBeans + Tomcat)

| Aspek | PHP (XAMPP) | Java (NetBeans + Tomcat) |
|-------|-------------|--------------------------|
| **Language** | PHP (Scripting) | Java (Compiled) |
| **Execution** | Interpreted | Compiled to bytecode |
| **Web Server** | Apache HTTP Server | Apache Tomcat (Servlet Container) |
| **Database API** | PDO / MySQLi | JDBC |
| **Session** | $_SESSION | HttpSession |
| **Request/Response** | $_GET, $_POST | HttpServletRequest, HttpServletResponse |
| **Deployment** | Copy files | WAR file deployment |
| **Development** | Text editor / IDE | NetBeans IDE |
| **Type System** | Dynamic (loosely typed) | Static (strongly typed) |
| **OOP** | Optional | Mandatory |
| **Package System** | Namespaces | Packages (com.finmate.xxx) |
| **File Extension** | .php | .java, .jsp |

---

## 2. Mapping Komponen

### 2.1 Directory Structure

#### PHP (XAMPP):
```
xampp/htdocs/finmate/
├── api/
│   ├── auth.php
│   ├── transactions.php
│   ├── budgets.php
│   └── savings.php
├── config/
│   └── database.php
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── database/
    └── finmate.sql
```

#### Java (NetBeans):
```
FinMate/
├── src/java/
│   └── com/finmate/
│       ├── config/
│       │   └── DatabaseConfig.java
│       ├── dao/
│       │   ├── UserDAO.java
│       │   ├── TransactionDAO.java
│       │   ├── BudgetDAO.java
│       │   └── SavingsDAO.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Transaction.java
│       │   ├── Budget.java
│       │   └── SavingsGoal.java
│       ├── servlet/
│       │   ├── AuthServlet.java
│       │   ├── TransactionServlet.java
│       │   ├── BudgetServlet.java
│       │   └── SavingsServlet.java
│       └── util/
│           └── JsonUtil.java
└── web/
    ├── WEB-INF/
    │   ├── web.xml
    │   └── lib/
    │       └── mysql-connector-java.jar
    ├── css/style.css
    ├── js/app.js
    └── index.jsp
```

### 2.2 Component Mapping

| PHP Component | Java Component | Purpose |
|---------------|----------------|---------|
| `config/database.php` | `com.finmate.config.DatabaseConfig` | Database connection |
| `api/auth.php` | `com.finmate.servlet.AuthServlet` | Authentication endpoint |
| `api/transactions.php` | `com.finmate.servlet.TransactionServlet` | Transaction CRUD |
| *(inline in PHP)* | `com.finmate.model.User` | User entity |
| *(inline in PHP)* | `com.finmate.dao.UserDAO` | User database operations |
| `public/index.html` | `web/index.jsp` | Entry page |
| `.htaccess` | `web.xml` | Configuration |

---

## 3. Konversi Database Layer

### 3.1 Database Connection

#### PHP (database.php):
```php
<?php
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $dsn = "mysql:host=localhost;dbname=finmate;charset=utf8mb4";
        $this->connection = new PDO($dsn, "root", "");
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

function getDB() {
    return Database::getInstance()->getConnection();
}
?>
```

#### Java (DatabaseConfig.java):
```java
package com.finmate.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {
    private static final String URL = 
        "jdbc:mysql://localhost:3306/finmate?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "";
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    
    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
    
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
    
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**Key Differences:**
- PHP: PDO class, dynamic connection
- Java: JDBC DriverManager, static methods
- PHP: Exception handling optional
- Java: Exception handling mandatory (throws SQLException)
- PHP: Singleton pattern via instance
- Java: Static methods, no instance needed

### 3.2 Query Execution

#### PHP (User Query):
```php
<?php
// Get user by username
$stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode([
        'id' => $user['id'],
        'username' => $user['username'],
        'name' => $user['name']
    ]);
}
?>
```

#### Java (User Query):
```java
// UserDAO.java
public User findByUsername(String username) throws SQLException {
    String sql = "SELECT * FROM users WHERE username = ?";
    Connection conn = DatabaseConfig.getConnection();
    PreparedStatement stmt = conn.prepareStatement(sql);
    stmt.setString(1, username);
    ResultSet rs = stmt.executeQuery();
    
    User user = null;
    if (rs.next()) {
        user = new User();
        user.setId(rs.getInt("id"));
        user.setUsername(rs.getString("username"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
    }
    
    rs.close();
    stmt.close();
    DatabaseConfig.closeConnection(conn);
    
    return user;
}
```

**Key Differences:**
- PHP: Array/Object result
- Java: Object-oriented, model class
- PHP: fetch() returns associative array
- Java: ResultSet with getters (getInt, getString)
- PHP: Auto-close resources
- Java: Manual close (or try-with-resources)
- PHP: Flexible types
- Java: Strong typing

### 3.3 Insert Operation

#### PHP:
```php
<?php
// Insert transaction
$stmt = $db->prepare("
    INSERT INTO transactions 
    (user_id, type, category, amount, description, transaction_date) 
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $userId,
    $type,
    $category,
    $amount,
    $description,
    $date
]);

$transactionId = $db->lastInsertId();
?>
```

#### Java:
```java
// TransactionDAO.java
public int create(Transaction transaction) throws SQLException {
    String sql = "INSERT INTO transactions " +
                 "(user_id, type, category, amount, description, transaction_date) " +
                 "VALUES (?, ?, ?, ?, ?, ?)";
    
    Connection conn = DatabaseConfig.getConnection();
    PreparedStatement stmt = conn.prepareStatement(sql, 
                                Statement.RETURN_GENERATED_KEYS);
    
    stmt.setInt(1, transaction.getUserId());
    stmt.setString(2, transaction.getType());
    stmt.setString(3, transaction.getCategory());
    stmt.setDouble(4, transaction.getAmount());
    stmt.setString(5, transaction.getDescription());
    stmt.setDate(6, transaction.getTransactionDate());
    
    stmt.executeUpdate();
    
    ResultSet rs = stmt.getGeneratedKeys();
    int id = 0;
    if (rs.next()) {
        id = rs.getInt(1);
    }
    
    rs.close();
    stmt.close();
    DatabaseConfig.closeConnection(conn);
    
    return id;
}
```

**Key Differences:**
- PHP: lastInsertId() method
- Java: RETURN_GENERATED_KEYS flag
- PHP: Positional array parameters
- Java: Typed setters (setInt, setString, setDouble)
- PHP: Implicit type conversion
- Java: Explicit type specification

---

## 4. Konversi Business Logic

### 4.1 Authentication (Login)

#### PHP (auth.php):
```php
<?php
session_start();

if ($_GET['action'] === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];
    
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        echo json_encode([
            'success' => true,
            'message' => 'Login berhasil!',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'name' => $user['name']
            ]
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Username atau password salah'
        ]);
    }
}
?>
```

#### Java (AuthServlet.java):
```java
package com.finmate.servlet;

import com.finmate.dao.UserDAO;
import com.finmate.model.User;
import com.finmate.util.JsonUtil;
import com.google.gson.JsonObject;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {
    
    private UserDAO userDAO = new UserDAO();
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            String action = request.getParameter("action");
            
            if ("login".equals(action)) {
                // Read JSON from request body
                BufferedReader reader = request.getReader();
                JsonObject jsonRequest = JsonUtil.fromJson(reader, JsonObject.class);
                
                String username = jsonRequest.get("username").getAsString();
                String password = jsonRequest.get("password").getAsString();
                
                // Get user from database
                User user = userDAO.findByUsername(username);
                
                if (user != null && BCrypt.checkpw(password, user.getPassword())) {
                    // Create session
                    HttpSession session = request.getSession(true);
                    session.setAttribute("userId", user.getId());
                    session.setAttribute("username", user.getUsername());
                    
                    // Prepare response
                    Map<String, Object> responseData = new HashMap<>();
                    responseData.put("success", true);
                    responseData.put("message", "Login berhasil!");
                    
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("username", user.getUsername());
                    userData.put("name", user.getName());
                    userData.put("email", user.getEmail());
                    responseData.put("user", userData);
                    
                    out.print(JsonUtil.toJson(responseData));
                } else {
                    response.setStatus(400);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Username atau password salah");
                    out.print(JsonUtil.toJson(errorResponse));
                }
            }
        } catch (Exception e) {
            response.setStatus(500);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Terjadi kesalahan: " + e.getMessage());
            out.print(JsonUtil.toJson(errorResponse));
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }
}
```

**Key Differences:**

| Aspect | PHP | Java |
|--------|-----|------|
| **Session** | `$_SESSION['key']` | `session.setAttribute("key", value)` |
| **Request Data** | `file_get_contents('php://input')` | `request.getReader()` |
| **JSON Parsing** | `json_decode()` | `Gson.fromJson()` |
| **Response** | `echo json_encode()` | `response.getWriter().print()` |
| **HTTP Status** | `http_response_code(400)` | `response.setStatus(400)` |
| **Password** | `password_verify()` | `BCrypt.checkpw()` |
| **Error Handling** | Optional try-catch | Required try-catch |
| **Type Safety** | Dynamic | Static (must cast/convert) |

### 4.2 Transaction CRUD

#### PHP (transactions.php - GET):
```php
<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare("
        SELECT id, type, category, amount, description, 
               DATE_FORMAT(transaction_date, '%Y-%m-%d') as date
        FROM transactions 
        WHERE user_id = ? 
        ORDER BY transaction_date DESC
    ");
    $stmt->execute([$userId]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $transactions
    ]);
}
?>
```

#### Java (TransactionServlet.java - doGet):
```java
@WebServlet("/transactions")
public class TransactionServlet extends HttpServlet {
    
    private TransactionDAO transactionDAO = new TransactionDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            // Check authentication
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(401);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unauthorized");
                out.print(JsonUtil.toJson(errorResponse));
                return;
            }
            
            Integer userId = (Integer) session.getAttribute("userId");
            
            // Get all transactions for user
            List<Transaction> transactions = transactionDAO.findByUserId(userId);
            
            // Prepare response
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("success", true);
            responseData.put("data", transactions);
            
            out.print(JsonUtil.toJson(responseData));
            
        } catch (Exception e) {
            response.setStatus(500);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error: " + e.getMessage());
            out.print(JsonUtil.toJson(errorResponse));
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }
}
```

**Key Differences:**
- PHP: Single file handles all methods (GET, POST, DELETE)
- Java: Separate methods (doGet, doPost, doDelete)
- PHP: `$_SERVER['REQUEST_METHOD']` switch
- Java: Override specific method
- PHP: Direct access to $_SESSION
- Java: Get session via request.getSession()
- PHP: Array return, auto JSON serialization
- Java: List<Transaction>, manual serialization with Gson

---

## 5. Konversi Web Layer

### 5.1 URL Routing

#### PHP:
```
URL: http://localhost/finmate/api/auth.php?action=login
     http://localhost/finmate/api/transactions.php

Routing:
- File-based routing
- Each .php file is an endpoint
- Query params for actions (?action=login)
- .htaccess for URL rewriting (optional)
```

#### Java:
```
URL: http://localhost:8080/FinMate/auth?action=login
     http://localhost:8080/FinMate/transactions

Routing:
- web.xml or @WebServlet annotation
- Servlet mapping to URL pattern
- Context path: /FinMate
- Servlet path: /auth, /transactions

Configuration:
@WebServlet("/auth")
public class AuthServlet extends HttpServlet { ... }

Or in web.xml:
<servlet>
    <servlet-name>AuthServlet</servlet-name>
    <servlet-class>com.finmate.servlet.AuthServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>AuthServlet</servlet-name>
    <url-pattern>/auth</url-pattern>
</servlet-mapping>
```

### 5.2 HTML/View

#### PHP (index.html + PHP):
```html
<!-- Static HTML served by Apache -->
<!DOCTYPE html>
<html>
<head>
    <title>FinMate</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app">...</div>
    <script src="js/app.js"></script>
</body>
</html>

<!-- Or dynamic PHP: -->
<?php if (isset($_SESSION['user_id'])): ?>
    <p>Welcome, <?= htmlspecialchars($_SESSION['username']) ?></p>
<?php else: ?>
    <p>Please login</p>
<?php endif; ?>
```

#### Java (JSP):
```jsp
<%-- index.jsp --%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>FinMate</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app">...</div>
    <script src="js/app.js"></script>
</body>
</html>

<%-- Dynamic content: --%>
<c:if test="${not empty sessionScope.userId}">
    <p>Welcome, <c:out value="${sessionScope.username}"/></p>
</c:if>
<c:if test="${empty sessionScope.userId}">
    <p>Please login</p>
</c:if>
```

**Key Differences:**
- PHP: Mix PHP and HTML freely
- Java: JSP with specific tags (<%...%>, ${...})
- PHP: `<?= ?>` for echo
- Java: `${...}` for expression
- PHP: `htmlspecialchars()` for XSS prevention
- Java: `<c:out>` auto-escapes
- PHP: .html or .php extension
- Java: .jsp extension

### 5.3 AJAX Call (Frontend)

#### JavaScript untuk PHP:
```javascript
// Login request to PHP
async function handleLogin(event) {
    event.preventDefault();
    
    const data = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };
    
    const response = await fetch('../api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
        showToast(result.message, 'success');
        showDashboard();
    } else {
        showToast(result.message, 'error');
    }
}
```

#### JavaScript untuk Java:
```javascript
// Login request to Java Servlet
async function handleLogin(event) {
    event.preventDefault();
    
    const data = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };
    
    const response = await fetch('/FinMate/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
        showToast(result.message, 'success');
        showDashboard();
    } else {
        showToast(result.message, 'error');
    }
}
```

**Key Difference:**
- PHP: `../api/auth.php?action=login` (relative path)
- Java: `/FinMate/auth?action=login` (context path + servlet path)
- PHP: Direct file access
- Java: Servlet mapping

---

## 6. Deployment Comparison

### 6.1 Development Workflow

#### PHP (XAMPP):
```
1. Edit PHP file
2. Save (Ctrl+S)
3. Refresh browser (F5)
4. Changes immediately visible
5. No compilation needed
6. Check Apache error log if error
```

#### Java (NetBeans + Tomcat):
```
1. Edit Java file
2. Save (Ctrl+S)
3. Build project (F11) - if .java changed
4. Deploy to Tomcat (or auto-deploy)
5. Refresh browser (F5)
6. Changes visible after compilation
7. Check Tomcat logs if error

Note:
- JSP/CSS/JS changes: Just save & refresh
- Java changes: Need rebuild & redeploy
```

### 6.2 Deployment to Production

#### PHP:
```
1. FTP/SFTP upload:
   - Upload all PHP files to server
   - Upload CSS/JS files
   - Upload .htaccess
   
2. Configure:
   - Edit database.php with production DB
   - Set file permissions (755 for folders, 644 for files)
   
3. URL:
   - http://yoursite.com/finmate/public/
   
4. Update:
   - Replace changed files
   - No restart needed
```

#### Java:
```
1. Export WAR file:
   - Right-click project → Clean and Build
   - Get: FinMate/dist/FinMate.war
   
2. Upload to Tomcat:
   - Copy WAR to: /tomcat/webapps/
   - Or use Tomcat Manager
   
3. Configure:
   - Edit DatabaseConfig.java before build
   - Set production DB credentials
   - Rebuild to create new WAR
   
4. Deploy:
   - Tomcat auto-deploys WAR
   - Extracts to webapps/FinMate/
   
5. URL:
   - http://yoursite.com:8080/FinMate/
   
6. Update:
   - Upload new WAR
   - Tomcat auto-redeploys
   - May need Tomcat restart
```

### 6.3 File Permissions

#### PHP:
```
Folders: 755 (rwxr-xr-x)
Files:   644 (rw-r--r--)
PHP:     644 (executable by Apache)

Special:
- config/ should be 750 or outside web root
- upload/ needs 755 with write permission
```

#### Java:
```
WAR file: 644
Tomcat needs:
- Read access to WAR
- Write access to webapps/ (for extraction)
- Execute permission on Tomcat bin/

No special file permissions needed for .class files
Everything bundled in WAR
```

---

## 7. Summary: Why Convert to Java?

### Advantages of Java:

✅ **Type Safety**
- Compile-time error detection
- Less runtime errors
- Better IDE support (autocomplete, refactoring)

✅ **Enterprise Features**
- Better for large-scale applications
- Connection pooling
- Transaction management
- Security frameworks

✅ **Performance**
- Compiled bytecode (faster than interpreted)
- JVM optimizations
- Better for high-traffic apps

✅ **Maintainability**
- Enforced structure (MVC)
- Strong OOP
- Better code organization
- Easier to refactor

✅ **Scalability**
- Thread management
- Clustering support
- Load balancing
- Enterprise integration

### When to Use PHP:

✅ Quick prototypes
✅ Small to medium projects
✅ Shared hosting (limited server access)
✅ WordPress/CMS customization
✅ Rapid development
✅ Lower learning curve

### When to Use Java:

✅ Enterprise applications
✅ High-traffic websites
✅ Complex business logic
✅ Long-term maintainability
✅ Team collaboration
✅ Integration with Java ecosystem

---

## 8. Konversi Step-by-Step Praktis

### Step 1: Analyze PHP Code
```
1. Identifikasi semua endpoint (auth.php, transactions.php, dll)
2. List semua fungsi/method
3. Identifikasi data models (implisit dari database)
4. Map dependencies
```

### Step 2: Create Java Structure
```
1. Create packages:
   - model (for data entities)
   - dao (for database operations)
   - servlet (for API endpoints)
   - config (for database config)
   - util (for helpers)

2. Create Model classes:
   - PHP arrays → Java classes (User, Transaction, etc)
   - Add getters/setters
   - Add constructors

3. Create DAO classes:
   - Extract all SQL queries from PHP
   - Put in DAO methods
   - Handle ResultSet → Object mapping
```

### Step 3: Convert PHP Functions to Java Methods
```
For each PHP function:

1. Determine return type
   PHP: function getUser($id)
   Java: public User getUser(int id) throws SQLException

2. Convert parameters
   PHP: $username, $amount
   Java: String username, double amount

3. Convert logic
   - if/else → if/else (sama)
   - foreach → for/enhanced for
   - array operations → List operations

4. Add exception handling
   - Wrap database operations in try-catch
   - Propagate or handle exceptions
```

### Step 4: Convert Endpoints to Servlets
```
For each PHP endpoint file:

1. Create Servlet class
   auth.php → AuthServlet.java

2. Map HTTP methods
   if ($_SERVER['REQUEST_METHOD'] === 'GET')
   → protected void doGet(...)
   
   if ($_SERVER['REQUEST_METHOD'] === 'POST')
   → protected void doPost(...)

3. Extract action handling
   if ($_GET['action'] === 'login')
   → String action = request.getParameter("action");
     if ("login".equals(action))

4. Convert request/response
   - JSON input: BufferedReader + Gson
   - JSON output: PrintWriter + Gson
   - Set content type
```

### Step 5: Test & Debug
```
1. Unit test DAOs
2. Test servlets individually
3. Integration test
4. Frontend integration
5. End-to-end test
```

---

## 9. Common Pitfalls & Solutions

### Pitfall 1: SQL Date Handling
```
PHP: Works with string dates
$date = "2025-01-15";

Java: Must use java.sql.Date
Date date = Date.valueOf("2025-01-15");

Solution: Create utility method for conversion
```

### Pitfall 2: Null Handling
```
PHP: null coalescing operator
$name = $user['name'] ?? 'Unknown';

Java: Explicit null check
String name = (user.getName() != null) ? user.getName() : "Unknown";

Or use Optional<T>:
String name = Optional.ofNullable(user.getName()).orElse("Unknown");
```

### Pitfall 3: Array vs List
```
PHP: Arrays are flexible
$items = ['a', 'b', 'c'];
$items[] = 'd';

Java: Use List
List<String> items = new ArrayList<>();
items.add("a");
items.add("b");
items.add("c");
items.add("d");
```

### Pitfall 4: Resource Management
```
PHP: Auto-closes connections

Java: Must explicitly close
try (Connection conn = DatabaseConfig.getConnection()) {
    // Use connection
} // Auto-closes

Or manual:
Connection conn = null;
try {
    conn = DatabaseConfig.getConnection();
    // Use connection
} finally {
    DatabaseConfig.closeConnection(conn);
}
```

---

## 10. Final Checklist

### PHP to Java Conversion:

- [ ] All PHP endpoints mapped to Servlets
- [ ] All database queries converted to DAO methods
- [ ] All models defined as Java classes
- [ ] Session handling converted
- [ ] JSON serialization/deserialization implemented
- [ ] Error handling added (try-catch)
- [ ] Resource management (connection closing)
- [ ] JDBC driver added to project
- [ ] web.xml configured
- [ ] Servlets mapped to URLs
- [ ] Frontend AJAX calls updated
- [ ] Testing completed
- [ ] Deployment tested

---

**Konversi berhasil!** 🎉

Aplikasi PHP Anda sekarang berjalan sebagai Java Web Application di Apache Tomcat dengan NetBeans!
