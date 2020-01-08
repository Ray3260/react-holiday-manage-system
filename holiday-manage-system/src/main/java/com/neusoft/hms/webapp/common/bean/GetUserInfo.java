package com.neusoft.hms.webapp.common.bean;

import java.util.List;

public class GetUserInfo {
	
    private List<Employee> employees;
    private Double totalPage;

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public void setTotalPage(Double totalPage) {
        this.totalPage = totalPage;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public Double getTotalPage() {
        return totalPage;
    }
}
