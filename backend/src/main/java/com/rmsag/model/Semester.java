package com.rmsag.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity @Table(name = "semesters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Semester {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "semester_number", nullable = false) private Integer semesterNumber; // 1-8
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "academic_year_id") private AcademicYear academicYear;
    @Column(name = "semester_type", length = 10) private String semesterType; // ODD | EVEN
}
