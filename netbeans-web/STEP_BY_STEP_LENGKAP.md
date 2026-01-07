# 📖 Panduan Step-by-Step LENGKAP - FinMate Java Web App

## 🎯 Overview Proses
```
1. Install Prerequisites (JDK, NetBeans, Tomcat, MySQL)
2. Setup Database MySQL
3. Setup Apache Tomcat di NetBeans
4. Create Java Web Project
5. Add JDBC Driver
6. Copy Source Code
7. Configure Database Connection
8. Build & Run
9. Test Aplikasi
```

**Estimasi Waktu:** 45-60 menit (first time)

---

## 📥 FASE 1: INSTALASI PREREQUISITES

### STEP 1.1: Install Java JDK

#### Windows:
```
1. Download JDK dari Oracle:
   URL: https://www.oracle.com/java/technologies/downloads/
   Pilih: Java SE Development Kit 11 (atau 17)
   File: jdk-11_windows-x64_bin.exe (sekitar 150MB)

2. Jalankan installer:
   - Double-click file .exe
   - Klik "Next" → "Next" → "Close"
   - Default install path: C:\Program Files\Java\jdk-11.x.x

3. Set Environment Variables:
   a. Klik kanan "This PC" → Properties
   b. Advanced system settings → Environment Variables
   c. System Variables → New:
      - Variable name: JAVA_HOME
      - Variable value: C:\Program Files\Java\jdk-11.x.x
   d. Edit "Path" variable:
      - Klik "New"
      - Add: %JAVA_HOME%\bin
   e. Klik OK semua

4. Verify Installation:
   - Buka Command Prompt (cmd)
   - Ketik: java -version
   - Output harus: java version "11.x.x"
   - Ketik: javac -version
   - Output harus: javac 11.x.x
```

#### Linux (Ubuntu/Debian):
```bash
# Update package list
sudo apt update

# Install OpenJDK 11
sudo apt install openjdk-11-jdk

# Verify
java -version
javac -version

# Set JAVA_HOME (add to ~/.bashrc)
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
```

#### macOS:
```bash
# Install via Homebrew
brew install openjdk@11

# Link it
sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk \
     /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# Verify
java -version
```

### STEP 1.2: Install Apache NetBeans

#### Windows/Linux/Mac:
```
1. Download NetBeans:
   URL: https://netbeans.apache.org/download/
   Pilih: Apache NetBeans 18 (Latest LTS)
   File: 
   - Windows: Apache-NetBeans-18-bin-windows-x64.exe (500MB)
   - Linux: Apache-NetBeans-18-bin-linux-x64.sh
   - Mac: Apache-NetBeans-18-bin-macosx.dmg

2. Install:
   Windows:
   - Double-click installer
   - Accept license
   - Pilih install path (default: C:\Program Files\NetBeans-18)
   - Select JDK location (auto-detected)
   - Klik "Install" → "Finish"
   
   Linux:
   chmod +x Apache-NetBeans-18-bin-linux-x64.sh
   ./Apache-NetBeans-18-bin-linux-x64.sh
   
   Mac:
   - Open .dmg file
   - Drag NetBeans to Applications

3. First Run:
   - Launch NetBeans
   - Will auto-detect JDK
   - Close welcome screen
   
4. Install Java Web Plugins:
   - Menu: Tools → Plugins
   - Tab: Available Plugins
   - Search: "Java Web"
   - Check:
     ✓ Java Web Applications
     ✓ Java EE Base
     ✓ Apache Tomcat
   - Klik "Install"
   - Accept license → Install → Finish
   - Restart NetBeans
```

### STEP 1.3: Install Apache Tomcat

#### Windows:
```
1. Download Tomcat:
   URL: https://tomcat.apache.org/download-90.cgi
   Pilih: 9.0.xx (Latest)
   File: 
   - 64-bit Windows zip: apache-tomcat-9.0.xx-windows-x64.zip (12MB)
   - Windows Service Installer: apache-tomcat-9.0.xx.exe (optional)

2. Extract ZIP (Recommended):
   - Extract ke: C:\apache-tomcat-9.0.xx
   - Jangan ada spasi di path!

3. Configure (Optional tapi disarankan):
   - Edit: C:\apache-tomcat-9.0.xx\conf\tomcat-users.xml
   - Tambahkan sebelum </tomcat-users>:
   
   <role rolename="manager-gui"/>
   <role rolename="admin-gui"/>
   <user username="admin" password="admin" 
         roles="manager-gui,admin-gui"/>

4. Test Manual (Optional):
   - Buka cmd
   - cd C:\apache-tomcat-9.0.xx\bin
   - startup.bat
   - Buka browser: http://localhost:8080
   - Harus muncul Tomcat welcome page
   - Untuk stop: shutdown.bat
```

