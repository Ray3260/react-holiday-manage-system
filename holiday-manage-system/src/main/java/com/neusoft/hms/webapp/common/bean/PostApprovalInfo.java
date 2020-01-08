package com.neusoft.hms.webapp.common.bean;

public class PostApprovalInfo {

    private String email;
    private String type;
    private String time;
    private String days;
    private String approval_reason;
    private String status;
    private String admin;
    private long date;

    public PostApprovalInfo() {
    }

    public PostApprovalInfo(String email, String type, String time, String days, String approval_reason, String status, String admin, long date) {
        this.email = email;
        this.type = type;
        this.time = time;
        this.days = days;
        this.approval_reason = approval_reason;
        this.status = status;
        this.admin = admin;
        this.date = date;
    }

    public String getEmail() {
        return email;
    }

    public String getType() {
        return type;
    }

    public String getTime() {
        return time;
    }

    public String getDays() {
        return days;
    }

    public String getApproval_reason() {
        return approval_reason;
    }

    public String getStatus() {
        return status;
    }

    public String getAdmin() {
        return admin;
    }

    public long getDate() {
        return date;
    }
}
