package com.neusoft.hms.webapp.common.bean;

public class ApprovalEmployee {
    private String name;
    private String year;
    private String email;
    private String type;
    private String times;
    private String days;
    private String contact;
    private String reason;
    private String approverComment;
    private String status;

    public ApprovalEmployee() {
    }

    public ApprovalEmployee(String name, String year, String email, String type, String times, String days,
                            String contact, String reason, String approverComment, String status) {
        this.name = name;
        this.year = year;
        this.email = email;
        this.type = type;
        this.times = times;
        this.days = days;
        this.contact = contact;
        this.reason = reason;
        this.approverComment = approverComment;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTimes() {
        return times;
    }

    public void setTimes(String times) {
        this.times = times;
    }

    public String getDays() {
        return days;
    }

    public void setDays(String days) {
        this.days = days;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getApproverComment() {
        return approverComment;
    }

    public void setApproverComment(String approverComment) {
        this.approverComment = approverComment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
