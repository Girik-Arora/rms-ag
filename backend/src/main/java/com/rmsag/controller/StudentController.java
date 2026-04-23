package com.rmsag.controller;

import com.rmsag.model.Student;
import com.rmsag.repository.StudentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student profile management")
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping("/me")
    @Operation(summary = "Get the logged-in student's profile")
    public ResponseEntity<?> getMyProfile() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return studentRepository.findByUserId(UUID.fromString(userId))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "List all students (Faculty/HoD only)")
    public ResponseEntity<List<Student>> getAll(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String year) {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<Student> getById(@PathVariable UUID id) {
        return studentRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a student profile")
    public ResponseEntity<Student> create(@RequestBody Student student) {
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a student profile")
    public ResponseEntity<Student> update(@PathVariable UUID id, @RequestBody Student updated) {
        return studentRepository.findById(id)
            .map(s -> {
                s.setName(updated.getName());
                s.setPhone(updated.getPhone());
                s.setRollNo(updated.getRollNo());
                return ResponseEntity.ok(studentRepository.save(s));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
