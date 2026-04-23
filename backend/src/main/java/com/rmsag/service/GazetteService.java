package com.rmsag.service;

import com.rmsag.model.GazetteJob;
import com.rmsag.model.Student;
import com.rmsag.repository.GazetteJobRepository;
import com.rmsag.service.gazette.MarksParserService;
import com.rmsag.service.gazette.PdfExtractorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * GazetteService — Orchestrates the complete gazette reading pipeline.
 *
 * Flow:
 * 1. Receive PDF upload → save job as PENDING
 * 2. Trigger async processing
 * 3. PdfExtractorService extracts text (PDFBox)
 * 4. MarksParserService parses marks (Regex + OpenNLP)
 * 5. Store structured JSON result → mark COMPLETED
 * 6. Frontend polls /gazette/jobs/{id} for status
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class GazetteService {

    private final GazetteJobRepository gazetteJobRepository;
    private final PdfExtractorService pdfExtractorService;
    private final MarksParserService marksParserService;

    /**
     * Creates a gazette job and triggers async processing.
     */
    public GazetteJob initiateProcessing(MultipartFile file, Student student) {
        GazetteJob job = GazetteJob.builder()
            .student(student)
            .fileName(file.getOriginalFilename())
            .status("PENDING")
            .build();
        job = gazetteJobRepository.save(job);

        // Trigger async processing — returns immediately to caller
        processAsync(job.getId(), file);
        return job;
    }

    /**
     * Asynchronous gazette processing pipeline.
     * Runs in Spring's async thread pool (@EnableAsync on main class).
     */
    @Async
    public void processAsync(UUID jobId, MultipartFile file) {
        log.info("Starting async gazette processing for job: {}", jobId);

        GazetteJob job = gazetteJobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        try {
            // Update status to PROCESSING
            job.setStatus("PROCESSING");
            gazetteJobRepository.save(job);

            // ── Step 1: Extract text from PDF ──────────────────────────
            log.info("[Job {}] Step 1: Extracting text from PDF", jobId);
            String pdfText = pdfExtractorService.extractText(file.getInputStream());

            if (pdfText.isBlank()) {
                throw new RuntimeException("PDF appears to be empty or image-based. Only digital PDFs are supported.");
            }

            // ── Step 2: Parse marks from extracted text ─────────────────
            log.info("[Job {}] Step 2: Parsing marks", jobId);
            MarksParserService.ExtractedMarks extracted = marksParserService.parse(pdfText);

            // ── Step 3: Build structured JSON result ────────────────────
            log.info("[Job {}] Step 3: Building result JSON", jobId);
            Map<String, Object> result = buildResultMap(extracted);

            // ── Step 4: Store results & mark COMPLETED ──────────────────
            job.setStatus("COMPLETED");
            job.setExtractedData(result);
            job.setConfidenceScore(new java.math.BigDecimal(extracted.confidenceScore())
                .setScale(2, java.math.RoundingMode.HALF_UP));
            job.setCompletedAt(OffsetDateTime.now());
            gazetteJobRepository.save(job);

            log.info("[Job {}] COMPLETED with confidence: {}%", jobId, extracted.confidenceScore());

        } catch (Exception e) {
            log.error("[Job {}] FAILED: {}", jobId, e.getMessage());
            job.setStatus("FAILED");
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(OffsetDateTime.now());
            gazetteJobRepository.save(job);
        }
    }

    private Map<String, Object> buildResultMap(MarksParserService.ExtractedMarks extracted) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("studentName",   extracted.studentName());
        result.put("enrollmentNo",  extracted.enrollmentNo());
        result.put("semester",      extracted.semester());
        result.put("branch",        extracted.branch());
        result.put("overallResult", extracted.overallResult());
        result.put("sgpa",          extracted.sgpa());
        result.put("cgpa",          extracted.cgpa());
        result.put("confidenceScore", extracted.confidenceScore());

        List<Map<String, Object>> subjectList = new ArrayList<>();
        for (var s : extracted.subjects()) {
            Map<String, Object> sub = new LinkedHashMap<>();
            sub.put("subjectCode",  s.subjectCode());
            sub.put("subjectName",  s.subjectName());
            sub.put("ise1",         s.ise1());
            sub.put("ise2",         s.ise2());
            sub.put("ise3",         s.ise3());
            sub.put("ese",          s.ese());
            sub.put("total",        s.total());
            sub.put("maxMarks",     s.maxMarks());
            sub.put("grade",        s.grade());
            sub.put("pass",         s.pass());
            sub.put("isGradeOnly",  s.isGradeOnly());
            subjectList.add(sub);
        }
        result.put("subjects", subjectList);
        return result;
    }

    public Optional<GazetteJob> getJob(UUID jobId) {
        return gazetteJobRepository.findById(jobId);
    }

    public List<GazetteJob> getStudentJobs(UUID studentId) {
        return gazetteJobRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }
}
