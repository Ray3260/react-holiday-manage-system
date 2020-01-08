package com.neusoft.hms.webapp.common.controller;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.annotation.Resource;

import com.neusoft.hms.webapp.common.bean.EmailSendInfo;
import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import com.neusoft.hms.webapp.common.service.VacationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.neusoft.hms.webapp.common.bean.Vacation;
import com.neusoft.hms.webapp.common.bean.VacationEntryParam;
import com.neusoft.hms.webapp.common.util.DateUtil;

@RestController
@RequestMapping("/vacation-apply")
public class VacationApplyRestController {

    @Resource
    private VacationService vacation;
    @Autowired
    private EmployeeService employee;
    @Resource
    private EmailSendRestController sendEmail;

    /**
     * 请假申请的提交
     *
     * @param param
     * @return
     */
    @RequestMapping(value = "/submit", method = RequestMethod.POST)
    public boolean submitVacationApply(@RequestBody VacationEntryParam param) throws Exception {
        Employee employeeInfo = employee.findByEmail(param.getEmail());
        int status;
        String receiveAddr = null;
        List<String> ccAddrs = new ArrayList<>();
        //为普通员工时，只给该成员项目组内level为1的人发邮件
        if (employeeInfo.getE_level() == 0) {
            receiveAddr = employee.findLeaderByProject(employeeInfo.getProject());
            status = 0;
        } else if (employeeInfo.getE_level() == 1) {
            receiveAddr = employee.findAdminByProject();
            status = 1;
        } else {
            receiveAddr = employee.findAdminByProject();
            status = 1;
        }
        Date now = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Timestamp applyTime = DateUtil.stringToTimestamp(formatter.format(now));
        List<Vacation> vacationList = new ArrayList<>();
        String vacationApplyDate = "";
        for (String vacationDate : param.getVacationDates()) {
            if (vacationDate.contains("@0.5")) {
                vacationApplyDate += vacationDate.split("@")[0].split("~")[0] + "(半天 )";
                Timestamp vStart = DateUtil.stringToTimestamp(vacationDate.split("@")[0].split("~")[0].trim() + " 00:00:00");
                vacationList.add(new Vacation(param.getEmail(), applyTime, param.getType(), vStart, vStart, 0,
                        param.getRemark(), param.getContact(), status, "", "", null));
            } else {
                Timestamp vStart = DateUtil.stringToTimestamp(vacationDate.split("@")[0].split("~")[0].trim() + " 00:00:00");
                Timestamp vEnd = DateUtil.stringToTimestamp(vacationDate.split("@")[0].split("~")[1].trim() + " 00:00:00");
                if (vStart.equals(vEnd)) {
                    vacationApplyDate += vacationDate.split("@")[0].split("~")[0] + " ";
                } else {
                    vacationApplyDate += vacationDate.split("@")[0] + " ";
                }
                vacationList.add(new Vacation(param.getEmail(), applyTime, param.getType(), vStart, vEnd, 1,
                        param.getRemark(), param.getContact(), status, "", "", null));
            }
        }
        String sendAddr = param.getEmail();
        String vacationType = null;
        if (param.getType() == 0) {
            vacationType = "年假";
        } else if (param.getType() == 1) {
            vacationType = "串休假";
        } else if (param.getType() == 2) {
            vacationType = "事假/病假";
        }
        String title = employeeInfo.getName() + vacationType + "申请";
        String comment = "领导您好：" + '\r' + '\r' + "       我于" + vacationApplyDate + "申请" + vacationType + "，共计" + param.getDays()
                + "天，请您审批。" + '\r' + '\r' + "申请者：" + '\r' + "       " + employeeInfo.getName();
        sendEmail.sendEmail(new EmailSendInfo(sendAddr, employeeInfo.getPassword(), receiveAddr, ccAddrs, title, comment));
        vacation.insertVacationInfos(vacationList);
        return true;
    }

    @RequestMapping(path = "/{email}", method = RequestMethod.GET)
    public Map<String, Object> personVacationInfo(@PathVariable(value = "email") String email) {
        Map<String, Object> personVacationInfoMap = new HashMap<>();
        personVacationInfoMap.put("annualLeave", employee.findByEmail(email).getAnnual_leave());
        personVacationInfoMap.put("vacationLeave", employee.findByEmail(email).getVacation_leave());
        return personVacationInfoMap;
    }
}