#### Linux:
```bash
# Download
cd /opt
sudo wget https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.xx/bin/apache-tomcat-9.0.xx.tar.gz

# Extract
sudo tar xzvf apache-tomcat-9.0.xx.tar.gz
sudo mv apache-tomcat-9.0.xx tomcat

# Set permissions
sudo chmod +x /opt/tomcat/bin/*.sh

# Configure users (optional)
sudo nano /opt/tomcat/conf/tomcat-users.xml
# Add user config like Windows

# Test
/opt/tomcat/bin/startup.sh
curl http://localhost:8080
```

### STEP 1.4: Install MySQL

#### Windows:
```
1. Download MySQL Installer:
   URL: https://dev.mysql.com/downloads/installer/
   Pilih: mysql-installer-community-8.0.xx.msi (400MB)

2. Run Installer:
   - Setup Type: Developer Default
   - Klik "Next"
   
3. Check Requirements:
   - Install missing requirements (Microsoft Visual C++)
   - Klik "Execute" → tunggu selesai
   - Klik "Next"

4. Installation:
   - Klik "Execute" untuk install semua
   - Tunggu (5-10 menit)
   - Klik "Next"

5. Product Configuration - MySQL Server:
   a. Type and Networking:
      - Config Type: Development Computer
      - Port: 3306
      - Klik "Next"
   
   b. Authentication Method:
      - Use Strong Password Encryption
      - Klik "Next"
   
   c. Accounts and Roles:
      - Root Password: [SET PASSWORD ANDA!]
      - Re-enter password
      - INGAT PASSWORD INI!
      - Klik "Next"
   
   d. Windows Service:
      - Service Name: MySQL80
      - Start at System Startup: ✓
      - Klik "Next"
   
   e. Server File Permissions:
      - Default
      - Klik "Next"
   
   f. Apply Configuration:
      - Klik "Execute"
      - Tunggu selesai
      - Klik "Finish"

6. Product Configuration - Samples and Examples:
   - Klik "Next" → "Finish"

7. Installation Complete:
   - Klik "Finish"

8. Verify Installation:
   - Buka "MySQL 8.0 Command Line Client"
   - Enter password
   - Harus masuk ke mysql> prompt
   - Ketik: SHOW DATABASES;
   - Ketik: exit;
```

#### Linux (Ubuntu/Debian):
```bash
# Update
sudo apt update

# Install MySQL Server
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation
# Set root password
# Remove anonymous users: Y
# Disallow root login remotely: Y
# Remove test database: Y
# Reload privileges: Y

# Start service
sudo systemctl start mysql
sudo systemctl enable mysql

# Test
sudo mysql -u root -p
# Enter password
mysql> SHOW DATABASES;
mysql> exit;
```

### STEP 1.5: Download MySQL JDBC Driver

```
1. Download dari Maven Central atau MySQL:
   URL: https://dev.mysql.com/downloads/connector/j/
   
   Atau direct download:
   URL: https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.33/
   File: mysql-connector-java-8.0.33.jar (2.4MB)

2. Simpan file JAR:
   - Windows: C:\Users\[YourName]\Downloads\mysql-connector-java-8.0.33.jar
   - Linux: ~/Downloads/mysql-connector-java-8.0.33.jar
   
   JANGAN extract! File JAR langsung dipakai.

3. Verify:
   - File harus .jar extension
   - Size sekitar 2-3 MB
```

---

## 🗄️ FASE 2: SETUP DATABASE

### STEP 2.1: Start MySQL Server

#### Windows:
```
Method 1: Via Services
1. Win + R → ketik: services.msc → Enter
2. Cari "MySQL80"
3. Klik kanan → Start
4. Status harus "Running"

Method 2: Via Command
1. Buka cmd as Administrator
2. Ketik: net start MySQL80
```

#### Linux:
```bash
sudo systemctl start mysql
sudo systemctl status mysql
# Harus tampil "active (running)"
```

### STEP 2.2: Login ke MySQL

#### Via Command Line Client:
```
Windows:
1. Start Menu → MySQL 8.0 Command Line Client
2. Enter password (yang Anda set saat install)
3. Harus masuk ke: mysql>

Linux/Mac:
mysql -u root -p
# Enter password
```

#### Via MySQL Workbench (Recommended):
```
1. Buka MySQL Workbench
2. Klik "Local instance MySQL80" (atau similar)
3. Enter password
4. Connected!
```

### STEP 2.3: Create Database

```sql
-- Di MySQL prompt atau Workbench Query tab:

CREATE DATABASE finmate 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;

-- Harus ada 'finmate' di list
```

### STEP 2.4: Import Database Schema

#### Method 1: Via Command Line
```bash
# Exit dari MySQL terlebih dahulu jika sedang login
exit;

# Import file SQL
# Windows:
cd C:\path\to\netbeans-web\database
mysql -u root -p finmate < finmate.sql
# Enter password

# Linux/Mac:
cd /path/to/netbeans-web/database
mysql -u root -p finmate < finmate.sql
```

