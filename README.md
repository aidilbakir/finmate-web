# 💰 FinMate - Financial Management System

Aplikasi manajemen keuangan untuk mahasiswa dengan backend Java dan frontend React.

## 🏗️ Tech Stack

- **Backend**: Java (Servlets, JDBC, MySQL)
- **Frontend**: React + Vite + Material UI + TailwindCSS
- **Database**: MySQL 8.0+
- **Server**: Apache Tomcat 9.0+

## 📁 Project Structure

```
Finmate Financial Website/
├── netbeans-web/          # Java Backend
│   ├── src/               # Java source code
│   │   └── com/finmate/   # Main package
│   │       ├── config/    # Database configuration
│   │       ├── dao/       # Data Access Layer (CRUD)
│   │       ├── exception/ # Custom exceptions
│   │       ├── filter/    # Servlet filters (CORS, Auth)
│   │       ├── model/     # Entity models
│   │       ├── service/   # Business logic
│   │       ├── servlet/   # Controllers (API endpoints)
│   │       └── util/      # Utilities
│   ├── web/               # Web resources
│   │   ├── WEB-INF/      # Configuration
│   │   └── index.jsp     # Welcome page
│   └── lib/              # JAR dependencies
│
├── src/                  # React Frontend
│   ├── app/             # Application code
│   │   ├── components/  # React components
│   │   └── App.tsx      # Main app component
│   ├── styles/          # CSS styles
│   └── main.tsx         # Entry point
│
├── package.json         # Frontend dependencies
├── vite.config.ts      # Vite configuration
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- JDK 11+
- MySQL 8.0+
- Node.js 18+
- Apache Tomcat 9.0+

### 1. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Create database
CREATE DATABASE finmate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema (lihat PANDUAN_RUNNING.md untuk detail)
```

### 2. Configure Backend

Edit `netbeans-web/src/com/finmate/config/DatabaseConfig.java`:
```java
private static final String DB_PASSWORD = ""; // Ganti dengan password MySQL Anda
```

Download required JAR libraries ke folder `netbeans-web/lib/`:
- mysql-connector-java-8.0.33.jar
- gson-2.10.1.jar
- HikariCP-5.0.1.jar
- slf4j-api-2.0.7.jar
- slf4j-simple-2.0.7.jar
- jbcrypt-0.4.jar
- javax.servlet-api-4.0.1.jar

### 3. Run Backend

**Via NetBeans:**
1. Open project `netbeans-web` in NetBeans
2. Add Tomcat server (Tools → Servers)
3. Right-click project → Run
4. Access: `http://localhost:8080/FinMate/`

**Via Command Line:**
```bash
cd netbeans-web
javac -d build/classes -cp "lib/*" src/com/finmate/**/*.java
# Deploy ke Tomcat webapps folder
```

### 4. Run Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access: http://localhost:5173
```

## 📚 Documentation

Lihat folder dokumentasi untuk panduan lengkap:
- **PANDUAN_RUNNING.md** - Setup & running guide lengkap
- **walkthrough.md** - Implementation details & testing

## 🎯 Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Transaction Management (Income & Expense)
- ✅ Budget Tracking dengan alert system
- ✅ Savings Goals dengan progress tracking
- ✅ Dashboard dengan statistik real-time
- ✅ RESTful API
- ✅ CORS enabled untuk frontend integration

## 🔧 API Endpoints

Base URL: `http://localhost:8080/FinMate/api`

### Authentication
- `POST /auth?action=register` - Register user
- `POST /auth?action=login` - Login
- `GET /auth?action=logout` - Logout
- `GET /auth?action=check` - Check session

### Transactions
- `GET /transactions` - List all transactions
- `POST /transactions` - Create transaction
- `DELETE /transactions?id={id}` - Delete transaction

### Budgets
- `GET /budgets` - List all budgets
- `POST /budgets` - Create budget
- `DELETE /budgets?id={id}` - Delete budget

### Savings
- `GET /savings` - List savings goals
- `POST /savings` - Create savings goal
- `POST /savings?action=add_money` - Add money to goal
- `DELETE /savings?id={id}` - Delete goal

### Dashboard
- `GET /dashboard` - Get statistics

## 🧪 Testing

**Demo Credentials:**
- Username: `demo`
- Password: `demo123`

**Test dengan Postman/curl:**
```bash
# Register
curl -X POST http://localhost:8080/FinMate/api/auth?action=register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/FinMate/api/auth?action=login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' \
  -c cookies.txt

# Get transactions
curl -X GET http://localhost:8080/FinMate/api/transactions -b cookies.txt
```

## 🎓 OOP Principles Demonstrated

- ✅ **CRUD Operations** - Full implementation di semua DAOs
- ✅ **Inheritance** - BaseDAO, BaseServlet, Exception hierarchy
- ✅ **Interfaces** - IBaseDAO, IUserDAO dengan implementations
- ✅ **Exception Handling** - Custom exception hierarchy
- ✅ **MVC Architecture** - Model, Service, DAO, Servlet layers
- ✅ **Encapsulation** - Private fields dengan getters/setters
- ✅ **Polymorphism** - Interface implementations

## 📦 Libraries Used

| Library | Purpose | Version |
|---------|---------|---------|
| MySQL Connector | JDBC driver | 8.0.33 |
| Gson | JSON processing | 2.10.1 |
| HikariCP | Connection pooling | 5.0.1 |
| SLF4J | Logging | 2.0.7 |
| jBCrypt | Password hashing | 0.4 |
| React | Frontend framework | 18.3.1 |
| Material UI | UI components | 7.3.5 |
| Vite | Build tool | 6.3.5 |

## 🐛 Troubleshooting

Lihat **PANDUAN_RUNNING.md** untuk troubleshooting lengkap.

Common issues:
- **Database connection failed**: Check MySQL running & password
- **ClassNotFoundException**: Pastikan semua JAR di folder lib/
- **Port 8080 in use**: Change Tomcat port atau kill process yang menggunakan
- **CORS errors**: Pastikan CORSFilter aktif

## 📝 License

Educational project - Free to use for learning purposes.

## 👨‍💻 Author

Created as part of Java OOP learning project.

---

**Happy Coding! 🚀**