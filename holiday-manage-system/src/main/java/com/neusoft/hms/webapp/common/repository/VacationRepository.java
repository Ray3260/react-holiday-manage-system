package com.neusoft.hms.webapp.common.repository;

import com.neusoft.hms.webapp.common.bean.Vacation;
import java.sql.Timestamp;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface VacationRepository extends JpaRepository<Vacation, Long> {

    // 获取指定用户休过的假期
    @Query(value="SELECT * FROM vacation where email = ?1 and v_type = ?2 and (v_start >= ?3 or ?3 is null)" +
            "and (v_start <= ?4 or ?4 is null) order by v_start desc", nativeQuery=true)
    List<Vacation> findUsedVacations(String email, int dateType, Timestamp startDate, Timestamp endDate);

    // 查询级别为0请假未审批的员工信息
    @Query(value = "select * from vacation v where status = ?1 and email in" +
            "(select login from employee where project = ?2 and e_level = ?3 - 1) order by v.v_start desc limit ?4, ?5 ",
            nativeQuery = true)
    List<Vacation> findByStatus(int status, String project, int e_level, int start, int count);

    // 查询级别为0请假已审批的员工信息
    @Query(value = "select * from vacation v where (status = ?1 or status = ?1 + 2) and email in" +
            "(select login from employee where project = ?2 and e_level = ?3 - 1) order by v.v_start desc limit ?4, ?5 ",
            nativeQuery = true)
    List<Vacation> findByApprovalStatus(int status, String project, int e_level, int start, int count);

    // 查询级别为1,2请假未审批的员工信息
    @Query(value = "select * from vacation v where status = ?1 + 1 and email in" +
            "(select login from employee where (e_level = ?2 or e_level = ?2 - 1))" +
            "order by v.v_start desc limit ?3, ?4", nativeQuery = true)
    List<Vacation> findByStatusAndLevel(int status, int e_level, int start, int count);

    // 查询级别为1,2请假已审批的员工信息
    @Query(value = "select * from vacation v where (status = ?1 + 1 or status = ?1 + 2) and email in" +
            "(select login from employee where (e_level = ?2 or e_level = ?2 - 1))" +
            "order by v.v_start desc limit ?3, ?4", nativeQuery = true)
    List<Vacation> findByApprovalStatusAndLevel(int status, int e_level, int start, int count);

    // 查询请假未审批数据的数量
    @Query(value = "select count(*) from vacation v where status = ?1 and email in" +
            "(select login from employee where project = ?2 and e_level = ?3 - 1)", nativeQuery = true)
    int findCount(int status, String project, int e_level);

    // 查询请假已审批数据的数量
    @Query(value = "select count(*) from vacation v where (status = ?1 or status = ?1 + 2) and email in" +
            "(select login from employee where project = ?2 and e_level = ?3 - 1)", nativeQuery = true)
    int findApprovalCount(int status, String project, int e_level);

    // 查询所有请假未审批数据的数量
    @Query(value = "select count(1) from vacation v where status = ?1 + 1 and email in " +
            "(select login from employee where (e_level = ?2 or e_level = ?2 - 1))", nativeQuery = true)
    int findCountByLevel(int status, int e_level);

    // 查询所有请假已审批数据的数量
    @Query(value = "select count(1) from vacation v where (status = ?1 + 1 or status = ?1 + 2) and email in " +
            "(select login from employee where (e_level = ?2 or e_level = ?2 - 1))", nativeQuery = true)
    int findApprovalCountByLevel(int status, int e_level);

    // 保存请假信息
    @Modifying
    @Query(value = "update vacation v set v.status = ?1, v.approver_comment = ?2, approver_number = ?5," +
            "approval_time = ?6 where v.email = ?3 and v_start = ?4", nativeQuery = true)
    void updateByEmail(String status, String approval_reason, String email, Timestamp vStart, String admin, Timestamp date);

    // 保存请假审批的状态
    @Modifying
    @Query(value = "update vacation v set v.status = ?1 where v.email = ?2 and v_start = ?3", nativeQuery = true)
    void updateStatusByEmail(String status, String email, Timestamp vStart);
    
    @Modifying
    @Query(value = "update vacation v set v.status = ?1 where v.email = ?2 and v_start between ?3 and ?4", nativeQuery = true)
    void updateStatusByEmailRevoke(String status, String email, Timestamp vStart_1, Timestamp vStart_2);

    //通过用户和休假类型查找相关休假信息
    @Query(value = "SELECT * FROM vacation where status=2 and v_type=?2 and email=?1 order by v_start", nativeQuery = true)
    List<Vacation> findVacationInfo(String email, int vacationType);

    //通过用户名、假期类型、年度查找相关休假信息
    @Query(value = "SELECT * FROM vacation where status=2 and v_type=?2 and email=?1 and year(v_start)=?3 order by v_start", nativeQuery = true)
    List<Vacation> findYearVacationInfo(String email, int vacationType, String searchYear);
    
    //根据邮箱和请假时间查询用户是否已经申请或者录入此时间段
    @Query(value = "SELECT * FROM vacation WHERE email = ?1 AND status < 3 AND !(v_start > ?3 OR v_end < ?2)", nativeQuery = true)
    List<Vacation> findExistingDateByEmailAndDate(String email, Timestamp start, Timestamp end);
}
