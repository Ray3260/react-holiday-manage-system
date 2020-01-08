package com.neusoft.hms.webapp.common.service;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neusoft.hms.webapp.common.bean.Project;
import com.neusoft.hms.webapp.common.repository.ProjectRepository;

@Service
public class ProjectService {
	@Resource
    private ProjectRepository projectRepository;
	//查找所有项目组信息
	public List<Project> findAll() {
        return projectRepository.findAll();
    }
	
	//按项目编号查找项目信息
	public Project findByPNumber(String pNumber) {
		return projectRepository.findByPNumber(pNumber);
	}
	
	//保存项目信息
    @Transactional(rollbackFor = SQLException.class)
    public List<Project> insertProjectInfos(List<Project> vacation) {
        return projectRepository.saveAll(vacation);
    }
    
    // 根据项目编号查找id
    public int findIdByPNumber(String pNumber) {
    	return projectRepository.findIdByPNumber(pNumber);
    }
    
    @Transactional
    // 根据id删除项目
    public void deleteById(int id) {
    	projectRepository.deleteById(id);
    }
}
