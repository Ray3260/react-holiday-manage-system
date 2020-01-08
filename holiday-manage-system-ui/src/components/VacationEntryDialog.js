import addIcon from '../images/add.jpg';
import deleteIcon from '../images/reduce.jpg';
import React from 'react';
import 'bootstrap-3-typeahead';
import $ from 'jquery';
import axios from 'axios';
import '../css/VacationEntryDialog.css';
import checkLoginStatus from '../common/checkLoginStatus';

class VacationEntryDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            timeoutId: 0,
            vacationList: [{id: 1, startDate: '', endDate: '', continuousTime: true}],
            listKey: 1
        };
    }
    componentDidMount() {
        let selected = false;
        // 加载typeahead插件
        $("#vacation-entry-username").typeahead({
            minLength: 1,
            items: 20,
            delay: 400,
            fitToElement: true,
            source: (query, process) => {
                axios.get('/userinfo-nameAndEmail',{params: {query: query}}).then((userList) => {
                    return process(userList.data);
                });
            },
            displayText: (item) => {
                if(!selected) {
                    return item.name + " " + item.email;
                } else {
                    selected = false;
                    return item.name;
                }
            },
            highlighter: (item) => {
                let userInfo = item.split(" ");
                return (userInfo[0]+" <small><b>"+userInfo[1]+"</b></small>");
            },
            updater: (item) => {
                this.setState({email: item.email});
                $("#vacation-entry-username").removeClass("is-invalid");
                selected = true;
                return item;
            }
        });
    }
    /*
     * 增加一条休假日期
     */
    addVacationDays = (index) => {
        if(checkLoginStatus()) {
            let list = this.state.vacationList;
            if (list.length < 5) {
                let key = this.state.listKey + 1;
                list.splice(index + 1, 0, {id: key, startDate: '', endDate: '', continuousTime: true});
                this.setState({vacationList: list, listKey: key});
            } else {
                this.openMessageDialog("提示", "输入时间段数最多为5条！");
            }
        }
    };
    /*
     * 减少一条休假日期
     */
    deleteVacationDays = (index) => {
        if(checkLoginStatus()) {
            this.checkDate(index);
            let list = this.state.vacationList;
            if (list.length !== 1) {
                list.splice(index, 1);
                this.setState({vacationList: list});
            }
        }
    };
    /*
     * 添加bootstrap表单验证样式
     */
    addCheckStyle = (...$item) => {
        $item.forEach((item) => {
            item.addClass("is-invalid");
        });
    };
    /*
     * 输入姓名时触发
     */
    changeUserName = () => {
        //过滤姓名
        let name = $("#vacation-entry-username").val();
        if ((name.indexOf(" ") !== -1) || name.length > 5) {
            if(checkLoginStatus()) {
                $("#vacation-entry-username").addClass("is-invalid");
            }
        } else {
            this.checkName();
        }
    };
    /*
     * 验证姓名
     */
    checkName = () => {
        if(checkLoginStatus()) {
            let result = false;
            clearTimeout(this.state.timeoutId);
            let timeoutId = setTimeout(() => {
                result = this.getCheckNameResult();
            }, 500);
            this.setState({timeoutId: timeoutId});
            return result;
        }
    };
    /*
     * 验证姓名，是否为空，是否存在，是否唯一
     */
    getCheckNameResult = () => {
        let query = $("#vacation-entry-username").val();
        let result = false;
        $.ajax({
            type: 'GET',
            url: '/userinfo-nameAndEmail',
            async: false,
            data: {query: query},
            success: (userInfoList) => {
                let $username = $("#vacation-entry-username");
                let email = "";
                let name = $username.val();
                if($username.val() === ""){
                    $username.addClass("is-invalid");
                } else {
                    let repeatList = userInfoList.filter((item) =>{
                        return (name === item.name);
                    });
                    if(repeatList.length === 0) {
                        $username.addClass("is-invalid");
                    } else if(repeatList.length > 1) {
                        $username.addClass("is-invalid");
                    } else if(repeatList.length === 1) {
                        $username.removeClass("is-invalid");
                        email = repeatList[0].email;
                        result = true;
                    }
                }
                this.setState({email: email});
            }
        });
        return result;
    };
    /*
     * 日期输入框聚焦时，去掉表单验证样式
     */
    onDateFocus = (event) => {
        $(event.target).removeClass("is-invalid");
    };
    /*
     * 改变开始日期
     */
    changeStartDate = (index, event) =>{
        let list = this.state.vacationList;
        list[index].startDate = event.target.value;
        this.setState({vacationList: list});
        this.changeDateStatus(index);
    };
    /*
     * 改变结束日期
     */
    changeEndDate = (index, event) => {
        let list = this.state.vacationList;
        list[index].endDate = event.target.value;
        this.setState({vacationList: list});
        this.changeDateStatus(index);
    };
    /*
     * 判断日期是否连续
     */
    changeDateStatus = (index) => {
        let list = this.state.vacationList;
        let startDate = list[index].startDate;
        let endDate = list[index].endDate;
        if (endDate === startDate && endDate !== "" && startDate !== "") {
            list[index].continuousTime = false;
        } else {
            list[index].continuousTime = true;
            $("#dialog-vacation-allDay-"+index).val(1);
        }
        this.checkDate();
        this.setState({vacationList: list});
    };
    /*
     * 验证日期，为空值及重叠日期添加样式
     */
    checkDate = (changedIndex) => {
        $("#vacation-date").find(".is-invalid").removeClass("is-invalid");
        let dateList = [];
        this.state.vacationList.forEach((item, index) => {
            // let $startDate = $("#dialog-vacation-start-"+index);
            // let $endDate = $("#dialog-vacation-end-"+index);
            // if (new Date($startDate.val()).getTime() > new Date($endDate.val()).getTime()) {
            //     $startDate.addClass("is-invalid");
            //     $endDate.addClass("is-invalid");
            //     dateList.push({start: $endDate.val(), end: $startDate.val()});
            // } else {
            //     dateList.push({start: $startDate.val(), end: $endDate.val()});
            // }
            let startDate = new Date(item.startDate).getTime();
            let endDate = new Date(item.endDate).getTime();
            if (startDate > endDate) {
                $("#dialog-vacation-start-"+index).addClass("is-invalid");
                $("#dialog-vacation-end-"+index).addClass("is-invalid");
                dateList.push({start: endDate, end: startDate});
            } else {
                dateList.push({start: startDate, end: endDate});
            }
        });
        let flag = dateList.some(item => {
            return (isNaN(item.start) || isNaN(item.end));
        });
        if (flag) {
            dateList.forEach((item, index) => {
                let $startDate = $("#dialog-vacation-start-" + index);
                let $endDate = $("#dialog-vacation-end-" + index);
                if (isNaN(item.start)) {
                    this.addCheckStyle($startDate);
                } else {
                    $startDate.removeClass("is-invalid");
                }
                if (isNaN(item.end)) {
                    this.addCheckStyle($endDate);
                } else {
                    $endDate.removeClass("is-invalid");
                }
            });
            this.checkOverLappingDate(changedIndex, dateList);
            return false;
        } else {
            return this.checkOverLappingDate(changedIndex, dateList);
        }
    };
    /*
     * 检查重叠日期
     */
    checkOverLappingDate = (changedIndex, dateList) => {
        let repeatFlag = 0;
        // dateList.forEach((item) => {
        //     if (item.start !== "" && item.end !== "") {
        //         item.start = new Date(item.start).getTime();
        //         item.end = new Date(item.end).getTime();
        //     }
        // });
        dateList.forEach((item, index) => {
            if (!isNaN(item.start) && !isNaN(item.end) && index !== changedIndex) {
                let $startDate = $("#dialog-vacation-start-" + index);
                let $endDate = $("#dialog-vacation-end-" + index);
                let startTime = item.start;
                let endTime = item.end;
                dateList.forEach((opt, repeatIndex) => {
                    if (!isNaN(opt.start) && !isNaN(opt.end) && repeatIndex !== changedIndex) {
                        if (repeatIndex !== index) {
                            let $repeatStartDate = $("#dialog-vacation-start-" + repeatIndex);
                            let $repeatEndDate = $("#dialog-vacation-end-" + repeatIndex);
                            let repeatStartTime = opt.start;
                            let repeatEndTime = opt.end;
                            if (!(startTime >repeatEndTime || endTime < repeatStartTime)) {
                                this.addCheckStyle($startDate, $endDate, $repeatStartDate, $repeatEndDate);
                                repeatFlag += 1;
                            }
                        }
                    }
                });
            }
        });
        return repeatFlag === 0;
    };
    /*
     * 检查是否存在已审核或待审批的时间段，避免重复录入
     */
    checkExistingDate = () => {
        let email = this.state.email;
        let vacationDates = [];
        let result = false;
        $("#vacation-date").find(".is-invalid").removeClass("is-invalid");
        this.state.vacationList.forEach((item, index) => {
            if (new Date(item.startDate).getTime() > new Date(item.endDate).getTime()) {
                vacationDates.push(item.endDate + "~" + item.startDate);
            } else {
                vacationDates.push(item.startDate + "~" + item.endDate);
            }
        });
        $.ajax({
            type: "GET",
            url: "/check-vacation-date",
            traditional: true,
            data: {email: email, vacationDates: vacationDates},
            async: false,
            success: (existingDates) => {
                if(existingDates.every((item) => {return item;})) {
                    result = true;
                } else {
                    existingDates.forEach((item, index) => {
                        let $start = $("#dialog-vacation-start-"+index);
                        let $end = $("#dialog-vacation-end-"+index);
                        if (!item) {
                            $start.addClass("is-invalid");
                            $end.addClass("is-invalid");
                            this.openMessageDialog("提示", "存在已审核或待审核的时间段！");
                        } else {
                            $start.removeClass("is-invalid");
                            $end.removeClass("is-invalid");
                        }
                    });
                }
            }
        });
        return result;
    };
    /*
     * 检查用户剩余假期，超出天数提示
     */
    checkVacationRemainingInfo = (days) => {
        let vType = $("#vacation-type").val();
        let result = false;
        $.ajax({
            type: 'GET',
            url: '/vacation-remaining',
            data: {email: this.state.email},
            async: false,
            success: (res) => {
                if (vType === "0") {
                     result = (days <= res.annualLeave);
                } else if (vType === "1") {
                     result = (days <= res.vacationLeave);
                }
                if (!result) {
                    this.openMessageDialog("提示", "录入失败，休假天数超过剩余天数！")
                }
            }
        });
        return result;
    };
    /*
     * 验证表单内容
     */
    checkForm = () => {
        if (checkLoginStatus()) {
            let checkNameResult = this.getCheckNameResult();
            let checkDateResult = this.checkDate();
            if (checkNameResult && checkDateResult) {
                if (this.checkExistingDate()) {
                    return true;
                }
            } else {
                this.openMessageDialog("提示", "输入内容错误！");
            }
        } else {
            this.openMessageDialog("提示", "登录信息过期，请先登录。");
        }
        return false;
    };
    /*
     * 录入请假信息
     */
    entryVacationInfo = () => {
        if (this.checkForm()) {
            let vacationDates = [];
            let days = 0;
            this.state.vacationList.forEach((item, index) => {
                let startDate = null;
                let endDate = null;
                if (new Date(item.startDate).getTime() > new Date(item.endDate).getTime()) {
                    startDate = item.endDate;
                    endDate = item.startDate;
                } else{
                    startDate = item.startDate;
                    endDate = item.endDate;
                }
                let allDay = $("#dialog-vacation-allDay-"+index).val();
                let dateString = null;
                if(item.continuousTime) {
                    dateString = startDate + "~" + endDate + "@1";
                    days += ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000*60*60*24) + 1);
                } else {
                    dateString = startDate + "~" + endDate + "@" + allDay;
                    days += parseFloat(allDay);
                }
                vacationDates.push(dateString);
            });
            let vacationInfo = {
                email: this.state.email,
                type: $("#vacation-type").val(),
                days: days,
                vacationDates: vacationDates,
                remark: $("#vacation-entry-remark").val()
            };
            //录入，检查是否超过剩余天数
            if (this.checkVacationRemainingInfo(days)) {
                axios.post("/vacation-entry", vacationInfo).then((entryResultInfo) => {
                    if (entryResultInfo.data === "录入成功") {
                        this.openMessageDialog("提示", "录入成功！");
                        this.reflashManagePage();
                        $("#vacationEntryDialog").modal("toggle");
                        this.resetModal();
                    } else {
                        this.openMessageDialog("提示", "录入失败！");
                    }
                });
            }
        }
    };
    /*
     * 打开消息modal
     */
    openMessageDialog = (title, message) => {
        let $modal = $("#hint-modal");
        $modal.find("h5").text(title);
        $modal.find("p").text(message);
        $modal.modal("toggle");
        $(".modal-backdrop").css("z-index","9998");
    };
    /*
     * 关闭dialog
     */
    closeVacationEntryDialog = () => {
        this.resetModal();
    };
    /*
     * 重置modal内容
     */
    resetModal = () => {
        $(".is-invalid").removeClass("is-invalid");
        document.getElementById("vacation-entry-form").reset();
        $("#dialog-vacation-start-0").val("");
        $("#dialog-vacation-end-0").val("");
        this.setState({
            email: '',
            timeoutId: 0,
            vacationList: [{id: 1, startDate: '', endDate: '', continuousTime: true}],
            listKey: 1
        });
    };

    reflashManagePage = () => {
        this.props.reflashManagePage();
    };

    render() {
        return (
            <div>
                <div className="modal fade" id="vacationEntryDialog" data-backdrop="static">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg width-600px">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>请假录入</h3>
                                <button type="button" className="close btn btn-outline-light" data-dismiss="modal" onClick={this.closeVacationEntryDialog}>&times;</button>
                            </div>
                            <div className="modal-body ml-4 height-450px">
                                <form id="vacation-entry-form">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text col-3 modal-input">姓名：</span>
                                        <input id="vacation-entry-username" className="form-control typeahead col-7 modal-input rounded-right" data-provide="typeahead"
                                               type="text" autoComplete="off" placeholder="请输入用户姓名" onChange={this.changeUserName} onPaste={this.checkName}/>
                                        <div className="invalid-feedback">姓名输入错误</div>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text col-3 modal-input">请假类型：</span>
                                        <select id="vacation-type" className="form-control col-7 modal-input"  defaultValue={1}>
                                            <option value={1}>调休假</option>
                                            <option value={0}>年假</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <hr />
                                        <div className="mb-3">
                                            <span>休假日期：</span>
                                        </div>
                                        <div id="vacation-date">
                                            <div>
                                                {this.state.vacationList.map((item, index) => {
                                                    return (
                                                        <div className="row input-group mb-1 mr-0 ml-0" key={item.id} id={"dialog-vacationInfo-"+index}>
                                                            <div className="col-4 pl-0 pr-0">
                                                                <input id={"dialog-vacation-start-"+index} className="form-control pl-2 pr-2 modal-input" type="date" onChange={this.changeStartDate.bind(this, index)} onFocus={this.onDateFocus} onBlur={this.changeDateStatus.bind(this, index)}/>
                                                                <div className="invalid-feedback">日期输入错误</div>
                                                            </div>
                                                            <span className="pl-1 pr-1">~</span>
                                                            <div className="col-4 pl-0 pr-2">
                                                                <input id={"dialog-vacation-end-"+index} className="form-control pl-2 pr-2 modal-input" type="date" onChange={this.changeEndDate.bind(this, index)} onFocus={this.onDateFocus} onBlur={this.changeDateStatus.bind(this, index)}/>
                                                                <div className="invalid-feedback">日期输入错误</div>
                                                            </div>
                                                            <div>
                                                                <select id={"dialog-vacation-allDay-"+index} className="form-control pl-1 pr-1 modal-input" defaultValue={1} disabled={item.continuousTime}>
                                                                    <option value={1}>全天</option>
                                                                    <option value={0.5}>半天</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-1 pl-2 pr-0 mr-n2">
                                                                <button type="button" className="btn btn-outline-light btn-sm pl-0 pr-0" onClick={this.addVacationDays.bind(this, index)}>
                                                                    <img src={addIcon} alt="" width="25px" height="25px" /></button>
                                                            </div>
                                                            <div className="col-1 pl-2 ml-n2">
                                                                {index !== 0
                                                                    ? (<button type="button" className="btn btn-outline-light btn-sm pl-0 pr-0" onClick={this.deleteVacationDays.bind(this, index)}>
                                                                        <img src={deleteIcon} alt="" width="25px" height="25px"/></button>)
                                                                    : null}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                    <div className="d-flex align-items-end">
                                        <span>备注：</span>
                                    </div>
                                    <div>
                                        <textarea id="vacation-entry-remark" className="form-control col-10 modal-input" rows="4" maxLength={50}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" type="button" data-dismiss="modal" onClick={this.closeVacationEntryDialog}>取消</button>
                                <button className="btn btn-outline-primary" type="button" onClick={this.entryVacationInfo}>录入</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default VacationEntryDialog;