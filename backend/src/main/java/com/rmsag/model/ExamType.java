package com.rmsag.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity @Table(name = "exam_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExamType {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true, length = 30) private String name; // ISE-1, ISE-2, ISE-3/IE, ESE
    @Column(name = "max_marks") private Integer maxMarks; // null = grade-based
}
