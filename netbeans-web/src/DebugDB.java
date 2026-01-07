
import com.finmate.config.DatabaseConfig;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class DebugDB {
    public static void main(String[] args) {
        System.out.println("=== DEBUGGING DATABASE CONTENT ===");
        
        try (Connection conn = DatabaseConfig.getConnection()) {
            Statement stmt = conn.createStatement();
            
            // 1. Cek User yang ada
            System.out.println("\n1. LIST USERS:");
            ResultSet rs = stmt.executeQuery("SELECT id, username, email FROM users");
            while(rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + " | Username: " + rs.getString("username"));
            }
            
            // 2. Cek Transaksi per User
            System.out.println("\n2. TRANSACTION COUNTS PER USER:");
            rs = stmt.executeQuery("SELECT user_id, COUNT(*) as total FROM transactions GROUP BY user_id");
            while(rs.next()) {
                System.out.println("User ID: " + rs.getInt("user_id") + " has " + rs.getInt("total") + " transactions");
            }
            
            // 3. Cek Sample Data spesifik
            System.out.println("\n3. SAMPLE DATA CHECK:");
            rs = stmt.executeQuery("SELECT id, user_id, description FROM transactions WHERE description LIKE '%Indomaret%' OR description LIKE '%Salary%' LIMIT 3");
            while(rs.next()) {
                System.out.println("Found Sample Data [ID=" + rs.getInt("id") + "] linked to User ID: " + rs.getInt("user_id") + " (" + rs.getString("description") + ")");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
