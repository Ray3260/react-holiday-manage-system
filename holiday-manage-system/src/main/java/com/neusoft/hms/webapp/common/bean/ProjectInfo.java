package com.neusoft.hms.webapp.common.bean;

public class ProjectInfo {
	private String projectNumber;
	
	private String projectName;
	
	public ProjectInfo(String pNumber, String pName) {
		this.projectName = pName;
		this.projectNumber = pNumber;
	}

	public String getProjectNumber() {
		return projectNumber;
	}

	public void setProjectNumber(String projectNumber) {
		this.projectNumber = projectNumber;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
}
