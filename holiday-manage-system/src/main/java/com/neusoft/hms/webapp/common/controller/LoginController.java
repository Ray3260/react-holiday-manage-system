package com.neusoft.hms.webapp.common.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.bean.LoginData;
import com.neusoft.hms.webapp.common.bean.Project;
import com.neusoft.hms.webapp.common.service.EmployeeService;
import com.neusoft.hms.webapp.common.service.ProjectService;

@RestController
public class LoginController {

	private static final Logger LOGGER =
			LoggerFactory.getLogger(LoginController.class);
    @Resource
    private EmployeeService employee;
    
    @Resource
    private ProjectService project;

    /**
     * 登入操作
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Map<String, Object> login(HttpServletRequest request, HttpServletResponse response, @RequestBody LoginData item)
            throws IOException {
        Map<String, Object> result = new HashMap<>();
        List<Employee> employees = employee.findLoginUser(item.getLogin(), item.getPassword());
        if (!employees.isEmpty()) {
            HttpSession session = request.getSession();
            response.setContentType("text/html;charset=utf-8");
            session.setMaxInactiveInterval(3600);
            result.put("userInfo", employees.get(0).getLogin());
            result.put("isAccess", true);
            result.put("isManager", employees.get(0).getE_level());
            LOGGER.info("登录成功");
        } else {
            result.put("isAccess", false);
            result.put("isManager", -1);
            LOGGER.info("登录失败");
        }
        return result;
    }
    
    /**
     * 登出操作
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        HttpSession session = request.getSession(false);
        String result = "failed";
        if (session != null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (URLDecoder.decode(cookie.getValue(), "utf-8").equals(session.getId())) {
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);
                        result = "succeed";
                    }
                }
            }
            session.invalidate();
        }
        return result;
    }
    
    /**
     * 检查登录状态
     */
    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public String findCookie(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        HttpSession session = request.getSession(false);
        if (session != null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (URLDecoder.decode(cookie.getValue(), "utf-8").equals(session.getId())) {
                        return "isChecked";
                    }
                }
            }
        }
        return "noCheck";
    }
    /**
     * 获取登录者信息
     */
    @GetMapping(value="/personal")
    public Map<String, String> personal(@RequestParam String userInfo){
    	Map<String,String> result = new HashMap<>();
    	Employee e = employee.findByEmail(userInfo);
    	
    	result.put("email", e.getLogin());
    	result.put("name", e.getName());
    	result.put("vacationLeave", String.valueOf(e.getVacation_leave()));
    	result.put("annualLeave", String.valueOf(e.getAnnual_leave()));
    	result.put("eLevel", String.valueOf(e.getE_level()));
    	
    	Project p = project.findByPNumber(e.getProject());
    	LOGGER.info("查询项目信息成功");
    	result.put("project", p.getpName());
    	return result;
    }
}
