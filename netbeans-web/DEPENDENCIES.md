# Required JAR Libraries untuk FinMate Backend

Download JAR files berikut dan letakkan di folder `netbeans-web/lib/`:

## Core Dependencies

### 1. MySQL JDBC Driver
- **File**: `mysql-connector-java-8.0.33.jar`
- **Download**: https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/
- **Purpose**: Database connectivity

### 2. Gson (JSON Processing)
- **File**: `gson-2.10.1.jar`
- **Download**: https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/
- **Purpose**: JSON serialization/deserialization

### 3. HikariCP (Connection Pooling)
- **File**: `HikariCP-5.0.1.jar`
- **Download**: https://repo1.maven.org/maven2/com/zaxxer/HikariCP/5.0.1/
- **Purpose**: Database connection pooling

### 4. SLF4J (Logging)
- **File**: `slf4j-api-2.0.7.jar`
- **Download**: https://repo1.maven.org/maven2/org/slf4j/slf4j-api/2.0.7/
- **Purpose**: Logging API

- **File**: `slf4j-simple-2.0.7.jar`
- **Download**: https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/2.0.7/
- **Purpose**: Simple logging implementation

### 5. jBCrypt (Password Hashing)
- **File**: `jbcrypt-0.4.jar`
- **Download**: https://repo1.maven.org/maven2/org/mindrot/jbcrypt/0.4/
- **Purpose**: BCrypt password hashing

### 6. Servlet API
- **File**: `javax.servlet-api-4.0.1.jar`
- **Download**: https://repo1.maven.org/maven2/javax/servlet/javax.servlet-api/4.0.1/
- **Purpose**: Servlet API (jika compile standalone, Tomcat sudah include ini)

### 7. JJWT (JWT Token - OPTIONAL tapi RECOMMENDED)
- **File**: `jjwt-api-0.11.5.jar`
- **Download**: https://repo1.maven.org/maven2/io/jsonwebtoken/jjwt-api/0.11.5/
- **Purpose**: JWT API

- **File**: `jjwt-impl-0.11.5.jar`
- **Download**: https://repo1.maven.org/maven2/io/jsonwebtoken/jjwt-impl/0.11.5/
- **Purpose**: JWT Implementation

- **File**: `jjwt-jackson-0.11.5.jar`
- **Download**: https://repo1.maven.org/maven2/io/jsonwebtoken/jjwt-jackson/0.11.5/
- **Purpose**: JWT Jackson integration

---

## Quick Download Commands

### PowerShell (Windows):
```powershell
# Create lib directory
New-Item -ItemType Directory -Force -Path "netbeans-web\lib"
cd netbeans-web\lib

# Download files (gunakan browser atau wget jika tersedia)
# Atau download manual dari links di atas
```

### Maven Alternative
Jika ingin pakai Maven, buat `pom.xml`:
```xml
<dependencies>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
        <version>5.0.1</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>2.0.7</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.7</version>
    </dependency>
    <dependency>
        <groupId>org.mindrot</groupId>
        <artifactId>jbcrypt</artifactId>
        <version>0.4</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

---

## Verification

Setelah download, verify struktur:
```
netbeans-web/lib/
├── mysql-connector-java-8.0.33.jar
├── gson-2.10.1.jar
├── HikariCP-5.0.1.jar
├── slf4j-api-2.0.7.jar
├── slf4j-simple-2.0.7.jar
├── jbcrypt-0.4.jar
├── javax.servlet-api-4.0.1.jar (optional)
├── jjwt-api-0.11.5.jar (optional)
├── jjwt-impl-0.11.5.jar (optional)
└── jjwt-jackson-0.11.5.jar (optional)
```

Total size: ~10-15 MB