#### Method 2: Via MySQL Workbench (Easier!)
```
1. Di MySQL Workbench, connected ke server
2. Menu: Server → Data Import
3. Import Options:
   - Pilih: "Import from Self-Contained File"
   - Browse ke file: finmate.sql
4. Default Target Schema:
   - Select: finmate
5. Klik "Start Import" (bottom right)
6. Wait for completion (should be quick)
7. Check Output:
   - Harus: "Import completed"
```

### STEP 2.5: Verify Database Tables

```sql
-- Di MySQL Workbench atau Command Line Client:

USE finmate;

SHOW TABLES;

-- Harus tampil:
-- +-------------------+
-- | Tables_in_finmate |
-- +-------------------+
-- | budgets           |
-- | savings_goals     |
-- | transactions      |
-- | users             |
-- +-------------------+

-- Check demo user
SELECT * FROM users;

-- Harus ada user 'demo'

-- Check stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'finmate';

-- Harus ada:
-- - add_to_savings
-- - update_budget_spent

-- Check triggers
SHOW TRIGGERS FROM finmate;

-- Harus ada:
-- - after_transaction_insert
-- - after_transaction_delete
```

### STEP 2.6: Test Database Connection dari Java

```java
// Save this as TestConnection.java
import java.sql.*;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/finmate";
        String user = "root";
        String password = "YOUR_PASSWORD"; // GANTI!
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ Connected successfully!");
            
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM users");
            if (rs.next()) {
                System.out.println("✅ Total users: " + rs.getInt("total"));
            }
            
            conn.close();
        } catch (Exception e) {
            System.out.println("❌ Connection failed!");
            e.printStackTrace();
        }
    }
}

// Compile: javac TestConnection.java
// Run: java -cp .;mysql-connector-java-8.0.33.jar TestConnection
```

---

## 🔧 FASE 3: SETUP NETBEANS PROJECT

### STEP 3.1: Add Tomcat Server to NetBeans

```
1. Launch NetBeans IDE

2. Open Services Tab:
   - Menu: Window → Services
   - Atau: Ctrl + 5

3. Add Server:
   - Expand "Servers" node (if exists)
   - Right-click "Servers" → Add Server
   - Atau: Right-click di Services area → Add Server

4. Choose Server:
   - Server: Apache Tomcat or TomEE
   - Klik "Next"

5. Server Location:
   - Name: Apache Tomcat 9.0.xx (atau custom name)
   - Server Location: 
     Windows: C:\apache-tomcat-9.0.xx
     Linux: /opt/tomcat
   - Browse jika perlu
   - Klik "Next"

6. Instance Properties (Optional):
   - Username: admin (if configured di tomcat-users.xml)
   - Password: admin
   - Klik "Finish"

7. Verify:
   - Services tab → Servers → Apache Tomcat
   - Right-click → Start
   - Wait for "Started" status
   - Buka browser: http://localhost:8080
   - Tomcat page should appear
   - Right-click → Stop (untuk sekarang)
```

### STEP 3.2: Create Java Web Project

```
1. New Project:
   - Menu: File → New Project
   - Atau: Ctrl + Shift + N

2. Choose Project:
   - Categories: Java with Ant → Java Web
   - Projects: Web Application
   - Klik "Next"
   
   Note: Jika tidak ada "Java Web":
   - Tools → Plugins → Available Plugins
   - Install "Java Web Applications"
   - Restart NetBeans

3. Name and Location:
   - Project Name: FinMate
   - Project Location: 
     Pilih folder, contoh: C:\Users\YourName\NetBeansProjects
   - Project Folder: (auto-filled) ....\FinMate
   - Use Dedicated Folder for Storing Libraries: ✓ (checked)
   - Klik "Next"

4. Server and Settings:
   - Server: Apache Tomcat (yang sudah di-add)
   - Java EE Version: Java EE 7 Web atau Java EE 8 Web
   - Context Path: /FinMate
   - Klik "Next"

5. Frameworks:
   - SKIP (jangan pilih framework apapun)
   - Klik "Finish"

6. Wait for Project Creation:
   - NetBeans akan create project structure
   - Auto-generate index.html, web.xml, dll
   - Project "FinMate" muncul di Projects tab

7. Verify Project Structure:
   Projects tab:
   FinMate
   ├── Source Packages
   │   └── (empty - akan kita isi)
   ├── Libraries
   │   ├── JDK 11
   │   └── Apache Tomcat
   ├── Web Pages
   │   ├── WEB-INF
   │   │   └── web.xml
   │   ├── index.html
   │   └── META-INF
   └── Configuration Files
```

### STEP 3.3: Create Package Structure

