package com.neusoft.hms.webapp.common.controller;

import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import com.neusoft.hms.webapp.common.service.OvertimeService;
import com.neusoft.hms.webapp.common.service.VacationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/holiday-manage/search")
public class ManageController {
    @Autowired
    private EmployeeService employee;
    @Autowired
    private OvertimeService overtime;
    @Autowired
    private VacationService vacation;

    @RequestMapping(path = "/search-info/{vacationType}", method = RequestMethod.GET)
    public Map<String, Object> ManageInfo(@PathVariable(value = "vacationType") int vacationType,
                                          @RequestParam("searchEmail") String searchEmail, @RequestParam("searchYear") String searchYear,
                                          @RequestParam("showRowsNum") Integer showRowsNum, @RequestParam("showPageNO") Integer showPageNO) {
        Map<String, Object> eVacationInfoMap = new HashMap<>();
        List<Map<?, Object>> eVacationInfoList = new ArrayList<>();
        // 判断是否是单一邮箱查寻，是只查找对应邮箱账号信息
        if ("null".equals(searchEmail)) {
            // 查找全部账号休假信息
            employee.findAll().forEach((e) -> {
                List<Map<String, Object>> employeeInfoList = getEmployeeInfoList(e, vacationType, searchYear);
                if (employeeInfoList.size() != 0) {
                    eVacationInfoList.addAll(employeeInfoList);
                }
            });
        } else {
            // 查找单一账号休假信息
            employee.listFindByEmail(searchEmail).forEach((e) -> {
                List<Map<String, Object>> employeeInfoList = getEmployeeInfoList(e, vacationType, searchYear);
                if (employeeInfoList.size() != 0) {
                    eVacationInfoList.addAll(employeeInfoList);
                }
            });
        }
        // 分页功能
        int totalCount = eVacationInfoList.size();
        int pageCount = 0;
        int pageRestRows = totalCount % showRowsNum;
        if (pageRestRows > 0) {
            pageCount = totalCount / showRowsNum + 1;
        } else {
            pageCount = totalCount / showRowsNum;
        }
        eVacationInfoMap.put("totalPage", pageCount);
        List<Map<?, Object>> eVacationPageInfoList = new ArrayList<>();
        if (totalCount - (showPageNO - 1) * showRowsNum > showRowsNum) {
            eVacationPageInfoList = eVacationInfoList.subList((showPageNO - 1) * showRowsNum,
                    (showPageNO - 1) * showRowsNum + showRowsNum);
        } else {
            eVacationPageInfoList = eVacationInfoList.subList((showPageNO - 1) * showRowsNum, totalCount);
        }
        eVacationInfoMap.put("eVacationPageInfoList", eVacationPageInfoList);
        return eVacationInfoMap;
    }

    private List<Map<String, Object>> getEmployeeInfoList(Employee e, int vacationType, String searchYear) {
        Float vacationTotal = null;
        if (vacationType == 1) {
            vacationTotal = e.getVacation_leave();
        }
        if (vacationType == 0) {
            vacationTotal = e.getAnnual_leave();
        }
        List<Integer> Years = new ArrayList<>();
        List<Date> expiringStatusList = new ArrayList<>();
        int status = 0;
        // 判断是否是查找固定年度信息
        if ("null".equals(searchYear)) {
            // 查找全部信息，并按每一年度进行划分
            // 如果是查寻串休假期依照加班时间来判断
            if (vacationType == 1) {
                overtime.findOverTimeInfo(e.getLogin()).forEach((date) -> {
                    // 检查加班串休假是否过期
                    expiringStatusList.add(date.getOStart());
                    Years.add(Integer.valueOf(date.getOStart().toString().substring(0, 4)));
                });
                status = EVEexpiringStatus(expiringStatusList, e.getVacation_leave());
            }
            vacation.findVacationInfo(e.getLogin(), vacationType).forEach((date) -> {
                Years.add(Integer.valueOf(date.getVStart().toString().substring(0, 4)));
            });
            if (vacationType == 0) {
                status = AVExpiringStatus(e.getAnnual_leave(), e.getOfficial());
            }
        } else {
            // 查找固定年度信息
            Years.add(Integer.valueOf(searchYear.substring(0, 4)));
        }
        List<Map<String, Object>> vacationOvertimeList = new ArrayList<>();
        Float finalVacationTotal = vacationTotal;
        // 年度去重
        Collections.sort(Years);
        Collections.reverse(Years);
        int finalStatus = status;
        // 对员工列表中的成员
        forEachIndex(0, Years.stream().distinct().collect(Collectors.toList()), (index, year) -> {
            // 信息第一条需要参数
            if (index == 0) {
                Map<String, Object> vacationOvertimeMap = getVacationOvertimeMap(vacationType, year.toString(),
                        e.getLogin(), finalVacationTotal, e.getName(), finalStatus, e.getOfficial());
                if (!vacationOvertimeMap.isEmpty()) {
                    vacationOvertimeList.add(vacationOvertimeMap);
                }
            } else {
                Map<String, Object> vacationOvertimeMap = getVacationOvertimeMap(vacationType, year.toString(),
                        e.getLogin(), null, null, 0, -1);
                if (!vacationOvertimeMap.isEmpty()) {
                    vacationOvertimeList.add(vacationOvertimeMap);
                }
            }
        });
        return vacationOvertimeList;
    }

