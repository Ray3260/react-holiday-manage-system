package com.neusoft.hms.webapp.common.bean;

public class ExportEntryParam {
    private String searchEmail;
    private int vacationType;
    private String searchYear;
	public String getSearchEmail() {
		return searchEmail;
	}
	public void setSearchEmail(String searchEmail) {
		this.searchEmail = searchEmail;
	}
	public int getVacationType() {
		return vacationType;
	}
	public void setVacationType(int vacationType) {
		this.vacationType = vacationType;
	}
	public String getSearchYear() {
		return searchYear;
	}
	public void setSearchYear(String searchYear) {
		this.searchYear = searchYear;
	}
}