```
1. Create Packages:
   Right-click "Source Packages" → New → Java Package
   
   Create these packages (one by one):
   a. Package Name: com.finmate.config → Finish
   b. Package Name: com.finmate.model → Finish
   c. Package Name: com.finmate.dao → Finish
   d. Package Name: com.finmate.servlet → Finish
   e. Package Name: com.finmate.util → Finish

2. Verify:
   Source Packages
   ├── com.finmate.config
   ├── com.finmate.model
   ├── com.finmate.dao
   ├── com.finmate.servlet
   └── com.finmate.util

3. Create Web Folders:
   Right-click "Web Pages" → New → Folder
   
   a. Folder Name: css → Finish
   b. Folder Name: js → Finish
   c. Folder Name: images → Finish (optional)

4. Verify:
   Web Pages
   ├── css
   ├── js
   ├── images
   ├── WEB-INF
   ├── index.html
   └── META-INF
```

### STEP 3.4: Add MySQL JDBC Driver

```
1. Create lib Folder:
   - Expand "Web Pages"
   - Expand "WEB-INF"
   - Right-click "WEB-INF" → New → Folder
   - Folder Name: lib
   - Finish

2. Copy JDBC JAR to lib:
   Method A: Via File Explorer
   - Buka folder project di File Explorer:
     Right-click project → Properties → Project Folder
   - Navigate to: web\WEB-INF\lib
   - Copy mysql-connector-java-8.0.33.jar ke sini

   Method B: Via NetBeans
   - Klik kanan "lib" folder → Properties
   - Note the full path
   - Copy JAR via file manager

3. Add to Libraries:
   - Right-click "Libraries" (di project tree)
   - Add JAR/Folder
   - Browse ke: mysql-connector-java-8.0.33.jar
   - Open

4. Verify:
   Libraries
   ├── JDK 11
   ├── Apache Tomcat
   └── mysql-connector-java-8.0.33.jar ← NEW!
   
   WEB-INF
   └── lib
       └── mysql-connector-java-8.0.33.jar ← ALSO HERE!
```

### STEP 3.5: Add Additional Libraries (Optional tapi Recommended)

```
1. Download Gson (for JSON):
   URL: https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/
   File: gson-2.10.1.jar

2. Download jBCrypt (for password hashing):
   URL: https://repo1.maven.org/maven2/org/mindrot/jbcrypt/0.4/
   File: jbcrypt-0.4.jar

3. Copy both JARs:
   - To: FinMate\web\WEB-INF\lib\
   - Add to Libraries (like MySQL JAR)

4. Verify:
   WEB-INF\lib\
   ├── mysql-connector-java-8.0.33.jar
   ├── gson-2.10.1.jar
   └── jbcrypt-0.4.jar
```

---

## 📝 FASE 4: COPY SOURCE CODE

### STEP 4.1: Copy Java Model Classes

```
1. Create User.java:
   - Right-click package "com.finmate.model"
   - New → Java Class
   - Class Name: User
   - Finish
   - Replace content dengan code dari:
     /netbeans-web/src/com/finmate/model/User.java

2. Create Transaction.java:
   - Same process
   - Class Name: Transaction
   - Copy code from Transaction.java

3. Create Budget.java:
   - Class Name: Budget
   - Copy code

4. Create SavingsGoal.java:
   - Class Name: SavingsGoal
   - Copy code

5. Verify:
   com.finmate.model
   ├── User.java
   ├── Transaction.java
   ├── Budget.java
   └── SavingsGoal.java
```

### STEP 4.2: Copy Config Class

```
1. Create DatabaseConfig.java:
   - Right-click "com.finmate.config"
   - New → Java Class
   - Class Name: DatabaseConfig
   - Copy code from: /netbeans-web/src/com/finmate/config/DatabaseConfig.java

2. **IMPORTANT:** Edit Database Credentials:
   - Line: private static final String PASSWORD = "";
   - Change to: private static final String PASSWORD = "YOUR_MYSQL_PASSWORD";
   - Save (Ctrl + S)

3. Verify no compilation errors
```

### STEP 4.3: Copy DAO Classes

```
Copy these files to com.finmate.dao:
1. UserDAO.java
2. TransactionDAO.java
3. BudgetDAO.java
4. SavingsDAO.java

For each:
- Right-click "com.finmate.dao"
- New → Java Class
- Set name
- Copy code from source
- Save
```

### STEP 4.4: Copy Servlet Classes

```
Copy these files to com.finmate.servlet:
1. AuthServlet.java
2. TransactionServlet.java
3. BudgetServlet.java
4. SavingsServlet.java
5. DashboardServlet.java

For each:
- Right-click "com.finmate.servlet"
- New → Servlet
- Class Name: (e.g., AuthServlet)
- URL Patterns: (e.g., /auth)
- Finish
- Replace generated code dengan source code
```

