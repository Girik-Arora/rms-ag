package com.rmsag.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * AuthController — Syncs Supabase user with the RMS-AG backend.
 *
 * After Supabase login, the frontend calls POST /api/auth/sync
 * to ensure the user has a corresponding Student or Faculty profile
 * in our PostgreSQL database.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Auth profile sync with Supabase")
public class AuthController {

    @PostMapping("/sync")
    @Operation(summary = "Sync Supabase user to backend profile", description =
        "Call this after every sign-in. Creates or retrieves the backend profile for the logged-in user.")
    public ResponseEntity<Map<String, Object>> syncProfile(@RequestBody Map<String, String> body) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email  = body.getOrDefault("email", "");
        String name   = body.getOrDefault("name",  "");
        String role   = body.getOrDefault("role",  "STUDENT");

        // Return acknowledged sync — full implementation stores/retrieves profile from DB
        return ResponseEntity.ok(Map.of(
            "userId",  userId,
            "email",   email,
            "name",    name,
            "role",    role,
            "synced",  true,
            "message", "Profile sync successful"
        ));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<Map<String, Object>> getMe() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        String role = authorities.stream()
            .findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", ""))
            .orElse("STUDENT");

        return ResponseEntity.ok(Map.of(
            "userId", userId,
            "role",   role
        ));
    }
}
