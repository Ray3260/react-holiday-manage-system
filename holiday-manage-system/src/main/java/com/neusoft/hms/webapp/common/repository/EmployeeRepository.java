package com.neusoft.hms.webapp.common.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.neusoft.hms.webapp.common.bean.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    List<Employee> findAll();

    @Query(value = "SELECT * FROM employee where name = ?1", nativeQuery = true)
    List<Employee> findByName(String name);

    @Query(value = "SELECT * FROM employee where login = ?1 and password = ?2", nativeQuery = true)
    List<Employee> findLoginUser(String login, String password);

    //通过邮箱查找用户
    @Query(value = "SELECT * FROM employee where login = :email", nativeQuery = true)
    Employee findByEmail(@Param("email") String email);

    //通过姓名字段查找用户
    @Query(value = "SELECT * FROM employee where name LIKE %?1%", nativeQuery = true)
    List<Employee> findUserByQuery(String query);

    // 通过邮箱查找员工的年假和调休假天数
    Employee findByLogin(String email);

    // 查询管理员用户所在的项目编号
    @Query(value = "select project from employee where login = ?1", nativeQuery = true)
    String findProjectByAdmin(String admin);

    // 通过邮箱查找请假未审批员工的姓名
    @Query(value = "select name from employee where login = ?1", nativeQuery = true)
    String findNameByEmail(String email);

    //通过邮箱查找员工的相关信息
    @Query(value = "SElECT * FROM employee where login = ?1", nativeQuery = true)
    List<Employee> listFindByEmail(String login);

    //通过项目信息查找领导邮箱
    @Query(value = "SElECT login FROM employee where e_level = 1 and project = ?1", nativeQuery = true)
    String findLeaderByProject(String project);

    //通过项目信息查找管理者信息
    @Query(value = "SElECT login FROM employee where e_level = 2", nativeQuery = true)
    String findAdminByProject();

    //查询年假剩余天数
    @Query(value = "select annual_leave from employee where login = ?1", nativeQuery = true)
    float findAnnualByEmail(String email);

    // 查询调休假天数
    @Query(value = "select vacation_leave from employee where login = ?1", nativeQuery = true)
    float findVacationByEmail(String email);

    @Modifying
    @Query(value = "UPDATE employee SET annual_leave = annual_leave-?2 where login = ?1", nativeQuery = true)
    int updateAnnualLeave(String email, float days);

    @Modifying
    @Query(value = "UPDATE employee SET vacation_leave = vacation_leave-?2 where login = ?1", nativeQuery = true)
    int updateVacationLeave(String email, float days);

    @Modifying
    @Query(value = "UPDATE employee SET annual_leave = annual_leave+?2 where login = ?1", nativeQuery = true)
    int updateAddAnnualLeave(String email, float days);

    @Modifying
    @Query(value = "UPDATE employee SET vacation_leave = vacation_leave+?2 where login = ?1", nativeQuery = true)
    int updateAddVacationLeave(String email, float days);

    // 查找员工邮箱是否存在
    @Query(value = "select count(1) from employee where login = ?1", nativeQuery = true)
    int findCountByLogin(String login);

    // 查找员工表员工个数
    @Query(value = "select count(1) from employee" , nativeQuery = true)
    int findCount();

    // 查询制定范围的员工信息
    @Query(value = "select * from employee limit ?1, ?2", nativeQuery = true)
    List<Employee> findAllByLimit(int start, int count);
    
    // 根据邮箱查找id
    @Query(value="select id from employee where login = ?1", nativeQuery = true)
    int findIdByEmail(String id);
    
	// 根据id删除项目
    @Modifying
    @Query(value = "DELETE FROM employee where id = ?1", nativeQuery = true)
    void deleteById(int id);
}
