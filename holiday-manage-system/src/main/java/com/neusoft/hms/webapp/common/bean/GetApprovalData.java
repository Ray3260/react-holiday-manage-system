package com.neusoft.hms.webapp.common.bean;

import java.util.List;

public class GetApprovalData {
    private List<ApprovalEmployee> approvalList;
    private Double totalPage;

    public List<ApprovalEmployee> getApprovalList() {
        return approvalList;
    }

    public void setApprovalList(List<ApprovalEmployee> approvalList) {
        this.approvalList = approvalList;
    }

    public Double getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(Double totalPage) {
        this.totalPage = totalPage;
    }
}
