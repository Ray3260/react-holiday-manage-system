package com.neusoft.hms.webapp.common.controller;

import com.neusoft.hms.webapp.common.bean.Vacation;
import com.neusoft.hms.webapp.common.bean.VacationEntryParam;
import com.neusoft.hms.webapp.common.service.ApprovalService;
import com.neusoft.hms.webapp.common.util.DateUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;

@RestController
public class EntryVacationInfoController {
	
	private static final Logger LOGGER =
			LoggerFactory.getLogger(EntryVacationInfoController.class);
    @Autowired
    private ApprovalService approvalService;

    @PostMapping("/vacation-entry")
    public String entryVacationInfo(@RequestBody VacationEntryParam vacationEntryParam) throws Exception {
        if (vacationEntryParam.getVacationDates() != null) {
            int count = 0;
            List<Vacation> vacationList = new ArrayList<>();
            for (String vacationDate : vacationEntryParam.getVacationDates()) {
                if (vacationDate.contains("@")) {
                    // 分割休假日期和全半天
                    String[] vacationDateAndDayInfo = vacationDate.split("@");
                    // 判断请假天数
                    int allDay = ("1".equals(vacationDateAndDayInfo[1].trim())) ? 1 : 0;
                    // 分割休假日期时间段
                    String[] vacationDateInfo = vacationDateAndDayInfo[0].split("~");
                    // 构造起始时间
                    java.sql.Timestamp vStart = DateUtil.stringToTimestamp(vacationDateInfo[0].trim() + " 00:00:00");
                    java.sql.Timestamp vEnd = DateUtil.stringToTimestamp(vacationDateInfo[1].trim() + " 00:00:00");
                    // 录入对象
                    Vacation vacation = new Vacation(vacationEntryParam.getEmail(), vStart, vacationEntryParam.getType(), 
                            vStart, vEnd, allDay, vacationEntryParam.getRemark(), "", 2, "", "", vStart);
                    // vacationService.insertVacationInfo(vacation);
                    vacationList.add(vacation);
                    count++;
                } else {
                    break;
                }
            }
            if (count == vacationEntryParam.getVacationDates().length && vacationList != null) {
                approvalService.updateApplyInfo(vacationEntryParam.getType(), vacationEntryParam.getEmail(),
                        vacationEntryParam.getDays(), vacationList);
                LOGGER.info("假期录入成功");
                return "录入成功";
            } else {
            	LOGGER.info("假期录入失败");
                return "录入失败";
            }
        }
        return "录入失败";
    }
}
