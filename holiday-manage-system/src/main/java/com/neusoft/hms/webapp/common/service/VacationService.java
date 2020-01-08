package com.neusoft.hms.webapp.common.service;

import com.neusoft.hms.webapp.common.bean.UsedVacationData;
import com.neusoft.hms.webapp.common.bean.Vacation;
import com.neusoft.hms.webapp.common.repository.VacationRepository;
import com.neusoft.hms.webapp.common.util.DateUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Service
public class VacationService {
    @Autowired
    private VacationRepository vacationDao;

    @Transactional(rollbackFor = SQLException.class)
    public List<Vacation> insertVacationInfos(List<Vacation> vacation) {
        return vacationDao.saveAll(vacation);
    }
    
    // 获取指定用户休过的假期
    public List<Vacation> findUsedVacations(UsedVacationData data) throws Exception {
        return vacationDao.findUsedVacations(data.getEmail(), data.getDateType(),
                DateUtil.stringToTimestamp(data.getStartDate()), DateUtil.stringToTimestamp(data.getEndDate()));
    }

    //获取指定员工指定假期类型的休假信息
    public List<Vacation> findVacationInfo(String email, int vacationType) {
        return vacationDao.findVacationInfo(email, vacationType);
    }

    //获取指定员工指定假期类型指定年度的休假信息
    public List<Vacation> findYearVacationInfo(String email, int vacationType, String searchYear) {
        return vacationDao.findYearVacationInfo(email, vacationType, searchYear);
    }
    
    //根据邮箱和请假时间获取用户是否已经申请或者录入此时间段
    public List<Vacation> findExistingDateByEmailAndDate(String email, Timestamp start, Timestamp end) {
    	return vacationDao.findExistingDateByEmailAndDate(email, start, end);
    }
    
    // 更新假期状态
    @Transactional
    public void updateStatusByEmail(String status, String email, Timestamp vStart) {
    	vacationDao.updateStatusByEmail(status, email, vStart);
    }
    @Transactional
    public void updateStatusByEmail_revoke(String status, String email, Timestamp vStart_1, Timestamp vStart_2) {
    	vacationDao.updateStatusByEmailRevoke(status, email, vStart_1, vStart_2);
    }
    
}
