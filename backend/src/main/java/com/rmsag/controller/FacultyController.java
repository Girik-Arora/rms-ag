package com.rmsag.controller;

import com.rmsag.model.Faculty;
import com.rmsag.repository.FacultyRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@Tag(name = "Faculty", description = "Faculty profile and subject assignments")
public class FacultyController {

    private final FacultyRepository facultyRepository;

    @GetMapping("/me")
    @Operation(summary = "Get the logged-in faculty's profile")
    public ResponseEntity<?> getMyProfile() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return facultyRepository.findByUserId(UUID.fromString(userId))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get faculty by ID")
    public ResponseEntity<Faculty> getById(@PathVariable UUID id) {
        return facultyRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
