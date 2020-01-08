package com.neusoft.hms.webapp.common.controller;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neusoft.hms.webapp.common.bean.Overtime;
import com.neusoft.hms.webapp.common.service.OvertimeService;
import com.neusoft.hms.webapp.common.util.DateUtil;


@RestController
public class GetOvertimeInfoRestController {
	
	@Autowired
	private OvertimeService overtimeService_;
	
	@GetMapping("/overtime-info")
	public List<Overtime> getOvertimeInfoList(@RequestParam String email, @RequestParam String startDate,
			@RequestParam String endDate) {
		Timestamp oStart = DateUtil.stringToTimestamp(startDate.trim() + " 00:00:00");
		Timestamp oEnd = DateUtil.stringToTimestamp(endDate.trim() + " 00:00:00");
		return overtimeService_.findOvertimeInfoByEmailAndDate(email, oStart, oEnd);
	}
}
