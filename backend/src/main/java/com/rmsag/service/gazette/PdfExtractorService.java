package com.rmsag.service.gazette;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

/**
 * PdfExtractorService — First step in the gazette reader pipeline.
 *
 * Since your college gazettes are digital PDFs with selectable text,
 * we can extract text directly using Apache PDFBox — no OCR needed.
 * This is fast, accurate, and 100% Java.
 *
 * NOTE: PDFBox 3.x API change — use Loader.loadPDF() instead of PDDocument.load()
 */
@Service
@Slf4j
public class PdfExtractorService {

    /**
     * Extracts all text content from a digital PDF gazette.
     *
     * @param fileStream InputStream of the PDF
     * @return Raw extracted text from all pages
     */
    public String extractText(InputStream fileStream) throws IOException {
        byte[] bytes = fileStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            int pageCount = document.getNumberOfPages();
            log.info("PDF loaded: {} pages", pageCount);

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);  // Maintain reading order (important for tables)
            stripper.setLineSeparator("\n");
            stripper.setWordSeparator(" ");

            String text = stripper.getText(document);
            log.info("Extracted {} characters from PDF", text.length());
            return text;
        }
    }

    /**
     * Extracts text page by page — useful for multi-student gazettes
     * where we need to locate a specific student's section.
     */
    public String extractPageText(InputStream fileStream, int startPage, int endPage) throws IOException {
        byte[] bytes = fileStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            stripper.setStartPage(startPage);
            stripper.setEndPage(endPage);
            return stripper.getText(document);
        }
    }

    /**
     * Returns total page count of the PDF.
     */
    public int getPageCount(InputStream fileStream) throws IOException {
        byte[] bytes = fileStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            return document.getNumberOfPages();
        }
    }
}
