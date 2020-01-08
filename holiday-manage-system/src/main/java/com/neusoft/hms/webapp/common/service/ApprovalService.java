package com.neusoft.hms.webapp.common.service;

import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.bean.Vacation;
import com.neusoft.hms.webapp.common.repository.EmployeeRepository;
import com.neusoft.hms.webapp.common.repository.VacationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;

@Service
public class ApprovalService {

    @Resource
    private VacationRepository vacationRepository;
    @Resource
    private EmployeeRepository employeeRepository;

    /**
     * 查询管理员用户所在的项目编号
     * */
    @Transactional
    public String findProjectByAdmin(String admin) {
        return employeeRepository.findProjectByAdmin(admin);
    }

    /**
     * 查询符合条件请假员工的总数
     * */
    @Transactional
    public int findCount(int status, String project, int e_level) {
        return vacationRepository.findCount(status, project, e_level);
    }

    /**
     * 查询请假已审批员工的总数
     * */
    @Transactional
    public int findApprovalCount(int status, String project, int e_level) {
        return vacationRepository.findApprovalCount(status, project, e_level);
    }

    /**
     * 查询符合条件所有请假员工的总数
     * */
    @Transactional
    public int findCountByLevel(int status, int e_level) {
        return vacationRepository.findCountByLevel(status, e_level);
    }

    /**
     * 查询所有请假已审批员工的总数
     * */
    @Transactional
    public int findApprovalCountByLevel(int status, int e_level) {
        return vacationRepository.findApprovalCountByLevel(status, e_level);
    }

    /**
     * 获取级别为0请假未审批员工的信息
     * */
    @Transactional
    public List<Vacation> findByStatus(int status, String project, int e_level, int startIndex, int count) {
        return vacationRepository.findByStatus(status, project, e_level, startIndex, count);
    }

    /**
     * 获取级别为0请假已审批员工的信息
     * */
    @Transactional
    public List<Vacation> findByApprovalStatus(int status, String project, int e_level, int startIndex, int count) {
        return vacationRepository.findByApprovalStatus(status, project, e_level, startIndex, count);
    }

    /**
     * 获取级别为1,2请假未审批员工的信息
     * */
    @Transactional
    public List<Vacation> findByStatusAndLevel(int status, int e_level, int startIndex, int count) {
        return vacationRepository.findByStatusAndLevel(status, e_level, startIndex, count);
    }

    /**
     * 获取级别为1,2请假已审批员工的信息
     * */
    @Transactional
    public List<Vacation> findByApprovalStatusAndLevel(int status, int e_level, int startIndex, int count) {
        return vacationRepository.findByApprovalStatusAndLevel(status, e_level, startIndex, count);
    }

    /**
     * 通过邮箱获取请假员工的姓名
     * */
    @Transactional
    public String findNameByEmail(String email) {
        return employeeRepository.findNameByEmail(email);
    }

    /**
     * 更新审批状态
     * */
    @Transactional
    public void updateStatusByEmail(String status, String email, Timestamp vStart) {
        vacationRepository.updateStatusByEmail(status,email, vStart);
    }

    /**
     * 保存员工请假审批的结果
     * */
    @Transactional
   public void updateByEmail(String status, String approval_reason, String email, Timestamp vStart, String admin, Timestamp date) {
        vacationRepository.updateByEmail(status, approval_reason, email, vStart, admin, date);
        /*Vacation vacation = vacationRepository.findByEmailAndVStart(email, vStart);
        vacation.setStatus(Integer.parseInt(status));
        vacation.setApproverComment(approval_reason);
        vacation.setApproverNumber(admin);
        vacation.setApprovalTime(date);
        vacationRepository.save(vacation);*/
    }

    /**
     * 通过邮箱查找员工信息
     * */
    @Transactional
    public Employee findByLogin(String email) {
        Employee employee = employeeRepository.findByLogin(email);
        return employee;
    }

    /**
     * 查询年假剩余天数
     * */
    public float findAnnualByEmail(String email) {
        return employeeRepository.findAnnualByEmail(email);
    }

    /**
     * 查询调休假剩余天数
     * */
    public float findVacationByEmail(String email) {
        return employeeRepository.findVacationByEmail(email);
    }

	/**
     * 更新员工年假天数
     * */
    @Transactional
    public void updateAnnualLeave(String email, float days) {
        employeeRepository.updateAnnualLeave(email, days);
    }

    /**
     * 更新员工调休假天数
     * */
    @Transactional
    public void updateVacationLeave(String email, float days) {
        employeeRepository.updateVacationLeave(email, days);
    }

    // 请假录入，默认审批同意
    @Transactional
    public void updateApplyInfo(int type, String email, float days, List<Vacation> vacationList) {
        if (type == 0) {
            // 年假剩余天数更新
            employeeRepository.updateAnnualLeave(email, days);
        } else if (type == 1) {
            // 调休假剩余天数更新
            employeeRepository.updateVacationLeave(email, days);
        }
        vacationRepository.saveAll(vacationList);
    }
}
