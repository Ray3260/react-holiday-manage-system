package com.neusoft.hms.webapp.common.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.service.VacationService;
import com.neusoft.hms.webapp.common.util.DateUtil;

/*
 * 检查申请或者录入的时间段是否存在，防止重复录入
 */
@RestController
public class CheckVacationDateRestController {
	
	@Autowired
	private VacationService vacationService;
	
	@GetMapping("/check-vacation-date")
	public List<Boolean> checkDate(@RequestParam String email, @RequestParam List<String> vacationDates) {
		//vacationDates元素格式 "2019/12/10~2019/12/11@1"
        if (vacationDates != null) {
            List<Boolean> existingDates = new ArrayList<>();
            for (String vacationDate : vacationDates) {
                if (vacationDate.contains("~")) {
                    // 分割休假日期时间段
                    String[] vacationDateInfo = vacationDate.split("~");
                    // 构造起始时间
                    java.sql.Timestamp start = DateUtil.stringToTimestamp(vacationDateInfo[0].trim() + " 00:00:00");
                    java.sql.Timestamp end = DateUtil.stringToTimestamp(vacationDateInfo[1].trim() + " 00:00:00");
                    // 查询并添加到list中
                    existingDates.add(vacationService.findExistingDateByEmailAndDate(email, start, end).size() == 0);
                } else {
                    break;
                }
            }
            return existingDates;
        }
		return null;
	}
}