### STEP 4.5: Copy Util Classes

```
1. JsonUtil.java:
   - Right-click "com.finmate.util"
   - New → Java Class
   - Class Name: JsonUtil
   - Copy code
```

### STEP 4.6: Copy Web Files

```
1. index.jsp:
   - Right-click "Web Pages"
   - New → JSP
   - File Name: index
   - Finish
   - Copy HTML content

2. dashboard.jsp:
   - Same process
   - File Name: dashboard

3. style.css:
   - Right-click "css" folder
   - New → Cascading Style Sheet
   - File Name: style
   - Copy CSS content

4. app.js:
   - Right-click "js" folder
   - New → JavaScript File
   - File Name: app
   - Copy JavaScript content

5. Delete default index.html:
   - Right-click index.html
   - Delete
   - Confirm
```

### STEP 4.7: Configure web.xml

```
1. Open web.xml:
   - Expand "WEB-INF"
   - Double-click "web.xml"

2. Switch to XML view (if in Design view):
   - Tab at bottom: "XML"

3. Add after <web-app> tag:
```
```xml
    <!-- Session Configuration -->
    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>
    
    <!-- Welcome Files -->
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
    
    <!-- Servlet Mappings (if not auto-added) -->
    <servlet>
        <servlet-name>AuthServlet</servlet-name>
        <servlet-class>com.finmate.servlet.AuthServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>AuthServlet</servlet-name>
        <url-pattern>/auth</url-pattern>
    </servlet-mapping>
    
    <!-- Repeat for other servlets -->
```
```
4. Save (Ctrl + S)
```

---

## 🔨 FASE 5: BUILD & RUN

### STEP 5.1: Resolve Compilation Errors

```
1. Open Problems Tab:
   - Menu: Window → IDE Tools → Action Items
   - Atau: Ctrl + 6

2. Common Errors & Solutions:

   Error: "package does not exist"
   Solution: 
   - Alt + Enter on error line
   - Select "Add import"
   
   Error: "cannot find symbol"
   Solution:
   - Check typos
   - Verify class name matches file name
   
   Error: "class not found: com.mysql.cj.jdbc.Driver"
   Solution:
   - Verify JDBC JAR in Libraries
   - Right-click project → Clean and Build

3. Fix all errors before proceeding
```

### STEP 5.2: Clean and Build

```
1. Clean Project:
   - Right-click project "FinMate"
   - Select "Clean"
   - Wait for "BUILD SUCCESSFUL" in Output

2. Build Project:
   - Right-click project "FinMate"
   - Select "Build"
   - Wait for "BUILD SUCCESSFUL"
   
   Output should show:
   ----------------------------------------------
   BUILD SUCCESSFUL (total time: X seconds)

3. Check for Warnings:
   - Yellow warnings are OK
   - Red errors must be fixed
```

### STEP 5.3: Deploy to Tomcat

```
Method 1: Via Run Button
1. Right-click project "FinMate"
2. Select "Run"
3. NetBeans will:
   - Start Tomcat (if not running)
   - Deploy WAR file
   - Open browser automatically

Method 2: Manual Deploy
1. Start Tomcat:
   - Services tab (Ctrl+5)
   - Servers → Apache Tomcat
   - Right-click → Start

2. Deploy:
   - Right-click project → Deploy
   - Wait for "Deployed FinMate"

3. Open browser manually:
   - http://localhost:8080/FinMate/
```

### STEP 5.4: Verify Deployment

```
1. Check Tomcat Output:
   - Tab: "Apache Tomcat" in Output window
   - Look for:
     ✓ "MySQL JDBC Driver loaded successfully!"
     ✓ "Deploying web application directory [FinMate]"
     ✓ "Deployment of web application directory [FinMate] has finished"
   
2. Check Browser:
   - URL: http://localhost:8080/FinMate/
   - Should show login/register page
   - Check browser console (F12) for JavaScript errors

3. Check Services:
   - Services → Servers → Apache Tomcat
   - Expand server
   - Should see: "FinMate [/FinMate]"
```

---

## ✅ FASE 6: TEST APLIKASI

### STEP 6.1: Test Login (Demo Account)

```
1. Di browser: http://localhost:8080/FinMate/

2. Login form harus visible

3. Input credentials:
   Username: demo
   Password: demo123

4. Klik "Login"

5. Expected Result:
   ✓ Toast notification: "Login berhasil!"
   ✓ Redirect to dashboard
   ✓ Header shows: "Demo User"
   ✓ Stats cards show data
   ✓ No console errors

6. If Failed:
   - Check browser console (F12)
   - Check Tomcat output for errors
   - Verify database connection
```

### STEP 6.2: Test Register

