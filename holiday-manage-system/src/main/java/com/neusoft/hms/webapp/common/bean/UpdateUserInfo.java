package com.neusoft.hms.webapp.common.bean;

public class UpdateUserInfo {
    // email: email, vacationLeave: vacation_leave,annualLeave: annual_leave
    private String email;
    private float vacationLeave;
    private float annualLeave;

    public UpdateUserInfo() {
    }

    public UpdateUserInfo(String email, float vacationLeave, float annualLeave) {
        this.email = email;
        this.vacationLeave = vacationLeave;
        this.annualLeave = annualLeave;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public float getVacationLeave() {
        return vacationLeave;
    }

    public void setVacationLeave(float vacationLeave) {
        this.vacationLeave = vacationLeave;
    }

    public float getAnnualLeave() {
        return annualLeave;
    }

    public void setAnnualLeave(float annualLeave) {
        this.annualLeave = annualLeave;
    }
}
