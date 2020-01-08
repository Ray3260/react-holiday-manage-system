package com.neusoft.hms.webapp.common.bean;

import java.util.Date;

public class UsedVacationInfo {
    
    private String name;
    
    private Date applyTime;
    
    private String dateTime;
    
    private float dateLength;
    
    private String tele;

	private String note;
    
    private String comment;
    
    private int result;

	public UsedVacationInfo() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getApplyTime() {
		return applyTime;
	}

	public void setApplyTime(Date applyTime) {
		this.applyTime = applyTime;
	}

	public String getDateTime() {
		return dateTime;
	}

	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}

	public float getDateLength() {
		return dateLength;
	}

	public void setDateLength(float dateLength) {
		this.dateLength = dateLength;
	}

	public String getTele() {
		return tele;
	}

	public void setTele(String tele) {
		this.tele = tele;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public int getResult() {
		return result;
	}

	public void setResult(int result) {
		this.result = result;
	}

}
