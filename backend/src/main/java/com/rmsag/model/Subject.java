package com.rmsag.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity @Table(name = "subjects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subject {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, length = 20) private String code;
    @Column(nullable = false, length = 150) private String name;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "branch_id", nullable = false) private Branch branch;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "semester_id", nullable = false) private Semester semester;
    @Column(name = "total_marks", nullable = false) private Integer totalMarks; // 150 or 125
    @Column(name = "subject_type", length = 30) private String subjectType; // THEORY | LAB | INTERNSHIP | INDUSTRY_PRACTICE
    @Column(nullable = false) private Integer credits;
}
