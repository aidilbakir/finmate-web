# 🚀 Startup Guide - FinMate Application

## ✅ Pre-Flight Checklist

Sebelum menjalankan aplikasi, pastikan hal-hal berikut sudah dilakukan:

### 1. MySQL Database Running
```powershell
# Cek apakah MySQL running
Get-Service MySQL* | Select-Object Name, Status

# Jika tidak running, start MySQL
net start MySQL
```

### 2. Import Database
```powershell
# Posisi di root project
cd "c:\File\Projects\Joki\Finmate Financial Website"

# Import database
mysql -u root -p < database\finmate.sql
# Password: password MySQL Anda
```

Atau via phpMyAdmin:
- Buka: http://localhost/phpmyadmin
- Import file: `database/finmate.sql`

### 3. Update Database Configuration
Edit file di NetBeans project: `src/com/finmate/config/DatabaseConfig.java`

Pastikan password MySQL sesuai:
```java
private static final String DB_PASSWORD = "your_mysql_password"; // ← Sesuaikan!
```

---

## 🔧 Running the Application

### Step 1: Start Backend (NetBeans + Tomcat)

1. **Buka NetBeans IDE**
2. **Open Project**: `netbeans-web` folder
3. **Clean & Build**:
   - Right-click project → **Clean and Build**
4. **Run Project**:
   - Right-click project → **Run**
   - Atau tekan **F6**

**Server akan start di**: `http://localhost:8080`

**Tunggu sampai muncul**:
```
INFO: Server startup in [xxx] milliseconds
```

### Step 2: Start Frontend (Vite)

```powershell
# Pastikan di root project
cd "c:\File\Projects\Joki\Finmate Financial Website"

# Install dependencies (jika belum)
npm install

# Run development server
npm run dev
```

**Frontend akan start di**: `http://localhost:5173` (atau port lain)

---

## 🧪 Testing the Connection

### Test 1: Check Backend API
Buka browser atau Postman, test endpoint:

```
GET http://localhost:8080/FinMate/api/auth?action=check
```

**Expected Response** (jika belum login):
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### Test 2: Login Test
```
POST http://localhost:8080/FinMate/api/auth?action=login
Content-Type: application/json

{
  "username": "demo",
  "password": "demo123"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "username": "demo",
    "name": "Demo User",
    "email": "demo@finmate.com"
  }
}
```

### Test 3: Frontend Login
1. Buka: `http://localhost:5173`
2. Login dengan:
   - **Username**: `demo`
   - **Password**: `demo123`

---

## 🐛 Troubleshooting

### Problem: 404 Not Found

**Possible Causes**:
1. ❌ Backend tidak running
   - **Fix**: Jalankan project di NetBeans (F6)
   
2. ❌ Context path salah
   - **Fix**: Sudah diperbaiki di `context.xml` → `/FinMate`
   
3. ❌ Tomcat port conflict
   - **Fix**: Check di NetBeans → Services → Servers → Apache Tomcat → Properties → Ports

### Problem: Database Connection Error

**Check**:
```sql
-- Login ke MySQL
mysql -u root -p

-- Verify database exists
SHOW DATABASES LIKE 'finmate';

-- Use database
USE finmate;

-- Check tables
SHOW TABLES;

-- Check demo user
SELECT * FROM users WHERE username='demo';
```

**Fix**:
- Pastikan database sudah diimport
- Pastikan password di `DatabaseConfig.java` benar

### Problem: CORS Error

Jika ada CORS error di browser console, tambahkan CORS filter di backend.

**Already implemented** di `BaseServlet.java` (line ~20-25):
```java
response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
response.setHeader("Access-Control-Allow-Credentials", "true");
```

---

## 📝 Login Credentials

| Account | Username | Password |
|---------|----------|----------|
| Demo    | `demo`   | `demo123` |
| Student | `student` | `demo123` |

---

## 🎯 Quick Commands Reference

```powershell
# Backend (NetBeans)
# 1. Clean & Build
# 2. Run (F6)

# Frontend
npm run dev          # Start dev server
npm run build        # Production build

# Database
mysql -u root -p < database\finmate.sql  # Import
mysql -u root -p finmate                  # Connect
```

---

## ✅ Success Indicators

**Backend running successfully**:
- NetBeans output: "Server startup in [xxx] milliseconds"
- Browser test: `http://localhost:8080/FinMate/` (should not be 404)

**Frontend running successfully**:
- Terminal: "Local: http://localhost:5173"
- No console errors in browser DevTools

**Database connected**:
- No "Connection refused" errors
- Login succeeds with demo/demo123

---

**Need help?** Check the files:
- Database setup: `database/README.md`
- Backend config: `netbeans-web/src/com/finmate/config/DatabaseConfig.java`
- API endpoints: `netbeans-web/src/com/finmate/servlet/`
