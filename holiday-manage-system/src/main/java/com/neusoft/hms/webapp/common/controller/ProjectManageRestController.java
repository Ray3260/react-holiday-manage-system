package com.neusoft.hms.webapp.common.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.bean.Project;
import com.neusoft.hms.webapp.common.bean.ProjectInfo;
import com.neusoft.hms.webapp.common.service.ProjectService;

@RestController
public class ProjectManageRestController {
	
	@Autowired
	private ProjectService projectService_;
	
	// 获取全部项目信息
	@GetMapping("/project-info")
	public List<ProjectInfo> getProjectInfoList() {
		List<Project> projectList = projectService_.findAll();
		List<ProjectInfo> projectInfoList = projectList.stream().map(item -> {
			return new ProjectInfo(item.getpNumber(), item.getpName());
		}).collect(Collectors.toList());
		return projectInfoList;
	}
	
	//根据项目编号查找项目信息
	@GetMapping("/project-info-byPNumber")
	public Boolean getProjectInfoBypNumber(@RequestParam List<String> pNumbers) {
		if(pNumbers != null) {
			return false;
		}
		for(String pNumber : pNumbers) {
			if(projectService_.findByPNumber(pNumber) == null) {
				return false;
			}
		}
		return true;
	}
	
	// 插入新增项目
	@PostMapping("/save-project-info")
	public String saveProjectInfo(@RequestBody List<Map<String, String>> projectInfos) {
		List<Project> projects = projectInfos.stream().map(item -> {
			return new Project(item.get("pNumber"), item.get("pName"));
		}).collect(Collectors.toList());
		projectService_.insertProjectInfos(projects);
		return "保存成功";
	}
	
	// 删除项目
	@PostMapping("/delete-project-info")
	public String deleteProjectInfo(@RequestBody List<String> projectInfos) {
		List<Integer> idList = projectInfos.stream().map(item -> {
			return projectService_.findIdByPNumber(item);
		}).collect(Collectors.toList());
		idList.forEach(item -> {
			projectService_.deleteById(item);
		});
		return "删除成功";
	}
}
