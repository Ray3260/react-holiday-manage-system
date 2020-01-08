package com.neusoft.hms.webapp.common.bean;

public class VacationRemainingInfo {

    private float vacationLeave;
    
    private float annualLeave;

    public VacationRemainingInfo(float vacationLeave, float annualLeave) {
        this.vacationLeave = vacationLeave;
        this.annualLeave = annualLeave;
    }
    public float getVacationLeave() {
        return vacationLeave;
    }
    public float getAnnualLeave() {
        return annualLeave;
    }
}
