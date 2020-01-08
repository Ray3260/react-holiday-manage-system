package com.neusoft.hms.webapp.common.bean;

public class UserInfo {
    private String email;
    private String password;
    private String username;
    private int official;
    private float vacationLeave;
    private float annualLeave;
    private String project;
    private int level;

    public UserInfo() {
    }

    public UserInfo(String email, String password, String username, int official, float vacationLeave, float annualLeave, String project, int level) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.official = official;
        this.vacationLeave = vacationLeave;
        this.annualLeave = annualLeave;
        this.project = project;
        this.level = level;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    public int getOfficial() {
        return official;
    }

    public float getVacationLeave() {
        return vacationLeave;
    }

    public float getAnnualLeave() {
        return annualLeave;
    }

    public String getProject() {
        return project;
    }

    public int getLevel() {
        return level;
    }
}
