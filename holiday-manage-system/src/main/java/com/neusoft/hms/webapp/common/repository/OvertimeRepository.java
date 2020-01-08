package com.neusoft.hms.webapp.common.repository;

import com.neusoft.hms.webapp.common.bean.Overtime;
import java.sql.Timestamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OvertimeRepository extends JpaRepository<Overtime, Integer> {

    //通过员工邮箱查找相关加班信息
    @Query(value = "SELECT * FROM overtime where status=1 and email=?1 order by o_start", nativeQuery = true)
    List<Overtime> findOverTimeInfo(String email);

    //通过员工邮箱、年度查找相关加班信息
    @Query(value = "SELECT * FROM overtime where status=1 and email=?1 and year(o_start)=?2 order by o_start", nativeQuery = true)
    List<Overtime> findYearOverTimeInfo(String email, String searchYear);
    
    //根据邮箱和请假时间查询用户是否已经申请或者录入此时间段
    @Query(value = "SELECT * FROM overtime WHERE email = ?1 AND !(o_start > ?3 OR o_end < ?2)", nativeQuery = true)
    List<Overtime> findExistingDateByEmailAndDate(String email, Timestamp start, Timestamp end);
    
    //通过邮箱和开始时间、结束时间范围查找加班信息
    @Query(value = "SELECT * FROM overtime where email = ?1 AND o_start > ?2 AND o_end < ?3", nativeQuery = true)
    List<Overtime> findOvertimeInfoByEmailAndDate(String email, Timestamp start, Timestamp end);
}
