package com.neusoft.hms.webapp.common.controller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.annotation.Resource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.bean.UsedVacationData;
import com.neusoft.hms.webapp.common.bean.UsedVacationInfo;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import com.neusoft.hms.webapp.common.service.VacationService;
import com.neusoft.hms.webapp.common.util.DateUtil;

@RestController
public class UsedVacationsGetRestController {

    @Resource
    private VacationService vacation;
    @Resource
    private EmployeeService employee;

    // 鑾峰彇褰撳墠鐢ㄦ埛浼戣繃鐨勫亣鏈熶俊鎭�
    @PostMapping("/holiday-record")
    public List<UsedVacationInfo> getUsedVacations(@RequestBody UsedVacationData data) {
        List<UsedVacationInfo> infoList = new ArrayList<>();
        try {
            infoList = vacation.findUsedVacations(data).stream().map(item -> {
                UsedVacationInfo usedVacationInfo = new UsedVacationInfo();
                Employee user = employee.findByEmail(item.getEmail());
                if (user != null) {
                	usedVacationInfo.setName(user.getName());
                }
                usedVacationInfo.setApplyTime(item.getApplyTime());
                usedVacationInfo.setDateTime(item.getVStart() + "~" + item.getVEnd());
                if (item.getAllDay() == 0) {
                    usedVacationInfo.setDateLength((float) 0.5);
                } else {
                    long dateLength = (item.getVEnd().getTime() - item.getVStart().getTime())/(24*60*60*1000) + 1;
                    usedVacationInfo.setDateLength((float) dateLength);
                }
                usedVacationInfo.setTele(item.getContact());
                usedVacationInfo.setNote(item.getReason());
                usedVacationInfo.setComment(item.getApproverComment());
                usedVacationInfo.setResult(item.getStatus());
                return usedVacationInfo;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return infoList;
    }
    
    // 未审核假期撤销
    @GetMapping("/vacation-revoke")
    public void revokeVacation(@RequestParam String email, @RequestParam String startDate) {
    	Timestamp vStart_2 = DateUtil.stringToTimestamp(startDate.trim() + " 23:59:59");
    	Timestamp vStart_1 = DateUtil.stringToTimestamp(startDate.trim() + " 00:00:00");
    	vacation.updateStatusByEmail_revoke("4", email, vStart_1, vStart_2);
    }
}
