package com.neusoft.hms.webapp.common.bean;

import java.util.List;

public class EmailSendInfo {
    // 发件人邮箱
    private String sendAddr;
    // 发件人邮箱密码
    private String password;
    // 收件人邮箱
    private String receiveAddr;
    // 抄送人员邮箱
    private List<String> ccAddrs;
    // 发送邮件的标题
    private String title;
    // 发送邮件的内容
    private String comment;

    public EmailSendInfo(String sendAddr, String password, String receiveAddr, List<String> ccAddrs, String title,
            String comment) {
        super();
        this.sendAddr = sendAddr;
        this.password = password;
        this.receiveAddr = receiveAddr;
        this.ccAddrs = ccAddrs;
        this.title = title;
        this.comment = comment;
    }
    public String getSendAddr() {
        return sendAddr;
    }
    public void setSendAddr(String sendAddr) {
        this.sendAddr = sendAddr;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getReceiveAddr() {
        return receiveAddr;
    }
    public void setReceiveAddr(String receiveAddr) {
        this.receiveAddr = receiveAddr;
    }
    public List<String> getCcAddrs() {
        return ccAddrs;
    }
    public void setCcAddrs(List<String> ccAddrs) {
        this.ccAddrs = ccAddrs;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
}
