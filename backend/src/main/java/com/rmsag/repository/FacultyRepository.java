package com.rmsag.repository;

import com.rmsag.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, UUID> {
    Optional<Faculty> findByUserId(UUID userId);
    Optional<Faculty> findByEmployeeId(String employeeId);
    List<Faculty> findByBranchId(UUID branchId);
    List<Faculty> findByIsHodTrue();
}