    // 个人每年度假期信息
    private Map<String, Object> getVacationOvertimeMap(int vacationType, String searchYear, String email,
                                                       Float vacationTotal, String name, int status, int Official) {
        Map<String, Object> vacationOverTimeMap = new HashMap<>();
        // 串休假
        List<String> overTimeDate = new ArrayList<>();
        if (vacationType == 1) {
            // 加班时间字符串
            AtomicReference<Double> overTimeDay = new AtomicReference<>((double) 0);
            overtime.findYearOverTimeInfo(email, searchYear).forEach((o) -> {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");// 可以方便地修改日期格�?
                String oStart = dateFormat.format(o.getOStart());
                String oEnd = dateFormat.format(o.getOEnd());
                if (oStart.equals(oEnd)) {
                    if (o.getAllDay() == 0) {
                        oStart += "(0.5)";
                        overTimeDay.updateAndGet(v1 -> v1 + 0.5);
                    } else {
                        overTimeDay.updateAndGet(v1 -> v1 + 1);
                    }
                } else {
                    oStart += ("~" + oEnd);
                    overTimeDay.updateAndGet(v1 -> v1 + 1 + getDays(o.getOStart(), o.getOEnd()));
                }
                overTimeDate.add(oStart + " ");
            });
            vacationOverTimeMap.put("overTimeDay", overTimeDay);
            vacationOverTimeMap.put("overTimeDate", overTimeDate);
        }
        if (vacationType == 0) {
            int annualTotal = 5;
            vacationOverTimeMap.put("annualTotal", annualTotal);
        }
        AtomicReference<Double> vacationDay = new AtomicReference<>((double) 0);
        List<String> vacationDate = new ArrayList<>();
        // 休假字符串
        vacation.findYearVacationInfo(email, vacationType, searchYear).forEach((v) -> {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
            String vStart = dateFormat.format(v.getVStart());
            String vEnd = dateFormat.format(v.getVEnd());
            if (vStart.equals(vEnd)) {
                if (v.getAllDay() == 0) {
                    vStart += "(0.5)";
                    vacationDay.updateAndGet(v1 -> v1 + 0.5);
                } else {
                    vacationDay.updateAndGet(v1 -> v1 + 1);
                }
            } else {
                vStart += ("~" + vEnd);
                vacationDay.updateAndGet(v1 -> v1 + getDays(v.getVStart(), v.getVEnd()) + 1);
            }
            vacationDate.add(vStart + " ");
        });
        switch (Official) {
            case 0:
                name += " (正式)";
                break;
            case 1:
                name += " (协力)";
                break;
            case 2:
                name += " (实习生)";
                break;
            default:
                break;
        }
        vacationOverTimeMap.put("official", Official);
        vacationOverTimeMap.put("vacationDate", vacationDate);
        vacationOverTimeMap.put("vacationDay", vacationDay);
        vacationOverTimeMap.put("vacationTotal", vacationTotal);
        vacationOverTimeMap.put("name", name);
        if (Official != -1) {
            vacationOverTimeMap.put("email", email);
        }
        vacationOverTimeMap.put("Year", searchYear);
        vacationOverTimeMap.put("status", status);
        if (vacationType == 1 && (vacationDate.size() == 0 && overTimeDate.size() == 0)) {
            vacationOverTimeMap.clear();
        } else if (vacationType != 1 && vacationDate.size() == 0) {
            vacationOverTimeMap.clear();
        }
        return vacationOverTimeMap;
    }

    // 计算串休是否将要过期
    private Integer EVEexpiringStatus(List<Date> Date, float vacation_leave) {
        int remindMassage = 0;
        if (Date.size() > vacation_leave) {
            int vacationLeave = (int) vacation_leave;
            int lastDay = Date.size() - 1 - vacationLeave;
            for (int i = (Date.size() - 1); i > lastDay; i--) {
                Date.remove(i);
            }
            Calendar startday = Calendar.getInstance();
            startday.setTime((java.util.Date) Date.get(Date.size() - 1));
            Date now = new Date();
            Calendar endday = Calendar.getInstance();
            endday.setTime(now);
            int remindDay = getIntervalDays(startday, endday);
            remindMassage = remindDay >= 173 && remindDay <= 180 ? 1 : 0;
        } else {
            // 剩余串休假大于总加班天数
            remindMassage = 2;
        }
        return remindMassage;
    }

    // 计算年假是否将要逾期
    private Integer AVExpiringStatus(float annual_leave, int Official) {
        float leaveDay = 0;
        //正式员工年假两年有效期
        if (Official == 0) {
            leaveDay = annual_leave - 5;

        } else if (Official == 1) {
            leaveDay = annual_leave;
        }
        Calendar cale = Calendar.getInstance();
        int month = cale.get(Calendar.MONTH) + 1;
        int remindMassage = 0;
        if (month == 12 && leaveDay > 0) {
            remindMassage = 3;
        }
        return remindMassage;
    }

    // 计算串休剩余最早一天与今天的天数差
    private int getIntervalDays(Calendar startday, Calendar endday) {
        long startTime = startday.getTimeInMillis();
        long endTime = endday.getTimeInMillis();
        long time = endTime - startTime;
        return (int) (time / (1000 * 60 * 60 * 24));
    }

    // 计算请假天数
    private int getDays(Date Start, Date End) {
        Calendar startDay = Calendar.getInstance();
        startDay.setTime(Start);
        Calendar endDay = Calendar.getInstance();
        endDay.setTime(End);
        return getIntervalDays(startDay, endDay);
    }

    // forEach附加方法，添加遍历时index
    private static <T> void forEachIndex(int startIndex, Iterable<? extends T> elements,
                                         BiConsumer<Integer, ? super T> action) {
        Objects.requireNonNull(elements);
        Objects.requireNonNull(action);
        if (startIndex < 0) {
            startIndex = 0;
        }
        int index = 0;
        for (T element : elements) {
            index++;
            if (index <= startIndex) {
                continue;
            }
            action.accept(index - 1, element);
        }
    }
}