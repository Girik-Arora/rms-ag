package com.rmsag.controller;

import com.rmsag.model.GazetteJob;
import com.rmsag.model.Student;
import com.rmsag.repository.StudentRepository;
import com.rmsag.service.GazetteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/gazette")
@RequiredArgsConstructor
@Tag(name = "Gazette Reader", description = "Upload and process gazette PDFs to extract marks automatically")
public class GazetteController {

    private final GazetteService gazetteService;
    private final StudentRepository studentRepository;

    /**
     * Upload a gazette PDF for processing.
     * Creates a job and processes asynchronously.
     * Returns the job ID immediately — client polls for status.
     */
    @PostMapping("/upload")
    @Operation(summary = "Upload gazette PDF", description = "Upload a gazette PDF. Processing is async — poll /jobs/{jobId} for status.")
    public ResponseEntity<?> uploadGazette(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }
        if (!file.getContentType().equals("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are accepted"));
        }

        Student student = getCurrentStudent();
        GazetteJob job = gazetteService.initiateProcessing(file, student);

        return ResponseEntity.ok(Map.of(
            "jobId",  job.getId(),
            "status", job.getStatus(),
            "message", "Processing started. Poll /api/gazette/jobs/" + job.getId() + " for status."
        ));
    }

    /**
     * Poll gazette job status.
     */
    @GetMapping("/jobs/{jobId}")
    @Operation(summary = "Get gazette job status")
    public ResponseEntity<?> getJobStatus(@PathVariable UUID jobId) {
        return gazetteService.getJob(jobId)
            .map(job -> ResponseEntity.ok(Map.of(
                "jobId",          job.getId(),
                "status",         job.getStatus(),
                "fileName",       job.getFileName() != null ? job.getFileName() : "",
                "confidenceScore", job.getConfidenceScore(),
                "createdAt",      job.getCreatedAt(),
                "completedAt",    job.getCompletedAt(),
                "error",          job.getErrorMessage() != null ? job.getErrorMessage() : ""
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get full extraction result for a completed job.
     */
    @GetMapping("/jobs/{jobId}/result")
    @Operation(summary = "Get extracted marks from completed gazette job")
    public ResponseEntity<?> getJobResult(@PathVariable UUID jobId) {
        return gazetteService.getJob(jobId)
            .map(job -> {
                if (!"COMPLETED".equals(job.getStatus())) {
                    return ResponseEntity.ok(Map.of(
                        "status", job.getStatus(),
                        "message", "Job not yet completed"
                    ));
                }
                return ResponseEntity.ok(job.getExtractedData());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all gazette jobs for the current student.
     */
    @GetMapping("/jobs/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get all gazette jobs for current student")
    public ResponseEntity<List<GazetteJob>> getMyJobs() {
        Student student = getCurrentStudent();
        return ResponseEntity.ok(gazetteService.getStudentJobs(student.getId()));
    }

    private Student getCurrentStudent() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return studentRepository.findByUserId(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("Student profile not found. Please sync your profile first."));
    }
}
