package com.neusoft.hms.webapp.common.service;

import com.neusoft.hms.webapp.common.bean.Overtime;
import com.neusoft.hms.webapp.common.repository.OvertimeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.SQLException;
import javax.annotation.Resource;
import java.util.List;
import java.sql.Timestamp;

@Service
public class OvertimeService {

    @Resource
    private OvertimeRepository overtimeRepository;

    //获取指定员工的加班信息
    public List<Overtime> findOverTimeInfo(String email) {
        return overtimeRepository.findOverTimeInfo(email);
    }
    
    //获取指定员工指定年度的加班信息
    public List<Overtime> findYearOverTimeInfo(String email, String searchYear) {
        return overtimeRepository.findYearOverTimeInfo(email, searchYear);
    }
    //插入
    @Transactional(rollbackFor = SQLException.class)
    public List<Overtime> insertOvertimeInfos(List<Overtime> vacation) {
        return overtimeRepository.saveAll(vacation);
    }

     //根据邮箱和请假时间获取用户是否已经申请或者录入此时间段
     public List<Overtime> findExistingDateByEmailAndDate(String email, Timestamp start, Timestamp end) {
    	return overtimeRepository.findExistingDateByEmailAndDate(email, start, end);
    }
     
     //通过邮箱和开始时间、结束时间范围查找加班信息
     public List<Overtime> findOvertimeInfoByEmailAndDate(String email, Timestamp start, Timestamp end) {
    	 return overtimeRepository.findOvertimeInfoByEmailAndDate(email, start, end);
     }
}

