package com.neusoft.hms.webapp.common.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.service.OvertimeService;
import com.neusoft.hms.webapp.common.util.DateUtil;

/*
 * 检查申请或者录入的时间段是否存在，防止重复录入
 */
@RestController
public class CheckWorkDateRestController {
	
	@Autowired
	private OvertimeService overtimeService;
	
	@GetMapping("/check-work-date")
	public List<Boolean> checkDate(@RequestParam String email, @RequestParam List<String> WorkDates) {
		//worktimeDates元素格式 "2019/12/10~2019/12/11@1"
        if (WorkDates != null) {
            List<Boolean> existingDates = new ArrayList<>();
            for (String WorkDate : WorkDates) {
                if (WorkDate.contains("~")) {
                    // 分割休假日期时间段
                    String[] WorkDateInfo = WorkDate.split("~");
                    // 构造起始时间
                    java.sql.Timestamp start = DateUtil.stringToTimestamp(WorkDateInfo[0].trim() + " 00:00:00");
                    java.sql.Timestamp end = DateUtil.stringToTimestamp(WorkDateInfo[1].trim() + " 00:00:00");
                    // 查询并添加到list中
                    existingDates.add(overtimeService.findExistingDateByEmailAndDate(email, start, end).size() == 0);
                } else {
                    break;
                }
            }
            return existingDates;
        }
		return null;
	}
}
