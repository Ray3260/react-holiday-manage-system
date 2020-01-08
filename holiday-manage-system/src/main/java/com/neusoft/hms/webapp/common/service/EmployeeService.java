package com.neusoft.hms.webapp.common.service;

import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Resource
    private EmployeeRepository employeeRepository;

    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public List<Employee> findByName(String name) {
        return employeeRepository.findByName(name);
    }

    public List<Employee> findLoginUser(String login, String password) {
        return employeeRepository.findLoginUser(login, password);
    }

    //通过邮箱查找用户
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    //通过姓名字段查找用户
    public List<Employee> findUserByQuery(String query) {
        return employeeRepository.findUserByQuery(query);
    }

    //通过姓名找到指定用户的信息
    public List<Employee> listFindByEmail(String email) {
        return employeeRepository.listFindByEmail(email);
    }

    //通过项目组找到领导信息
    public String findLeaderByProject(String project){ return employeeRepository.findLeaderByProject(project);}

    //通过项目信息找到管理者信息
    public String findAdminByProject(){ return employeeRepository.findAdminByProject();}

    // 更新剩余年假信息
    @Transactional
    public int updateAnnualLeave(String email, float days) {
        return employeeRepository.updateAnnualLeave(email, days);
    }

    // 更新剩余调休假信息
    @Transactional
    public int updateVacationLeave(String email, float days) {
        return employeeRepository.updateVacationLeave(email, days);
    }
    
    //录入加班后更新剩余年假信息
    @Transactional
    public int updateAddAnnualLeave(String email, float days) {
        return employeeRepository.updateAddAnnualLeave(email, days);
    }
    
    //录入加班后更新剩余调休假信息
    @Transactional
    public int updateAddVacationLeave(String email, float days) {
        return employeeRepository.updateAddVacationLeave(email, days);
    }

    // 查找相同邮箱的个数
    @Transactional
    public int findCountByLogin(String login) {
        return employeeRepository.findCountByLogin(login);
    }

    // 保存新加员工的信息
    @Transactional
    public void saveUserInfo(String login, String password, String name, int official, float vacationLeave, float annualLeave,
                             String project, int level) {
        Employee employee = new Employee();
        employee.setLogin(login);
        employee.setPassword(password);
        employee.setName(name);
        employee.setOfficial(official);
        employee.setVacation_leave(vacationLeave);
        employee.setAnnual_leave(annualLeave);
        employee.setProject(project);
        employee.setE_level(level);
        employeeRepository.save(employee);
    }

    // 查询员工表员工个数
    @Transactional
    public int findCount() {
        return employeeRepository.findCount();
    }

    // 查询制定范围内到员工
    @Transactional
    public List<Employee> findAllByLimit(int start, int count) {
        return employeeRepository.findAllByLimit(start, count);
    }

    // 更新员工年假天数
    public void updateByEmail(String email, float vacationLeave, float annualLeave) {
        Employee employee = employeeRepository.findByLogin(email);
        employee.setVacation_leave(vacationLeave);
        employee.setAnnual_leave(annualLeave);
        employeeRepository.save(employee);
    }
    
    // 根据邮箱查找id
    public int findIdByEmail(String id) {
    	return employeeRepository.findIdByEmail(id);
    }
    
    // 根据id删除项目
    @Transactional
    public void deleteById(int id) {
    	employeeRepository.deleteById(id);
    }
}
