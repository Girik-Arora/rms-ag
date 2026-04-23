package com.rmsag.service.gazette;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * MarksParserService — The intelligent parsing layer of the gazette reader.
 *
 * Uses regex patterns calibrated for Mumbai University gazette format to extract:
 *   - Student name and enrollment/seat number
 *   - Subject codes and names
 *   - ISE-1, ISE-2, ISE-3/IE marks
 *   - ESE marks
 *   - Total marks, grade, pass/fail
 *   - SGPA and CGPA
 *
 * Works on the raw text extracted by PdfExtractorService.
 */
@Service
@Slf4j
public class MarksParserService {

    // ─── Enrollment / Seat Number Patterns ──────────────────────────────────
    // Handles: EN21IT001, 21IT001, seat numbers like 12345
    private static final Pattern ENROLLMENT_PATTERN = Pattern.compile(
        "(?:enrollment\\s*(?:no\\.?|number)?\\s*[:\\-]?\\s*|seat\\s*no\\.?\\s*[:\\-]?\\s*)" +
        "([A-Z]{0,4}\\d{2}[A-Z]{2,4}\\d{2,4}|\\d{5,10})",
        Pattern.CASE_INSENSITIVE
    );

    // ─── Student Name Pattern ────────────────────────────────────────────────
    private static final Pattern NAME_PATTERN = Pattern.compile(
        "(?:student\\s*name|name)\\s*[:\\-]?\\s*([A-Z][A-Z\\s]{2,50})",
        Pattern.CASE_INSENSITIVE
    );

    // ─── Subject Code Pattern ────────────────────────────────────────────────
    // Covers: ITC501, FEC101, ITE501, etc.
    private static final Pattern SUBJECT_CODE_PATTERN = Pattern.compile(
        "\\b([A-Z]{2,4}[CLT]?\\d{3})\\b"
    );

    // ─── Marks Row Pattern ───────────────────────────────────────────────────
    // Captures rows like: ITC501 | 22 | 20 | - | 71 | 113 | A | P
    private static final Pattern MARKS_ROW_PATTERN = Pattern.compile(
        "([A-Z]{2,4}[CLT]?\\d{3})[\\s|]+([\\d-]+)[\\s|]+([\\d-]+)[\\s|]*([\\d-]*)[\\s|]+([\\d-]+)[\\s|]+([\\d-]+)[\\s|]+([OA+BC-Ff]+)[\\s|]+([PFpf])",
        Pattern.CASE_INSENSITIVE
    );

    // ─── SGPA Pattern ────────────────────────────────────────────────────────
    private static final Pattern SGPA_PATTERN = Pattern.compile(
        "(?:SGPA|S\\.G\\.P\\.A)\\s*[:\\-=]?\\s*(\\d{1,2}\\.\\d{1,2})",
        Pattern.CASE_INSENSITIVE
    );

    // ─── CGPA Pattern ────────────────────────────────────────────────────────
    private static final Pattern CGPA_PATTERN = Pattern.compile(
        "(?:CGPA|C\\.G\\.P\\.A)\\s*[:\\-=]?\\s*(\\d{1,2}\\.\\d{1,2})",
        Pattern.CASE_INSENSITIVE
    );

    // ─── Result Pattern ──────────────────────────────────────────────────────
    private static final Pattern RESULT_PATTERN = Pattern.compile(
        "(?:result|final\\s*result)\\s*[:\\-]?\\s*(PASS|FAIL|ATKT|ABSENT)",
        Pattern.CASE_INSENSITIVE
    );

    // ─── Grade-only subjects (Internship/Industry Practice) ──────────────────
    private static final Pattern GRADE_ONLY_PATTERN = Pattern.compile(
        "(?:summer\\s*internship|industry\\s*practice)[\\s\\S]{0,50}?grade[\\s:]*([OABCFoabcf][+]?)",
        Pattern.CASE_INSENSITIVE
    );

    public record ExtractedMarks(
        String enrollmentNo,
        String studentName,
        String branch,
        String semester,
        List<SubjectResult> subjects,
        BigDecimal sgpa,
        BigDecimal cgpa,
        String overallResult,
        double confidenceScore
    ) {}

    public record SubjectResult(
        String subjectCode,
        String subjectName,
        Integer ise1,
        Integer ise2,
        Integer ise3,
        Integer ese,
        Integer total,
        Integer maxMarks,
        String grade,
        boolean pass,
        boolean isGradeOnly
    ) {}

