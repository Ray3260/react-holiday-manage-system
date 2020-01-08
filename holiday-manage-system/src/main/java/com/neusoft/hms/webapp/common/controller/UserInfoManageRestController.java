package com.neusoft.hms.webapp.common.controller;

import com.neusoft.hms.webapp.common.bean.*;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserInfoManageRestController {

    @Resource
    private EmployeeService employeeService;

    /**
     * 获取员工信息
     * */
    @GetMapping("/user-info")
    public GetUserInfo getUserInfo(@RequestParam (required = false) String email, @RequestParam String page,
                                   @RequestParam String start, @RequestParam String count) {
        GetUserInfo userInfo = new GetUserInfo();
        if (email == null || "".equals(email)) {
            int totalCount = employeeService.findCount();
            int currCount = totalCount - Integer.parseInt(start);
            double currTotalPage = (currCount % Integer.parseInt(count) == 0)
                    ? Math.floor((double) currCount / Integer.parseInt(count))
                    : Math.floor((double) currCount / Integer.parseInt(count)) + 1;

            List<Employee> employeeList = (currCount < Integer.parseInt(count))
                    ? employeeService.findAllByLimit(Integer.parseInt(start), currCount)
                    : employeeService.findAllByLimit(Integer.parseInt(start), Integer.parseInt(count));
            userInfo.setEmployees(employeeList);
            userInfo.setTotalPage(currTotalPage + Integer.parseInt(page));
        } else {
            ArrayList<Employee> employees = new ArrayList<>();
            Employee employee = employeeService.findByEmail(email);
            employees.add(employee);
            userInfo.setEmployees(employees);
            userInfo.setTotalPage(1d);
        }
        return userInfo;
    }

    /**
     * 添加员工信息
     * */
    @PostMapping("/add-user-info")
    public int getUserInfo(@RequestBody List<UserInfo> userInfoList) {
        int count = 0;
        for (UserInfo user : userInfoList) {
            System.out.println(user);
            int countByLogin = employeeService.findCountByLogin(user.getEmail());
            System.out.println(user.getEmail());
            if (countByLogin == 0) {
                employeeService.saveUserInfo(user.getEmail(), user.getPassword(), user.getUsername(), user.getOfficial(),
                        user.getVacationLeave(), user.getAnnualLeave(), user.getProject(), user.getLevel());
            } else {
                count = 1;
            }
        }
        return count;
    }

    /**
     * 更新员工假期天数
     * */
    @PostMapping("/update-user-info")
    public void updateUserInfo(@RequestBody List<UpdateUserInfo> userInfos) {
        for (UpdateUserInfo userInfo : userInfos) {
            employeeService.updateByEmail(userInfo.getEmail(), userInfo.getVacationLeave(), userInfo.getAnnualLeave());
        }
    }
    
    // 删除用户
    @GetMapping("/delete-userinfo")
    public String deleteUserInfo(@RequestParam String email) {
    	employeeService.deleteById(employeeService.findIdByEmail(email));
    	return "删除成功";
    }
}
