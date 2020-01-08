package com.neusoft.hms.webapp.common.bean;

import javax.persistence.*;

@Entity
@Table(name = "Overtime")
public class Overtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;
    @Column
    private String email;
    @Column
    private java.sql.Timestamp oStart;
    @Column
    private java.sql.Timestamp oEnd;
    @Column
    private int allDay;
    @Column
    private java.sql.Timestamp applyTime;
    @Column
    private String remark;
    @Column
    private String project;
    @Column
    private long status;
    @Column
    private String approverNumber;
    @Column
    private java.sql.Timestamp approvalTime;

    public Overtime() {
    }

    public Overtime(String email, java.sql.Timestamp oStart, java.sql.Timestamp oEnd, int allDay,
                    java.sql.Timestamp applyTime, String remark, String project, long status,
                    String approverNumber, java.sql.Timestamp approvalTime) {
        super();
        this.email = email;
        this.oStart = oStart;
        this.oEnd = oEnd;
        this.allDay = allDay;
        this.applyTime = applyTime;
        this.remark = remark;
        this.project = project;
        this.status = status;
        this.approverNumber = approverNumber;
        this.approvalTime = approvalTime;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public java.sql.Timestamp getOStart() {
        return oStart;
    }

    public void setOStart(java.sql.Timestamp oStart) {
        this.oStart = oStart;
    }


    public java.sql.Timestamp getOEnd() {
        return oEnd;
    }

    public void setOEnd(java.sql.Timestamp oEnd) {
        this.oEnd = oEnd;
    }

    public int getAllDay() { return allDay; }

    public void setAllDay(int allDay) { this.allDay = allDay; }

    public java.sql.Timestamp getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(java.sql.Timestamp applyTime) {
        this.applyTime = applyTime;
    }


    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }


    public long getStatus() {
        return status;
    }

    public void setStatus(long status) {
        this.status = status;
    }


    public String getApproverNumber() {
        return approverNumber;
    }

    public void setApproverNumber(String approverNumber) {
        this.approverNumber = approverNumber;
    }


    public java.sql.Timestamp getApprovalTime() {
        return approvalTime;
    }

    public void setApprovalTime(java.sql.Timestamp approvalTime) {
        this.approvalTime = approvalTime;
    }

}