```
1. Logout (klik Logout button)

2. Klik "Register" tab

3. Fill form:
   Nama Lengkap: Test User
   Username: testuser
   Email: test@email.com (optional)
   Password: test123

4. Klik "Register"

5. Expected:
   ✓ Toast: "Registrasi berhasil! Silakan login."
   ✓ Switch to Login form
   ✓ Form cleared

6. Login dengan akun baru:
   Username: testuser
   Password: test123
   
7. Should login successfully
```

### STEP 6.3: Test Add Transaction

```
1. Login (if not logged in)

2. Klik tab "Transaksi"

3. Klik "Tambah Transaksi"

4. Modal should appear

5. Fill form:
   Type: Pemasukan
   Kategori: Uang Saku
   Jumlah: 5000000
   Deskripsi: Uang saku Januari
   Tanggal: (today's date)

6. Klik "Simpan"

7. Expected:
   ✓ Toast: "Transaksi berhasil ditambahkan!"
   ✓ Modal closes
   ✓ Transaction appears in list
   ✓ Dashboard stats update
   ✓ Total Pemasukan: Rp 5.000.000
   ✓ Saldo Total: Rp 5.000.000
```

### STEP 6.4: Test Add Budget

```
1. Klik tab "Budget"

2. Klik "Tambah Budget"

3. Fill form:
   Kategori: Makanan & Minuman
   Limit Budget: 1500000

4. Klik "Simpan"

5. Expected:
   ✓ Budget card appears
   ✓ Shows: Rp 0 / Rp 1.500.000
   ✓ Progress: 0%
   ✓ Status: ✓
```

### STEP 6.5: Test Add Savings Goal

```
1. Klik tab "Tabungan"

2. Klik "Tambah Target"

3. Fill form:
   Nama Target: Laptop Baru
   Target Jumlah: 10000000
   Deadline: 2025-12-31

4. Klik "Simpan"

5. Expected:
   ✓ Goal card appears
   ✓ Shows: Rp 0 / Rp 10.000.000
   ✓ Progress: 0%
   ✓ "Tambah" button available
```

### STEP 6.6: Test Add to Savings (FITUR UTAMA!)

```
1. Tambah expense dulu (untuk punya saldo):
   - Tab Transaksi → Tambah
   - Type: Pengeluaran
   - Kategori: Makanan & Minuman
   - Jumlah: 300000
   - Submit
   
2. Verify saldo:
   - Dashboard → Saldo Total: Rp 4.700.000
   
3. Klik tab "Tabungan"

4. Pada goal "Laptop Baru", klik "Tambah"

5. Modal appears

6. Input: 500000

7. Klik "Nabung"

8. Expected Results:
   ✓ Toast: "Berhasil menabung Rp 500.000!"
   ✓ Modal closes
   
   Dashboard updates:
   ✓ Total Pengeluaran: Rp 800.000 (300k + 500k)
   ✓ Saldo Total: Rp 4.200.000 (decreased!)
   ✓ Total Tabungan: Rp 500.000
   
   Tabungan tab:
   ✓ Progress: Rp 500.000 / Rp 10.000.000 (5%)
   ✓ Progress bar updated
   
   Transaksi tab:
   ✓ New transaction:
     - Type: Pengeluaran (red)
     - Kategori: 💰 Tabungan
     - Amount: -Rp 500.000
     - Description: "Nabung: Laptop Baru"

9. Try nabung lagi dengan amount > saldo:
   - Input: 5000000
   - Expected: Error "Saldo tidak cukup!"
```

### STEP 6.7: Test Delete Operations

```
1. Delete Transaction:
   - Tab Transaksi
   - Klik delete button (trash icon)
   - Confirm
   - Expected: Transaction removed, stats updated

2. Delete Budget:
   - Tab Budget
   - Klik "Hapus"
   - Confirm
   - Expected: Budget removed

3. Delete Savings Goal:
   - Tab Tabungan
   - Klik "Hapus"
   - Confirm
   - Expected: Goal removed, stats updated
```

### STEP 6.8: Test Logout

```
1. Klik "Logout" button

2. Expected:
   ✓ Toast: "Logout berhasil!"
   ✓ Redirect to login page
   ✓ Session cleared
   ✓ Cannot access dashboard without login
```

---

## 🐛 TROUBLESHOOTING LENGKAP

### Issue 1: Tomcat Won't Start

**Symptoms:**
- Error: "Port 8080 already in use"
- Tomcat status: Failed

**Solutions:**

```
A. Check if port is used:
   Windows:
   netstat -ano | findstr :8080
   
   Linux/Mac:
   lsof -i :8080

B. Kill process:
   Windows:
   taskkill /PID [PID_NUMBER] /F
   
   Linux/Mac:
   kill -9 [PID_NUMBER]

C. Change Tomcat port:
   1. Stop Tomcat
   2. Edit: apache-tomcat/conf/server.xml
   3. Find: <Connector port="8080"
   4. Change: <Connector port="8081"
   5. Save
   6. In NetBeans: 
      - Services → Servers → Apache Tomcat
      - Right-click → Properties
      - Update port number
   7. Restart Tomcat
   8. New URL: http://localhost:8081/FinMate/
```