    /**
     * Main parsing method — orchestrates all regex extractors.
     */
    public ExtractedMarks parse(String pdfText) {
        log.info("Starting marks extraction from {} characters of text", pdfText.length());

        String enrollmentNo  = extractEnrollment(pdfText);
        String studentName   = extractStudentName(pdfText);
        BigDecimal sgpa      = extractDecimal(SGPA_PATTERN, pdfText);
        BigDecimal cgpa      = extractDecimal(CGPA_PATTERN, pdfText);
        String overallResult = extractResult(pdfText);
        List<SubjectResult> subjects = extractSubjectResults(pdfText);

        double confidence = calculateConfidence(enrollmentNo, studentName, subjects, sgpa);

        log.info("Extraction complete: {} subjects, confidence: {}%", subjects.size(), confidence);

        return new ExtractedMarks(
            enrollmentNo, studentName, null, null,
            subjects, sgpa, cgpa, overallResult, confidence
        );
    }

    private String extractEnrollment(String text) {
        Matcher m = ENROLLMENT_PATTERN.matcher(text);
        return m.find() ? m.group(1).toUpperCase().trim() : null;
    }

    private String extractStudentName(String text) {
        Matcher m = NAME_PATTERN.matcher(text);
        if (m.find()) {
            return m.group(1).trim()
                   .replaceAll("\\s{2,}", " ")
                   .toUpperCase();
        }
        return null;
    }

    private BigDecimal extractDecimal(Pattern pattern, String text) {
        Matcher m = pattern.matcher(text);
        if (m.find()) {
            try { return new BigDecimal(m.group(1)); }
            catch (NumberFormatException e) { /* ignore */ }
        }
        return null;
    }

    private String extractResult(String text) {
        Matcher m = RESULT_PATTERN.matcher(text);
        return m.find() ? m.group(1).toUpperCase() : "UNKNOWN";
    }

    private List<SubjectResult> extractSubjectResults(String text) {
        List<SubjectResult> results = new ArrayList<>();
        Matcher m = MARKS_ROW_PATTERN.matcher(text);

        while (m.find()) {
            try {
                String code  = m.group(1);
                Integer ise1 = parseMarks(m.group(2));
                Integer ise2 = parseMarks(m.group(3));
                Integer ise3 = parseMarks(m.group(4));
                Integer ese  = parseMarks(m.group(5));
                Integer total = parseMarks(m.group(6));
                String grade = m.group(7).trim().toUpperCase();
                boolean pass = m.group(8).equalsIgnoreCase("P");

                // Determine max marks: if ese is around 100, total could be 150 or 125
                int maxMarks = (total != null && total > 125) ? 150 : 125;

                results.add(new SubjectResult(
                    code, null, ise1, ise2, ise3, ese, total, maxMarks, grade, pass, false
                ));
            } catch (Exception e) {
                log.warn("Could not parse marks row: {}", m.group(0));
            }
        }

        // Also check for grade-only subjects (internship etc.)
        Matcher gm = GRADE_ONLY_PATTERN.matcher(text);
        if (gm.find()) {
            results.add(new SubjectResult(
                "INTERNSHIP", "Summer Internship",
                null, null, null, null, null, null,
                gm.group(1).toUpperCase(), !gm.group(1).equalsIgnoreCase("F"),
                true
            ));
        }

        return results;
    }

    private Integer parseMarks(String s) {
        if (s == null || s.isBlank() || s.equals("-")) return null;
        try { return Integer.parseInt(s.trim()); }
        catch (NumberFormatException e) { return null; }
    }

    /**
     * Calculate confidence score based on successfully extracted fields.
     * 0–100% where 100% = all fields found with consistent data.
     */
    private double calculateConfidence(String enrollment, String name,
                                        List<SubjectResult> subjects, BigDecimal sgpa) {
        double score = 0;
        if (enrollment != null) score += 25;
        if (name != null) score += 15;
        if (!subjects.isEmpty()) score += Math.min(40.0, subjects.size() * 8.0);
        if (sgpa != null) score += 20;
        // Penalize if subjects have many null marks
        long nullMarks = subjects.stream()
            .filter(s -> !s.isGradeOnly() && s.total() == null).count();
        score -= nullMarks * 3;
        return Math.max(0, Math.min(100, score));
    }
}
