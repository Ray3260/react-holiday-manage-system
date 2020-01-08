package com.neusoft.hms.webapp.common.bean;

import java.sql.Timestamp;

public class OvertimeInfo {

	private String name;
	
	private Timestamp applyTime;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private int isAllDay;
	
	private String reason;
	
	private int status;
	
	public OvertimeInfo() {
		
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Timestamp getApplyTime() {
		return applyTime;
	}

	public void setApplyTime(Timestamp applyTime) {
		this.applyTime = applyTime;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public int getIsAllDay() {
		return isAllDay;
	}

	public void setIsAllDay(int isAllDay) {
		this.isAllDay = isAllDay;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
}
