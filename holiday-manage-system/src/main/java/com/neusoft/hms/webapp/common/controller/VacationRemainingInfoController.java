package com.neusoft.hms.webapp.common.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.bean.VacationRemainingInfo;
import com.neusoft.hms.webapp.common.service.EmployeeService;

@RestController
public class VacationRemainingInfoController {

    @Autowired
    private EmployeeService employeeService;

    /**
     * 查询用户剩余假期天数
     * @param email
     * @return 假期剩余天数信息
     */
    @GetMapping("/vacation-remaining")
    public VacationRemainingInfo getVacationRemainingInfo(@RequestParam String email) {
        Employee employee = employeeService.findByEmail(email);
        //查询不到对应用户时返回null
        if(employee == null) {
            return null;
        }
        return new VacationRemainingInfo(employee.getVacation_leave(), employee.getAnnual_leave());
    }
}