### Issue 2: Database Connection Failed

**Symptoms:**
- Error: "Communications link failure"
- Error: "Access denied for user 'root'@'localhost'"

**Solutions:**

```
A. Verify MySQL is running:
   Windows:
   - Win+R → services.msc
   - Find "MySQL80"
   - Status should be "Running"
   - If not, right-click → Start
   
   Linux:
   sudo systemctl status mysql
   sudo systemctl start mysql

B. Test connection:
   mysql -u root -p
   # If fails, password is wrong

C. Fix password in code:
   1. Edit: DatabaseConfig.java
   2. Line: private static final String PASSWORD = "";
   3. Change to YOUR MySQL password
   4. Save
   5. Clean and Build
   6. Redeploy

D. Verify database exists:
   mysql -u root -p
   mysql> SHOW DATABASES;
   # Should show 'finmate'
   # If not, import SQL again

E. Grant permissions:
   mysql> GRANT ALL PRIVILEGES ON finmate.* TO 'root'@'localhost';
   mysql> FLUSH PRIVILEGES;
```

### Issue 3: ClassNotFoundException

**Symptoms:**
- Error: "java.lang.ClassNotFoundException: com.mysql.cj.jdbc.Driver"
- Error: "java.lang.ClassNotFoundException: com.google.gson.Gson"

**Solutions:**

```
A. Verify JAR in lib folder:
   - Check: FinMate/web/WEB-INF/lib/
   - Should have: mysql-connector-java-8.0.33.jar
   - If not, copy it there

B. Add to Libraries:
   - Right-click "Libraries"
   - Add JAR/Folder
   - Select the JAR
   - Klik Open

C. Clean and Build:
   - Right-click project
   - Clean
   - Wait
   - Build
   - Wait
   - Redeploy

D. Verify in WAR:
   - After build, check:
   - FinMate/build/web/WEB-INF/lib/
   - JAR should be there
   - If not, copy manually and rebuild
```

### Issue 4: HTTP 404 Not Found

**Symptoms:**
- Browser shows: "HTTP Status 404 – Not Found"
- Message: "The requested resource [/FinMate/] is not available"

**Solutions:**

```
A. Check URL:
   - Correct: http://localhost:8080/FinMate/
   - NOT: http://localhost:8080/finmate/ (case sensitive!)
   - NOT: http://localhost:8080/ (missing context)

B. Verify deployment:
   - Services → Servers → Apache Tomcat
   - Expand server
   - Should see: "FinMate [/FinMate]"
   - If not:
     * Right-click project → Deploy
     * Or: Right-click project → Run

C. Check Tomcat output:
   - Look for:
     "Deployment of web application directory [FinMate] has finished"
   - If error, read the message

D. Verify welcome file:
   - Open web.xml
   - Should have:
     <welcome-file-list>
         <welcome-file>index.jsp</welcome-file>
     </welcome-file-list>

E. Undeploy and Redeploy:
   - Services → Apache Tomcat → FinMate
   - Right-click → Undeploy
   - Right-click project → Clean and Build
   - Right-click project → Run
```

### Issue 5: HTTP 500 Internal Server Error

**Symptoms:**
- Browser shows: "HTTP Status 500 – Internal Server Error"
- Application crashes on certain actions

**Solutions:**

```
A. Check Tomcat logs:
   - NetBeans Output window
   - Tab: "Apache Tomcat"
   - Look for red error messages
   - Read stack trace

B. Common causes:
   
   1. NullPointerException:
      - Database connection null
      - Session attribute null
      - Missing data
      
   2. SQLException:
      - Table doesn't exist
      - Column name wrong
      - SQL syntax error
      
   3. NumberFormatException:
      - Invalid number format
      - Null value parsed as number

C. Debug:
   1. Set breakpoint in servlet
   2. Right-click project → Debug
   3. Step through code
   4. Check variable values
   5. Find null or wrong value

D. Enable detailed errors:
   - Edit web.xml
   - Add:
     <error-page>
         <error-code>500</error-code>
         <location>/error.jsp</location>
     </error-page>
   - Create error.jsp to show details
```

### Issue 6: Session Expired Immediately

**Symptoms:**
- Login success but redirects back to login
- Session doesn't persist
- User logged out on every page

**Solutions:**

```
A. Check session timeout in web.xml:
   <session-config>
       <session-timeout>30</session-timeout> <!-- 30 minutes -->
   </session-config>

B. Verify session code in servlet:
   HttpSession session = request.getSession(true); // true creates if not exists
   session.setAttribute("userId", userId);

C. Check cookies enabled:
   - Browser settings → Privacy → Cookies
   - Allow cookies for localhost

D. Clear browser cache:
   - Ctrl + Shift + Delete
   - Clear cookies and cache
   - Restart browser

E. Check servlet code:
   - Don't call: session.invalidate() accidentally
   - Don't create new session every time:
     HttpSession session = request.getSession(); // Get existing
```

