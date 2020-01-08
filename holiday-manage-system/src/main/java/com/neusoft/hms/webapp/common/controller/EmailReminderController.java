package com.neusoft.hms.webapp.common.controller;

import com.neusoft.hms.webapp.common.bean.EmailSendInfo;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class EmailReminderController {

    @Autowired
    private EmailSendRestController sendEmail;
    @Autowired
    private EmployeeService employee;

    @GetMapping("remind-email/{userEmail}")
    public String emailReminder(@PathVariable String userEmail,
                                @RequestParam String managerEmail,
                                @RequestParam int vacationType) {
        try {
            String sendAddr = managerEmail;
            String password = employee.findByEmail(managerEmail).getPassword();
            String receiveAddr = userEmail;
            List<String> ccAddrs = new ArrayList<>();
            String vacation = null;
            if (vacationType == 0){
                vacation = "年假";
            } else if(vacationType == 1){
                vacation = "调休假";
            }
            String title = vacation + "即将过期";
            String comment = "您好" + employee.findByEmail(userEmail).getName() +"：" + '\r'+ '\r'+ "    您有" + vacation + "即将过期，请合理安排休假时间。";
            sendEmail.sendEmail(new EmailSendInfo(sendAddr, password, receiveAddr, ccAddrs, title, comment));
        } catch (Exception e) {
            e.printStackTrace();
            return "邮件发送失败";
        }
        return "邮件发送成功";
    }
}
