package com.rmsag.controller;

import com.rmsag.model.Result;
import com.rmsag.repository.ResultRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.rmsag.repository.StudentRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@Tag(name = "Results", description = "Manage student marks and results")
public class ResultController {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/me")
    @Operation(summary = "Get all results for the logged-in student")
    public ResponseEntity<List<Result>> getMyResults() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var student = studentRepository.findByUserId(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("Student profile not found"));
        return ResponseEntity.ok(resultRepository.findByStudentId(student.getId()));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get results for a specific student (Faculty/HoD)")
    public ResponseEntity<List<Result>> getStudentResults(
            @PathVariable UUID studentId,
            @RequestParam(required = false) UUID semesterId) {
        if (semesterId != null) {
            return ResponseEntity.ok(resultRepository.findByStudentIdAndSemesterId(studentId, semesterId));
        }
        return ResponseEntity.ok(resultRepository.findByStudentId(studentId));
    }

    @PostMapping
    @Operation(summary = "Add a new result entry (Faculty)")
    public ResponseEntity<Result> createResult(@RequestBody Result result) {
        Result saved = resultRepository.save(result);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a result entry (Faculty)")
    public ResponseEntity<Result> updateResult(@PathVariable UUID id, @RequestBody Result updated) {
        return resultRepository.findById(id)
            .map(r -> {
                r.setMarksObtained(updated.getMarksObtained());
                r.setIsAbsent(updated.getIsAbsent());
                return ResponseEntity.ok(resultRepository.save(r));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