### Issue 7: AJAX Requests Fail

**Symptoms:**
- JavaScript console errors
- Network errors
- No response from server

**Solutions:**

```
A. Check browser console (F12):
   - Tab: Console
   - Look for errors:
     * CORS error
     * 404 error
     * Network error

B. Check Network tab (F12):
   - Tab: Network
   - Click on failed request
   - Check:
     * Request URL (should be correct)
     * Status code
     * Response (error message)

C. Verify servlet URL:
   - URL in JavaScript should match web.xml
   - Example:
     JS: fetch('/FinMate/auth')
     web.xml: <url-pattern>/auth</url-pattern>

D. Check CORS (if needed):
   - Add to servlet:
     response.setHeader("Access-Control-Allow-Origin", "*");

E. Debug:
   - Add console.log() in JavaScript
   - Add System.out.println() in servlet
   - Check both outputs
```

### Issue 8: JSON Parsing Error

**Symptoms:**
- Error: "Unexpected token"
- Error: "JSON parse error"
- Invalid response format

**Solutions:**

```
A. Verify response format:
   - Servlet must set:
     response.setContentType("application/json");
     response.setCharacterEncoding("UTF-8");
   
B. Check JSON structure:
   - Use JsonUtil.toJson() correctly
   - Verify object is serializable
   
C. Debug response:
   - Network tab → Preview
   - Check if valid JSON
   - Use JSONLint: https://jsonlint.com/

D. Common mistakes:
   - Missing quotes
   - Extra commas
   - Wrong brackets
   - Non-JSON content in response

E. Use Gson properly:
   - Add gson JAR to lib
   - Use:
     Gson gson = new Gson();
     String json = gson.toJson(object);
```

---

## 🎯 Final Checklist

```
✅ Prerequisites Installed:
   [ ] JDK 11+ installed and verified
   [ ] NetBeans 12+ installed
   [ ] Apache Tomcat 9+ installed
   [ ] MySQL 8+ installed and running
   [ ] JDBC driver downloaded

✅ Database Setup:
   [ ] MySQL server running
   [ ] Database 'finmate' created
   [ ] Schema imported successfully
   [ ] Tables exist (users, transactions, budgets, savings_goals)
   [ ] Stored procedures created
   [ ] Triggers created
   [ ] Demo user exists

✅ NetBeans Project:
   [ ] Tomcat added to NetBeans
   [ ] Project created successfully
   [ ] Package structure correct
   [ ] JDBC JAR in WEB-INF/lib
   [ ] JDBC JAR added to Libraries
   [ ] Gson JAR added (optional)
   [ ] jBCrypt JAR added (optional)

✅ Source Code:
   [ ] All model classes copied
   [ ] DatabaseConfig.java password updated
   [ ] All DAO classes copied
   [ ] All servlet classes copied
   [ ] Util classes copied
   [ ] JSP files copied
   [ ] CSS file copied
   [ ] JavaScript file copied
   [ ] web.xml configured

✅ Build & Deploy:
   [ ] No compilation errors
   [ ] Clean and Build successful
   [ ] Tomcat started
   [ ] Application deployed
   [ ] No deployment errors
   [ ] Browser opens to app

✅ Testing:
   [ ] Login with demo account works
   [ ] Register new user works
   [ ] Add transaction works
   [ ] Dashboard stats update
   [ ] Add budget works
   [ ] Budget tracking works
   [ ] Add savings goal works
   [ ] Add to savings works (PENTING!)
   [ ] Saldo berkurang saat nabung
   [ ] Progress tabungan bertambah
   [ ] Transaksi nabung muncul
   [ ] Delete operations work
   [ ] Logout works

✅ Production Ready:
   [ ] Change database password
   [ ] Disable error display
   [ ] Set appropriate session timeout
   [ ] Configure logging
   [ ] Set production database
   [ ] Create WAR for deployment
```

---

## 🎉 SELESAI!

Jika semua checklist ✅, aplikasi FinMate Java Web sudah **SIAP DIGUNAKAN**!

**Access URL:**
```
http://localhost:8080/FinMate/
```

**Demo Login:**
```
Username: demo
Password: demo123
```

**Next Steps:**
1. Explore semua fitur
2. Test dengan data real
3. Customize sesuai kebutuhan
4. Deploy ke production (optional)

---

**Happy Coding!** 🚀💻

Jika ada masalah, refer ke section Troubleshooting atau check:
- Tomcat logs (Output window)
- Browser console (F12)
- MySQL logs
- NetBeans error messages
