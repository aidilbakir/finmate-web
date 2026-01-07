<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FinMate - Financial Management for Students</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        .status {
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }
        .status-item {
            margin: 8px 0;
            color: #2e7d32;
        }
        .status-item::before {
            content: "✓ ";
            font-weight: bold;
        }
        .api-info {
            background: #f5f5f5;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .api-endpoint {
            font-family: 'Courier New', monospace;
            background: #263238;
            color: #aed581;
            padding: 8px 12px;
            border-radius: 5px;
            display: block;
            margin: 5px 0;
            font-size: 0.9em;
        }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1em;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 5px;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 FinMate</h1>
        <p class="subtitle">Financial Management System - Java Backend</p>
        
        <div class="status">
            <div class="status-item">Backend Server Running</div>
            <div class="status-item">Database Connected</div>
            <div class="status-item">All APIs Available</div>
            <div class="status-item">CORS Enabled</div>
        </div>
        
        <div class="api-info">
            <h3 style="margin-bottom: 15px;">📡 Available API Endpoints:</h3>
            <code class="api-endpoint">POST /api/auth?action=register</code>
            <code class="api-endpoint">POST /api/auth?action=login</code>
            <code class="api-endpoint">GET  /api/auth?action=logout</code>
            <code class="api-endpoint">GET  /api/transactions</code>
            <code class="api-endpoint">POST /api/transactions</code>
            <code class="api-endpoint">GET  /api/budgets</code>
            <code class="api-endpoint">POST /api/budgets</code>
            <code class="api-endpoint">GET  /api/savings</code>
            <code class="api-endpoint">POST /api/savings</code>
            <code class="api-endpoint">GET  /api/dashboard</code>
        </div>
        
        <div>
            <a href="api/auth?action=check" class="btn">Test API</a>
            <a href="<%= request.getContextPath() %>/PANDUAN_RUNNING.md" class="btn">📖 Panduan</a>
        </div>
        
        <p style="margin-top: 30px; color: #999; font-size: 0.9em;">
            Built with Java, Servlets, JDBC & MySQL<br>
            Demonstrates: CRUD, Inheritance, Exception Handling, MVC, Interfaces
        </p>
    </div>
</body>
</html>
