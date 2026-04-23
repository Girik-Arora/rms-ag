package com.rmsag.repository;

import com.rmsag.model.GazetteJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface GazetteJobRepository extends JpaRepository<GazetteJob, UUID> {
    List<GazetteJob> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
}
