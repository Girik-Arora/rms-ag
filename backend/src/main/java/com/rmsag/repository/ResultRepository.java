package com.rmsag.repository;

import com.rmsag.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ResultRepository extends JpaRepository<Result, UUID> {

    List<Result> findByStudentId(UUID studentId);

    @Query("""
        SELECT r FROM Result r
        JOIN r.subject s
        WHERE r.student.id = :studentId
        AND s.semester.id = :semesterId
        ORDER BY s.code
    """)
    List<Result> findByStudentIdAndSemesterId(UUID studentId, UUID semesterId);

    @Query("""
        SELECT r FROM Result r
        JOIN r.subject s
        WHERE s.id = :subjectId
        AND r.examType.id = :examTypeId
    """)
    List<Result> findBySubjectIdAndExamTypeId(UUID subjectId, UUID examTypeId);
}
