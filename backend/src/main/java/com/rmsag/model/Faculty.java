package com.rmsag.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity @Table(name = "faculty")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Faculty {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "user_id") private UUID userId;
    @Column(nullable = false, length = 100) private String name;
    @Column(name = "employee_id", unique = true, length = 20) private String employeeId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "branch_id", nullable = false) private Branch branch;
    @Column(length = 80) private String designation;
    @Column(name = "is_hod") private Boolean isHod = false;
    @Column(name = "created_at") private OffsetDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = OffsetDateTime.now(); }
}
