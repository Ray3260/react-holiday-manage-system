package com.neusoft.hms.webapp.common.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.bean.UserNameAndEmail;
import com.neusoft.hms.webapp.common.service.EmployeeService;

@RestController
public class AutoCompleteByQueryController {

    @Autowired
    private EmployeeService employeeService;
    
    /**
     * 通过字段查询姓名和邮箱
     *
     * @param query
     * @return 姓名和邮箱组成的对象数组
     */
    @GetMapping("/userinfo-nameAndEmail")
    public List<UserNameAndEmail> getNameAndEmail(@RequestParam String query) {
        List<UserNameAndEmail> userNameAndEmailList = new ArrayList<>();
        if(query.length() > 0) {
            List<UserNameAndEmail> userList = new ArrayList<>();
            List<Employee> employeeList = employeeService.findUserByQuery(query);
            for (Employee employee : employeeList) {
                userList.add(new UserNameAndEmail(employee.getName(),employee.getLogin()));
            }
            //按姓名长度排序，超过20条数据时截断
            userList.sort((UserNameAndEmail a, UserNameAndEmail b) -> {
                return (a.getName().length() - b.getName().length());
            });
            if(userList.size() > 20) {
                userNameAndEmailList.addAll(userList.subList(0, 20));
            } else {
                userNameAndEmailList.addAll(userList);
            }
        }
        return userNameAndEmailList;
    }

}
