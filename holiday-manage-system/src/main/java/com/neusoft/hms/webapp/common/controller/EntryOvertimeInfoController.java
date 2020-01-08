package com.neusoft.hms.webapp.common.controller;

import com.neusoft.hms.webapp.common.bean.Overtime;
import com.neusoft.hms.webapp.common.bean.OvertimeEntryParam;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import com.neusoft.hms.webapp.common.service.OvertimeService;
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
public class EntryOvertimeInfoController {
    private static final Logger LOGGER =
            LoggerFactory.getLogger(EntryOvertimeInfoController.class);
    @Autowired
    private OvertimeService OvertimeService;
    @Autowired
    private EmployeeService employee;

    @PostMapping("/work-entry")
    public String entryWorkInfo(@RequestBody OvertimeEntryParam OvertimeEntryParam) throws Exception {
        if (OvertimeEntryParam.getWorkDates() != null) {
            employee.updateAddVacationLeave(OvertimeEntryParam.getEmail(), OvertimeEntryParam.getDays());
            int count = 0;
            final List<Overtime> Workist = new ArrayList<>();
            for (final String OvertimeDate : OvertimeEntryParam.getWorkDates()) {
                if (OvertimeDate.contains("@")) {
                    int allDay;
                    // 分割加班时间的日期和全半天
                    if (OvertimeDate.contains("@0.5")) {
                        allDay = 0;
                    } else {
                        allDay = 1;
                    }
                    final String[] WorkDateAndDayInfo = OvertimeDate.split("@");
                    // 判断加班天数
                    // final int allDay = ("1".equals(WorkDateAndDayInfo[1].trim())) ? 1 : 0;
                    // 分割休假日期时间段
                    final String[] WorkDateInfo = WorkDateAndDayInfo[0].split("~");
                    // 构造起始时间
                    final java.sql.Timestamp oStart = DateUtil.stringToTimestamp(WorkDateInfo[0].trim() + " 00:00:00");
                    final java.sql.Timestamp oEnd = DateUtil.stringToTimestamp(WorkDateInfo[1].trim() + " 00:00:00");
                    // 录入对象
                    final Overtime Overtime = new Overtime(OvertimeEntryParam.getEmail(), oStart, oEnd, allDay, oStart,
                            OvertimeEntryParam.getRemark(), "", 1, "", null);
                    Workist.add(Overtime);
                    count++;
                } else {
                    break;
                }
            }
            if (count == OvertimeEntryParam.getWorkDates().length && Workist != null) {
                List<Overtime> list = OvertimeService.insertOvertimeInfos(Workist);
                if (list.size() > 0) {
                    LOGGER.info("加班录入成功");
                } else {
                    LOGGER.info("加班录入失败");
                }
                return "录入成功";
            } else {
                LOGGER.info("加班录入失败");
                return "录入失败";
            }
        }
        return "录入失败";
    }
}