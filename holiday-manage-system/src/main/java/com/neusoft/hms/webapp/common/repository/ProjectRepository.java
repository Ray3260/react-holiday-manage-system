package com.neusoft.hms.webapp.common.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.neusoft.hms.webapp.common.bean.Overtime;
import com.neusoft.hms.webapp.common.bean.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
	
	List<Project> findAll();
	
	// 根据pNumber查找project
	@Query(value = "SELECT * FROM project where p_number = ?1", nativeQuery = true)
	Project findByPNumber(String pNumber);
	
	// 根据id删除项目
    @Modifying
    @Query(value = "DELETE FROM project where id = ?1", nativeQuery = true)
    void deleteById(int id);
    
    // 查找项目id
	@Query(value = "SELECT id FROM project where p_number = ?1", nativeQuery = true)
	int findIdByPNumber(String pNumber);
}
