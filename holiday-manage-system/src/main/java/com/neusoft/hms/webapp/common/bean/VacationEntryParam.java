package com.neusoft.hms.webapp.common.bean;

import javax.validation.constraints.NotNull;

public class VacationEntryParam {
    @NotNull
    private String email;

    @NotNull
    private int type;

    @NotNull
    private float days;

    @NotNull
    private String[] vacationDates;

    private String contact;

    private String remark;

    public String getEmail() {
        return email;
    }
    public int getType() {
        return type;
    }
    public float getDays() {
        return days;
    }
    public String[] getVacationDates() {
        return vacationDates;
    }
    public String getRemark() {
        return remark;
    }
    public String getContact() {
        return contact;
    }
}
