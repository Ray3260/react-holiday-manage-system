package com.neusoft.hms.webapp.common.bean;

import javax.validation.constraints.NotNull;

public class OvertimeEntryParam {
    @NotNull
    private String email;   

    @NotNull
    private float days;

    @NotNull
    private String[] workDates;

    private String remark;

    public String getEmail() {
        return this.email;
    }
    public float getDays() {
        return this.days;
    }
    public String[] getWorkDates() {
        return this.workDates;
    }
    public String getRemark() {
        return this.remark;
    }
}
