package com.neusoft.hms.webapp.common.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Employee {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    @Column
    private String login;
    @Column
    private String password;
    @Column
    private String name;
    @Column
    private int official;
    @Column
    private float vacationLeave;
    @Column
    private float annualLeave;
    @Column
    private String project;
    @Column
    private int eLevel;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getOfficial(){ return official; }

    public void setOfficial(int official){ this.official = official; }

    public float getVacation_leave() {
        return vacationLeave;
    }

    public void setVacation_leave(float vacation_leave) {
        this.vacationLeave = vacation_leave;
    }

    public float getAnnual_leave() {
        return annualLeave;
    }

    public void setAnnual_leave(float annual_leave) {
        this.annualLeave = annual_leave;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public int getE_level() {
        return eLevel;
    }

    public void setE_level(int e_level) {
        this.eLevel = e_level;
    };
}
