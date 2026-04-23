package com.rmsag.controller;

import com.rmsag.repository.ResultRepository;
import com.rmsag.repository.StudentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "HoD analytics and reports")
public class ReportController {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/branch/{branchId}/summary")
    @Operation(summary = "Get branch-level result summary")
    public ResponseEntity<Map<String, Object>> getBranchSummary(@PathVariable UUID branchId) {
        long total  = studentRepository.count();
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("branchId",      branchId);
        summary.put("totalStudents", total);
        summary.put("message",       "Full analytics available once marks are entered");
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/pass-fail")
    @Operation(summary = "Get pass/fail statistics")
    public ResponseEntity<Map<String, Object>> getPassFail(
            @RequestParam(required = false) UUID branchId,
            @RequestParam(required = false) UUID semesterId) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("passed", 0);
        stats.put("failed", 0);
        stats.put("atkt",   0);
        return ResponseEntity.ok(stats);
    }
}
