package com.neusoft.hms.webapp.common.bean;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vacation")
public class Vacation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;
    @Column
    private String email;
    @Column
    private Timestamp applyTime;
    @Column
    private int vType;
    @Column
    private Timestamp vStart;
    @Column
    private Timestamp vEnd;
    @Column
    private int allDay;
    @Column
    private String reason;
    @Column
    private String contact;
    @Column
    private int status;
    @Column
    private String approverComment;
    @Column
    private String approverNumber;
    @Column
    private Timestamp approvalTime;

    public Vacation() {
    }

    public Vacation(String email, Timestamp applyTime, int vType, Timestamp vStart, Timestamp vEnd, int allDay,
                    String reason, String contact, int status, String approverComment, String approverNumber,
                    Timestamp approvalTime) {
        super();
        this.email = email;
        this.applyTime = applyTime;
        this.vType = vType;
        this.vStart = vStart;
        this.vEnd = vEnd;
        this.allDay = allDay;
        this.reason = reason;
        this.contact = contact;
        this.status = status;
        this.approverComment = approverComment;
        this.approverNumber = approverNumber;
        this.approvalTime = approvalTime;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public java.sql.Timestamp getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(java.sql.Timestamp applyTime) {
        this.applyTime = applyTime;
    }

    public int getVType() {
        return vType;
    }

    public void setVType(int vType) {
        this.vType = vType;
    }

    public java.sql.Timestamp getVStart() {
        return vStart;
    }

    public void setVStart(java.sql.Timestamp vStart) {
        this.vStart = vStart;
    }

    public java.sql.Timestamp getVEnd() {
        return vEnd;
    }

    public void setVEnd(java.sql.Timestamp vEnd) {
        this.vEnd = vEnd;
    }

    public long getAllDay() {
        return allDay;
    }

    public void setAllDay(int allDay) {
        this.allDay = allDay;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getApproverComment() {
        return approverComment;
    }

    public void setApproverComment(String approverComment) {
        this.approverComment = approverComment;
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
