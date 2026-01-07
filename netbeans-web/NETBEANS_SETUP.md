# 🚀 Quick Start - NetBeans Setup

## ✅ NetBeans Project Sudah Siap!

File konfigurasi NetBeans sudah dibuat. Sekarang folder `netbeans-web` akan dikenali sebagai **Java Web Application**.

---

## 📋 Langkah-langkah Setup di NetBeans

### 1️⃣ Buka Project di NetBeans

```
1. Launch NetBeans IDE
2. File → Open Project
3. Browse ke folder: "c:\File\Projects\Joki\Finmate Financial Website\netbeans-web"
4. Pilih folder netbeans-web → Open Project
```

✅ Project sekarang akan muncul di Projects panel dengan ikon ☕ (Java Web)

---

### 2️⃣ Download & Add Libraries

**Download JAR files** ke folder `netbeans-web/lib/`:

```
netbeans-web/lib/
├── mysql-connector-java-8.0.33.jar
├── gson-2.10.1.jar
├── HikariCP-5.0.1.jar
├── slf4j-api-2.0.7.jar
├── slf4j-simple-2.0.7.jar
├── jbcrypt-0.4.jar
├── jjwt-api-0.11.5.jar (optional)
├── jjwt-impl-0.11.5.jar (optional)
└── jjwt-jackson-0.11.5.jar (optional)
```

**Lihat:** `DEPENDENCIES.md` untuk download links lengkap.

**Cara Add ke NetBeans:**
```
1. Right-click project "FinMate" → Properties
2. Pilih "Libraries" di menu kiri
3. Compile → Add JAR/Folder
4. Browse ke folder lib/ → Select semua .jar files → Open
5. Ulangi untuk "Run" → Add JAR/Folder (sama seperti Compile)
6. Click OK
```

---

### 3️⃣ Setup Tomcat Server

**Jika Tomcat belum ada:**
```
1. Download Apache Tomcat 9.0 dari: https://tomcat.apache.org/download-90.cgi
2. Extract ke: C:\apache-tomcat-9.0.xx
```

**Add Tomcat ke NetBeans:**
```
1. Tools → Servers → Add Server
2. Pilih: Apache Tomcat or TomEE
3. Next
4. Server Location: Browse ke C:\apache-tomcat-9.0.xx
5. Username: (kosongkan atau isi admin)
6. Password: (kosongkan atau isi password)
7. Finish
```

**Set Tomcat untuk Project:**
```
1. Right-click project "FinMate" → Properties
2. Pilih "Run" di menu kiri
3. Server: Pilih Tomcat yang baru ditambahkan
4. Context Path: /FinMate
5. OK
```

---

### 4️⃣ Configure Environment (.env)

**Edit file `.env` di root project:**
```env
DB_PASSWORD=your_mysql_password   # ⚠️ GANTI INI!
JWT_SECRET=min-32-random-chars    # ⚠️ GANTI INI!
```

**Copy .env ke lokasi yang bisa dibaca:**
```powershell
# Option 1: Copy ke user home
Copy-Item .env $env:USERPROFILE\.env

# Option 2: Set system environment variable
# Control Panel → System → Advanced → Environment Variables
# Add: DB_PASSWORD, JWT_SECRET, dll
```

---

### 5️⃣ Build & Run

```
1. Right-click project → Clean and Build
   ✅ Harus berhasil tanpa error

2. Right-click project → Run
   ✅ Tomcat akan start otomatis
   ✅ Browser akan membuka: http://localhost:8080/FinMate/

3. Check console untuk messages:
   ✅ "Database connection pool initialized successfully!"
   ✅ "Connected to: localhost:3306/finmate"
```

---

## 🧪 Test Project

### Test 1: Welcome Page
```
URL: http://localhost:8080/FinMate/
✅ Harus muncul welcome page dengan API endpoints
```

### Test 2: API Endpoint
```
URL: http://localhost:8080/FinMate/api/auth?action=check
✅ Harus return JSON: {"success":false,"error":"Not authenticated"}
```

### Test 3: Login API
```powershell
curl.exe -X POST http://localhost:8080/FinMate/api/auth?action=login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"demo\",\"password\":\"demo123\"}'

✅ Harus return: {"success":true,"message":"Login successful",...}
```

---

## 🐛 Troubleshooting NetBeans

### ❌ "Cannot find Java source"
**Solution:**
```
Right-click project → Properties → Sources
Source Package Folders: pastikan ada "src"
```

### ❌ "Build failed - ClassNotFoundException"
**Solution:**
```
1. Pastikan semua JAR sudah di folder lib/
2. Right-click project → Clean
3. Refresh Libraries (Right-click Libraries → Refresh)
4. Build lagi
```

### ❌ "Server start failed - Port 8080 in use"
**Solution:**
```powershell
# Check what's using port 8080
netstat -ano | findstr :8080

# Kill the process or change Tomcat port
# Edit: C:\apache-tomcat\conf\server.xml
# <Connector port="8080" → change to 8081
```

### ❌ ".env file not found"
**Solution:**
```
1. Check .env ada di root project
2. Copy .env ke: C:\Users\YourName\.env
3. Atau set system environment variables
```

### ❌ "Database connection failed"
**Solution:**
```
1. Check XAMPP MySQL running
2. Verify .env: DB_PASSWORD benar
3. Test manual: mysql -u root -p
4. Check database exists: SHOW DATABASES;
```

---

## 📊 Struktur Project di NetBeans

```
FinMate (netbeans-web)
├── 📁 Source Packages
│   └── com.finmate
│       ├── config        (DatabaseConfig)
│       ├── dao           (UserDAO, TransactionDAO, dll)
│       ├── exception     (Custom exceptions)
│       ├── filter        (CORSFilter)
│       ├── model         (User, Transaction, dll)
│       ├── service       (UserService)
│       ├── servlet       (AuthServlet, dll)
│       └── util          (JsonUtil, EnvUtil, dll)
│
├── 📁 Libraries
│   ├── JDK 1.8
│   ├── Tomcat
│   └── JAR files (mysql, gson, hikari, dll)
│
├── 📁 Web Pages
│   ├── WEB-INF
│   │   └── web.xml
│   └── index.jsp
│
└── 📁 Configuration Files
    ├── build.xml
    └── nbproject/
```

---

## ✅ Success Indicators

Jika setup berhasil, Anda akan lihat:

1. ✅ Project icon ☕ di NetBeans Projects panel
2. ✅ Source Packages dengan struktur com.finmate.*
3. ✅ Libraries folder berisi semua JAR
4. ✅ Tomcat server listed di Servers
5. ✅ Clean and Build sukses tanpa error
6. ✅ Run → Browser buka http://localhost:8080/FinMate/
7. ✅ Console log: "Database connection pool initialized"

---

**NetBeans setup complete! 🎉**

Sekarang Anda bisa develop, debug, dan deploy langsung dari NetBeans IDE.
