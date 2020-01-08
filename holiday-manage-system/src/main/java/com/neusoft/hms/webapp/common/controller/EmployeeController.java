package com.neusoft.hms.webapp.common.controller;

import java.util.List;
import javax.annotation.Resource;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.neusoft.hms.webapp.common.bean.Employee;
import com.neusoft.hms.webapp.common.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Resource
    private EmployeeService employee;
    
    @RequestMapping(method = RequestMethod.GET)
    public List<Employee> findEmployees() {
      return employee.findAll();
    }
    
    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public List<Employee> findByName(@PathVariable String name) {
      return employee.findByName(name);
    }

//    @RequestMapping(method = RequestMethod.POST)
//    public Employee addItem(@RequestBody Employee item) {
//        employee.setId(null);
//      return employee.saveAndFlush(item);
//    }
//
//    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
//    public Employee updateItem(@RequestBody Employee updatedItem, @PathVariable int id) {
//      Employee item = employee.getOne(id);
//      // TODO
//      return employee.saveAndFlush(item);
//    }
//
//    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
//    @ResponseStatus(value = HttpStatus.NO_CONTENT)
//    public void deleteItem(@PathVariable int id) {
//        employee.delete(id);
//    }
}
