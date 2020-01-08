package com.neusoft.hms.webapp.common.bean;

import javax.validation.constraints.NotNull;

public class UsedVacationData {
    
    @NotNull
    private String email;

    @NotNull
    private int dateType;

    private String startDate;

    private String endDate;
    
    public String getEmail() {
        return email;
    }

    public int getDateType() {
        return dateType;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }
}
