package com.rmsag.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * JWT Auth Filter — validates Supabase-issued JWT tokens.
 *
 * Supabase signs JWTs using your project's JWT secret (HS256).
 * This filter:
 *   1. Extracts the Bearer token from the Authorization header
 *   2. Validates signature, expiry, and issuer
 *   3. Extracts user ID (sub) and role from claims
 *   4. Sets Spring Security context
 */
@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final SecretKey secretKey;

    public JwtAuthFilter(@Value("${supabase.jwt.secret}") String jwtSecret) {
        // Supabase uses the raw secret string encoded as bytes
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

            String userId = claims.getSubject();

            // Extract role from Supabase user_metadata or app_metadata
            String role = extractRole(claims);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (ExpiredJwtException e) {
            log.warn("JWT expired for request: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Token expired\"}");
            return;
        } catch (JwtException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Invalid token\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract role from Supabase JWT claims.
     * Checks: user_metadata.role → app_metadata.role → defaults to STUDENT
     */
    @SuppressWarnings("unchecked")
    private String extractRole(Claims claims) {
        try {
            var userMeta = (java.util.Map<String, Object>) claims.get("user_metadata");
            if (userMeta != null && userMeta.containsKey("role")) {
                return String.valueOf(userMeta.get("role")).toUpperCase();
            }
            var appMeta = (java.util.Map<String, Object>) claims.get("app_metadata");
            if (appMeta != null && appMeta.containsKey("role")) {
                return String.valueOf(appMeta.get("role")).toUpperCase();
            }
        } catch (Exception e) {
            log.warn("Could not extract role from JWT claims, defaulting to STUDENT");
        }
        return "STUDENT";
    }
}
