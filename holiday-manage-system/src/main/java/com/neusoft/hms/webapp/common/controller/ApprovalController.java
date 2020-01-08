package com.neusoft.hms.webapp.common.controller;

import com.neusoft.hms.webapp.common.bean.*;
import com.neusoft.hms.webapp.common.util.DateUtil;
import com.neusoft.hms.webapp.common.service.ApprovalService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class ApprovalController {

    @Resource
    private ApprovalService approvalService;

    /**
     * GET请求获取请假员工的信息
     * */
    @GetMapping("/user-approval")
    public GetApprovalData getEmployeeItem(@RequestParam String page, @RequestParam String start,
                                           @RequestParam String count, @RequestParam String admin) throws ParseException {

        int status = 0;
        Employee employee = approvalService.findByLogin(admin);
        int totalCount = (employee.getE_level() == 1)
                ? approvalService.findCount(status, employee.getProject(), employee.getE_level())
                : approvalService.findCountByLevel(status, employee.getE_level());

        int currCount = totalCount - Integer.parseInt(start);
        double currTotalPage = (currCount % Integer.parseInt(count) == 0)
                ? Math.floor((double) currCount / Integer.parseInt(count))
                : Math.floor((double) currCount / Integer.parseInt(count)) + 1;

        List<ApprovalEmployee> approvalList = (currCount < Integer.parseInt(count))
                ? subApprovalList(status, employee.getProject(), employee.getE_level(), Integer.parseInt(start), currCount)
                : subApprovalList(status, employee.getProject(), employee.getE_level(), Integer.parseInt(start), Integer.parseInt(count));
        GetApprovalData getApprovalData = new GetApprovalData();
        getApprovalData.setApprovalList(approvalList);
        getApprovalData.setTotalPage(currTotalPage + Integer.parseInt(page));
        return getApprovalData;
    }

    /**
     * 返回截取的数据
     * */
    private List<ApprovalEmployee> subApprovalList(int status, String project, int e_level, int startIndex, int preTotalCount)
            throws ParseException {
        ArrayList<ApprovalEmployee> approvalList = new ArrayList<>();
        List<Vacation> list = (e_level == 1)
                ? approvalService.findByStatus(status, project, e_level, startIndex, preTotalCount)
                : approvalService.findByStatusAndLevel(status, e_level, startIndex, preTotalCount);
        for (Vacation item : list) {
            String name = approvalService.findNameByEmail(item.getEmail());
            ApprovalEmployee approvalEmployee = new ApprovalEmployee(name,null, item.getEmail(), null,
                    null, null, item.getContact(), item.getReason(), null, null);
            switch (item.getVType()){
                case 0:
                    approvalEmployee.setType("年假");
                    break;
                case 1:
                    approvalEmployee.setType("调休假");
                    break;
                case 2:
                    approvalEmployee.setType("事假");
                    break;
                default:
                    break;
            }
            approvalEmployee.setYear(item.getVStart().toString().substring(0,4));
            String[] startSplit = item.getVStart().toString().split("\\s");
            String[] endSplit = item.getVEnd().toString().split("\\s");
            approvalEmployee.setTimes(startSplit[0] + "~" + endSplit[0]);
            if (item.getAllDay() == 0) {
                approvalEmployee.setDays("0.5");
            } else {
                String days = getDays(item.getVStart().toString(), item.getVEnd().toString());
                approvalEmployee.setDays(days);
            }
            approvalList.add(approvalEmployee);
        }
        return approvalList;
    }

    /**
     * 返回已审批请假员工的信息
     */
    @GetMapping("/did-user-approval")
    public GetApprovalData getDidEmployeeItem(@RequestParam String page, @RequestParam String start,
                                              @RequestParam String count, @RequestParam String admin) throws ParseException {
        int status = 1;
        Employee employee = approvalService.findByLogin(admin);
        int totalCount = (employee.getE_level() == 1)
                ? approvalService.findApprovalCount(status, employee.getProject(), employee.getE_level())
                : approvalService.findApprovalCountByLevel(status, employee.getE_level());

        int currCount = totalCount - Integer.parseInt(start);
        double currTotalPage = (currCount % Integer.parseInt(count) == 0)
                ? Math.floor((double) currCount / Integer.parseInt(count))
                : Math.floor((double) currCount / Integer.parseInt(count)) + 1;

        List<ApprovalEmployee> approvalList = (currCount < Integer.parseInt(count))
                ? subDidApprovalList(status, employee.getProject(), employee.getE_level(), Integer.parseInt(start), currCount)
                : subDidApprovalList(status, employee.getProject(), employee.getE_level(), Integer.parseInt(start), Integer.parseInt(count));
        GetApprovalData getApprovalData = new GetApprovalData();
        getApprovalData.setApprovalList(approvalList);
        getApprovalData.setTotalPage(currTotalPage + Integer.parseInt(page));
        return getApprovalData;
    }

    /**
     * 截取请假已审批员工的数据
     * */
    private List<ApprovalEmployee> subDidApprovalList(int status, String project, int e_level, int startIndex, int preTotalCount)
            throws ParseException {
        ArrayList<ApprovalEmployee> approvalList = new ArrayList<>();
        List<Vacation> list = (e_level == 1)
                ? approvalService.findByApprovalStatus(status, project, e_level, startIndex, preTotalCount)
                : approvalService.findByApprovalStatusAndLevel(status, e_level, startIndex, preTotalCount);
        for (Vacation item : list) {
            String name = approvalService.findNameByEmail(item.getEmail());
            ApprovalEmployee approvalEmployee = new ApprovalEmployee(name,null, item.getEmail(), null,
                    null, null, item.getContact(), item.getReason(), item.getApproverComment(),null);
            switch (item.getVType()){
                case 0:
                    approvalEmployee.setType("年假");
                    break;
                case 1:
                    approvalEmployee.setType("调休假");
                    break;
                case 2:
                    approvalEmployee.setType("事假");
                    break;
                default:
                    break;
            }
            switch (item.getStatus()) {
                case 1:
                    approvalEmployee.setStatus("审批中");
                    break;
                case 2:
                    approvalEmployee.setStatus("同意");
                    break;
                case 3:
                    approvalEmployee.setStatus("拒绝");
                    break;
                default:
                    break;
            }
            approvalEmployee.setYear(item.getVStart().toString().substring(0,4));
            String[] startSplit = item.getVStart().toString().split("\\s");
            String[] endSplit = item.getVEnd().toString().split("\\s");
            approvalEmployee.setTimes(startSplit[0] + "~" + endSplit[0]);
            if (item.getAllDay() == 0) {
                approvalEmployee.setDays("0.5");
            } else {
                String days = getDays(item.getVStart().toString(), item.getVEnd().toString());
                approvalEmployee.setDays(days);
            }
            approvalList.add(approvalEmployee);
        }
        return approvalList;
    }

    /**
     * 查询总天数
     * */
    @PostMapping("/user-days")
    public List<Float> getUserDays(@RequestBody List<Map<String, String>> dataList) {
        List<Float> list = new ArrayList<>();
        for (Map<String, String> map : dataList) {
            switch (map.get("type")) {
                case "年假":
                    list.add((approvalService.findAnnualByEmail(map.get("email"))));
                    break;
                case "调休假":
                    list.add(approvalService.findVacationByEmail(map.get("email")));
                    break;
                default:
                    break;
            }
        }
        return list;
    }

    /**
     * 请假审批结果信息存入
     * */
    @PostMapping("/holiday-approval")
    public void postUserApprovalInfo(@RequestBody List<PostApprovalInfo> dataItem) {
        for (PostApprovalInfo data : dataItem) {
            // 审批者员工信息
            Employee employee = approvalService.findByLogin(data.getAdmin());
            // 申请者员工信息
            Employee applyEmploy = approvalService.findByLogin(data.getEmail());
            // 抄送者list
            ArrayList<String> ccList = new ArrayList<>();
            //邮件标题
            String title = applyEmploy.getName() + data.getType() + "申请";
            if ("1".equals(data.getStatus())) {
                approvalService.updateStatusByEmail(data.getStatus(), data.getEmail(), getStartTime(data.getTime()));
                // 发送邮件提醒
                String comment = applyEmploy.getName() + " 您好：" + '\r' + '\r' + "       您申请的" + data.getType()
                        + "，共计" + data.getDays() + "天，已审批通过。" + '\r' + '\r' + "审批者：" + '\r' + "       "
                        + employee.getName();
                new EmailSendRestController().sendEmail(new EmailSendInfo(employee.getLogin(), employee.getPassword(),
                        data.getEmail(), ccList, title, comment));
            } else if ("2".equals(data.getStatus())) {
                switch (data.getType()) {
                    case "年假":
                        approvalService.updateAnnualLeave(data.getEmail(), Float.parseFloat(data.getDays()));
                        break;
                    case "调休假":
                        approvalService.updateVacationLeave(data.getEmail(), Float.parseFloat(data.getDays()));
                        break;
                    default:
                        break;
                }
                approvalService.updateByEmail(data.getStatus(), data.getApproval_reason(), data.getEmail(),
                        getStartTime(data.getTime()), data.getAdmin(), getDateTime(data.getDate()));
                // 发送邮件提醒
                String comment = applyEmploy.getName() + " 您好：" + '\r' + '\r' + "       您申请的" + data.getType()
                        + "，共计" + data.getDays() + "天，已审批通过。" + '\r' + '\r' + "审批者：" + '\r' + "       "
                        + employee.getName();
                new EmailSendRestController().sendEmail(new EmailSendInfo(employee.getLogin(), employee.getPassword(),
                        data.getEmail(), ccList, title, comment));
            } else {
                approvalService.updateByEmail(data.getStatus(), data.getApproval_reason(), data.getEmail(),
                        getStartTime(data.getTime()), data.getAdmin(), getDateTime(data.getDate()));
                // 发送邮件提醒
                String comment = applyEmploy.getName() + " 您好：" + '\r' + '\r' + "       您申请的" + data.getType()
                        + "，共计" + data.getDays() + "天，不好意思，已拒绝。" + '\r' + '\r' + "审批者：" + '\r'
                        + "       " + employee.getName();
                new EmailSendRestController().sendEmail(new EmailSendInfo(employee.getLogin(), employee.getPassword(),
                        data.getEmail(), ccList, title, comment));
            }
        }
    }

    /**
     * 计算请假总天数
     * */
    private String getDays(String vStart, String vEnd) throws ParseException {
        long startTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(vStart).getTime();
        long endTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(vEnd).getTime();
        long time = endTime - startTime;
        return String.valueOf(time / 1000 / 60 / 60 /24 + 1);
    }

    /**
     * 毫秒值转换为Timestamp
     * */
    private Timestamp getDateTime(long time) {
        Date date = new Date();
        date.setTime(time);
        String str = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
        return DateUtil.stringToTimestamp(str);
    }

    /**
     * 开始时间转换为Timestamp
     * */
    private Timestamp getStartTime(String time) {
        String[] split = time.split("~");
        split[0] += " 00:00:00";
        return DateUtil.stringToTimestamp(split[0]);
    }
}
