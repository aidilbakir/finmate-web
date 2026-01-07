package com.finmate.util;

import com.finmate.exception.AuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Utility untuk generate dan validate JWT tokens
 * Updated for JJWT 0.12.3 API
 */
public class JwtUtil {
    
    // Load JWT secret dari .env
    private static final String SECRET_KEY = EnvUtil.get("JWT_SECRET", 
        "default-secret-key-please-change-this-in-production-must-be-at-least-32-characters");
    private static final long EXPIRATION_TIME = EnvUtil.getLong("JWT_EXPIRATION_MS", 86400000L); // 24 hours default
    
    // JJWT 0.12.3 uses SecretKey instead of Key
    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    
    /**
     * Generate JWT token untuk user
     * @param userId User ID
     * @param username Username
     * @return JWT token string
     */
    public static String generateToken(int userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        
        // JJWT 0.12.3 API
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)  // No need to specify algorithm, auto-detected
                .compact();
    }
    
    /**
     * Validate JWT token dan extract claims
     * @param token JWT token
     * @return Claims jika valid
     * @throws AuthenticationException jika token invalid atau expired
     */
    public static Claims validateToken(String token) throws AuthenticationException {
        try {
            // JJWT 0.12.3 API - parseClaimsJws renamed to parseSignedClaims
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new AuthenticationException("Token has expired");
        } catch (UnsupportedJwtException e) {
            throw new AuthenticationException("Unsupported JWT token");
        } catch (MalformedJwtException e) {
            throw new AuthenticationException("Invalid JWT token");
        } catch (io.jsonwebtoken.security.SignatureException e) {
            throw new AuthenticationException("Invalid JWT signature");
        } catch (IllegalArgumentException e) {
            throw new AuthenticationException("JWT token is empty");
        }
    }
    
    /**
     * Get user ID from token
     * @param token JWT token
     * @return User ID
     * @throws AuthenticationException jika invalid
     */
    public static int getUserIdFromToken(String token) throws AuthenticationException {
        Claims claims = validateToken(token);
        return claims.get("userId", Integer.class);
    }
    
    /**
     * Get username from token
     * @param token JWT token
     * @return Username
     * @throws AuthenticationException jika invalid
     */
    public static String getUsernameFromToken(String token) throws AuthenticationException {
        Claims claims = validateToken(token);
        return claims.get("username", String.class);
    }
    
    /**
     * Check if token is expired
     * @param token JWT token
     * @return true if expired
     */
    public static boolean isTokenExpired(String token) {
        try {
            Claims claims = validateToken(token);
            return claims.getExpiration().before(new Date());
        } catch (AuthenticationException e) {
            return true;
        }
    }
    
    /**
     * Extract token from Authorization header
     * @param authHeader Authorization header value (e.g., "Bearer token123")
     * @return Token string or null
     */
    public static String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
