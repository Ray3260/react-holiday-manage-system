import addIcon from '../images/add.jpg';
import deleteIcon from '../images/reduce.jpg';
import React from 'react';
import 'bootstrap-3-typeahead';
import $ from 'jquery';
import axios from 'axios';
import checkLoginStatus from '../common/checkLoginStatus';
require('../css/WorkEntryDialog.css');

class WorkEntryDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeoutId: 0,
            WorkList: [{ id: 1, date: this.getDateString(), continuousTime: true }],
            listKey: 1
        }
    }
    componentDidMount() {
        if (checkLoginStatus()) {
            let selected = false;
            // 加载typeahead插件
            $("#work-entry-username").typeahead({
                minLength: 1,
                items: 20,
                delay: 400,
                fitToElement: true,
                source: (query, process) => {
                    axios.get('/userinfo-nameAndEmail', { params: { query: query } }).then((userList) => {
                        return process(userList.data);
                    });
                },
                displayText: (item) => {
                    if (!selected) {
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
                    $("#work-entry-email").val(item.email);
                    $("#work-entry-username").removeClass("is-invalid");
                    selected = true;
                    return item;
                }
            });
        }
    }

    /*
     * 获取当天日期字符串
     */

    getDateString = () => {
        let date = new Date();
        let month = ((date.getMonth() + 1) < 10)
            ? "0" + (date.getMonth() + 1)
            : (date.getMonth() + 1);
        let day = (date.getDate() < 10)
            ? "0" + date.getDate()
            : date.getDate();
        return date.getFullYear() + "-" + month + "-" + day;
    };
    /*
     * 获取匹配用户列表
     */
    getUserList = (event) => {
        let query = event.target.value;
        axios.get('/userinfo-nameAndEmail', { params: { query: query } }).then((userList) => {
            this.setState({ userList: userList.data });
        });
    };
    /*
     * 增加一条加班日期
     */
    addWorkDays = (index) => {
        let list = this.state.WorkList;
        if (list.length < 5) {
            let key = this.state.listKey + 1;
            list.splice(index + 1, 0, {id: key, continuousTime: true});
            this.setState({WorkList: list, listKey: key, days: this.state.days + 1});
        } else {
            this.openMessageDialog("提示", "输入时间段数最多为5条！");
        }
    };
    /*
     * 减少一条加班日期
     */
    deleteWorkDays = (index) => {
        this.checkDate(index);
        let list = this.state.WorkList;
        if (list.length !== 1) {
            let days = document.getElementById("dialog-select-" + index).value;
            list.splice(index, 1);
            this.setState({ WorkList: list, days: this.state.days - days });
        }
    };
    /*
     * 全半天切换
     */
    onDaysToggle = (event) => {
        let val = parseFloat(event.target.value);
        if (val === 0.5) {
            this.setState({ days: this.state.days - 0.5 });
        } else if (val === 1) {
            this.setState({ days: this.state.days + 0.5 });
        }
    };
    /*
     * 判断日期是否连续
     * continuousTime为true是隐藏，false为显示
     */
    changeDateStatus = (index) => {
        let list = this.state.WorkList;
        let id = list[index].id;
        let $start = $("#dialog-work-start-" + index);
        let $end = $("#dialog-work-end-" + index);
        let startDate = $start.val();
        let endDate = $end.val();
        if (endDate === startDate && endDate !== "" && startDate !== "") {
            list.splice(index, 1, { id: id, continuousTime: false});
        } else {
            list.splice(index, 1, { id: id, continuousTime: true });
            $("#dialog-select-"+index).val(1);
        }
        this.checkDate();
        this.setState({ WorkList: list });
    };

    /*
     * 检查是否存在已审核或待审批的时间段，避免重复录入
     */
    checkExistingDate = () => {
        let email = $("#work-entry-email").val();
        let WorkDates = [];
        let result = false;
        $("#work-date").find(".is-invalid").removeClass("is-invalid");
        this.state.WorkList.forEach((item, index) => {
            let startDate = $("#dialog-work-start-"+ index).val();
            let endDate = $("#dialog-work-end-"+index).val();
            if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
                WorkDates.push(endDate + "~" + startDate);
            } else {
                WorkDates.push(startDate + "~" + endDate);
            }
        });
        $.ajax({
            type: "GET",
            url: "/check-work-date",
            traditional: true,
            data: {email: email, WorkDates: WorkDates},
            async: false,
            success: (existingDates) => {
                if(existingDates.every((item) => {return item;})) {
                    result = true;
                } else {
                    existingDates.forEach((item, index) => {
                        let $start = $("#dialog-work-start-"+index);
                        let $end = $("#dialog-work-end-"+index);
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
     * 输入时触发验证
     */
    changeUserName = () => {
        //过滤姓名
        let name = $("#work-entry-username").val();
        if ((name.indexOf(" ") !== -1) || name.length > 5) {
            if(checkLoginStatus()) {
                $("#work-entry-username").addClass("is-invalid");
            }
        } else {
            this.checkName();
        }
    };
    /*
     * 姓名验证
     */
    getCheckNameResult = () => {
        let query = $("#work-entry-username").val();
        let result = false;
        $.ajax({
            type: 'GET',
            url: '/userinfo-nameAndEmail',
            async: false,
            data: {query: query},
            success: (userInfoList) => {
                let $username = $("#work-entry-username");
                let $email = $("#work-entry-email");
                let name = $username.val();
                if($username.val() === ""){
                    $email.val("");
                    $username.addClass("is-invalid");
                } else {
                    let repeatList = userInfoList.filter((item) =>{
                        return (name === item.name);
                    });
                    if(repeatList.length === 0) {
                        $username.addClass("is-invalid");
                        $email.val("");
                    } else if(repeatList.length > 1) {
                        $username.addClass("is-invalid");
                        $email.val("");
                    } else if(repeatList.length === 1) {
                        $username.removeClass("is-invalid");
                        $email.val(repeatList[0].email);
                        result = true;
                    }
                }
            }
        });
        return result;
    };
    /*
     * 验证姓名，是否为空，是否存在，是否唯一
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
     * 验证日期，是否交叉
     */
    checkDate = (changedIndex) => {
        $("#work-date").find(".is-invalid").removeClass("is-invalid");
        let dateList = [];
        this.state.WorkList.forEach((item, index) => {
            let $startDate = $("#dialog-work-start-" + index);
            let $endDate = $("#dialog-work-end-" + index);
            if (new Date($startDate.val()).getTime() > new Date($endDate.val()).getTime()) {
                $startDate.addClass("is-invalid");
                $endDate.addClass("is-invalid");
                // dateList.push({start: $endDate.val(), end: $startDate.val()});
            } else {
                dateList.push({start: $startDate.val(), end: $endDate.val()});
            }
        });
        let flag = dateList.some(item => {
            return (item.start === "" || item.end === "");
        });
        if (flag) {
            dateList.forEach((item, index) => {
                let $startDate = $("#dialog-work-start-" + index);
                let $endDate = $("#dialog-work-end-" + index);
                if (item.start === "") {
                    this.addCheckStyle($startDate);
                } else {
                    $startDate.removeClass("is-invalid");
                }
                if (item.end === "") {
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
        dateList.forEach((item) => {
            if (item.start !== "" && item.end !== "") {
                item.start = new Date(item.start).getTime();
                item.end = new Date(item.end).getTime();
            }
        });
        dateList.forEach((item, index) => {
            if (item.start !== "" && item.end!== "" && index !== changedIndex) {
                let $startDate = $("#dialog-work-start-" + index);
                let $endDate = $("#dialog-work-end-" + index);
                let startTime = item.start;
                let endTime = item.end;
                dateList.forEach((opt, repeatIndex) => {
                    if (opt.start !== "" && opt.end !== "" && repeatIndex !== changedIndex) {
                        if (repeatIndex !== index) {
                            let $repeatStartDate = $("#dialog-work-start-" + repeatIndex);
                            let $repeatEndDate = $("#dialog-work-end-" + repeatIndex);
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
    onDateFocus = (event) => {
        $(event.target).removeClass("is-invalid");
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
     * 录入加班信息
     */
    entryWorkInfo = () => {
        if (this.checkForm()) {
            let WorkDates = [];
            let days = 0;
            this.state.WorkList.forEach((item, index) => {
                let startDate = null;
                let endDate = null;
                let $startDate = $("#dialog-work-start-"+index);
                let $endDate = $("#dialog-work-end-"+index);
                if (new Date($startDate.val()).getTime() > new Date($endDate.val()).getTime()) {
                    startDate = $endDate.val();
                    endDate = $startDate.val();
                } else{
                    startDate = $startDate.val();
                    endDate = $endDate.val();
                }
                let allDay = $("#dialog-select-"+index).val();
                let date = null;
                if(item.continuousTime) {
                    date = startDate + "~" + endDate + "@1";
                    days += ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000*60*60*24) + 1);
                } else {
                    date = startDate + "~" + endDate + "@" + allDay;
                    days += parseFloat(allDay);
                }
                WorkDates.push(date);
            });
            let WorkInfo = {
                email: $("#work-entry-email").val(),
                days: days,
                workDates: WorkDates,
                remark: $("#work-entry-remark").val()
            };
            axios.post("/work-entry", WorkInfo).then((entryResultInfo) => {
                if (entryResultInfo.data === "录入成功") {
                    this.openMessageDialog("提示", "录入成功！");
                    $("#WorkEntryDialog").modal("toggle");
                    this.reflashManagePage();
                    this.resetModal();
                } else {
                    this.openMessageDialog("提示", "录入失败！");
                }
            });
        }
    };
    /*
     * 点击取消按钮
     */
    onCancelClick = () => {
        this.resetModal();
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
     * 关闭消息modal
     */
    // closeMessageDialog = () => {
    //     $("#WorkEntryDialog").css("z-index", "1050");
    // };
    /*
     * 添加bootstrap表单验证样式
     */
    addCheckStyle = (...$item) => {
        $item.forEach((item) => {
            item.addClass("is-invalid");
        });
    };
    /*
     * 重置modal内容
     */
    resetModal = () => {
        $(".is-invalid").removeClass("is-invalid");
        document.getElementById("work-entry-form").reset();
        $("#dialog-work-end-0").val("");
        let dateString = this.getDateString();
        this.setState({
            WorkType: 1,
            userList: [],
            days: 1,
            WorkList: [{ id: 1, date: dateString, continuousTime: true }],
            listKey: 1
        });
    };

    reflashManagePage = () => {
        this.props.reflashManagePage();
    }

    render() {
        return (
            <div>
                <div className="modal fade" id="WorkEntryDialog" data-backdrop="static">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg w-75">
                        <div className="modal-content w-75">
                            <div className="modal-header">
                                <h3>加班录入</h3>
                                <button type="button" className="close btn btn-outline-light" data-dismiss="modal" onClick={this.onCancelClick}>&times;</button>
                            </div>
                            <div className="modal-body ml-4 height-450px">
                                <form id="work-entry-form">
                                    <div className="input-group mb-3">
                                        <span className="input-group-text col-4 modal-input">姓名：</span>
                                        <input id="work-entry-username" className="form-control typeahead col-6 modal-input rounded-right" data-provide="typeahead"
                                            type="text" autoComplete="off" placeholder="请输入用户姓名" onChange={this.changeUserName} onPaste={this.checkName} />
                                        <div className="invalid-feedback">姓名输入错误</div>
                                        <input id="work-entry-email" className="d-none" type="text" />
                                    </div>
                                    <div className="mb-3">
                                        <hr />
                                        <div className="mb-3">
                                            <span>加班日期：</span>
                                        </div>
                                        <div id="work-date">
                                            <div>
                                                {this.state.WorkList.map((item, index) => {
                                                    return (
                                                        <div className="row input-group mb-1 mr-0 ml-0" key={item.id} id={"dialog-workInfo-" + index}>
                                                            <div className="col-4 pr-0 pl-0">
                                                                <input id={"dialog-work-start-" + index} className="form-control pl-2 pr-2 modal-input" type="date" onChange={this.changeDateStatus.bind(this, index)} onFocus={this.onDateFocus} onBlur={this.changeDateStatus.bind(this, index)} />
                                                                <div className="invalid-feedback">日期输入错误</div>
                                                            </div>
                                                            <span className="pl-1 pr-1">~</span>
                                                            <div className="col-4 pl-0 pr-2">
                                                                <input id={"dialog-work-end-" + index} className="form-control pl-2 pr-2 modal-input" type="date" onChange={this.changeDateStatus.bind(this, index)} onFocus={this.onDateFocus} onBlur={this.changeDateStatus.bind(this, index)} />
                                                                <div className="invalid-feedback">日期输入错误</div>
                                                            </div>
                                                            <div>
                                                                <select id={"dialog-select-" + index} className="form-control pl-1 pr-1 modal-input" defaultValue={1} onChange={this.onDaysToggle.bind(this)} disabled={item.continuousTime}>
                                                                    <option value={1}>全天</option>
                                                                    <option value={0.5}>半天</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-1 pl-2 pr-0 mr-n2">
                                                                <button type="button" className="btn btn-outline-light btn-sm pl-0 pr-0" onClick={this.addWorkDays.bind(this, index)}>
                                                                    <img src={addIcon} alt="" width="25px" height="25px" /></button>
                                                            </div>
                                                            <div className="col-1 pl-2 ml-n2">
                                                                {index !== 0
                                                                    ? (<button type="button" className="btn btn-outline-light btn-sm pl-0 pr-0" onClick={this.deleteWorkDays.bind(this, index)}>
                                                                        <img src={deleteIcon} alt="" width="25px" height="25px" /></button>)
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
                                        <textarea id="work-entry-remark" className="form-control col-10 modal-input" rows="4" />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" type="button" data-dismiss="modal" onClick={this.onCancelClick}>取消</button>
                                <button className="btn btn-outline-primary" type="button" onClick={this.entryWorkInfo}>录入</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="modal fade" id="new-message" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered mx-auto pl-70px" role="document">
                        <div className="modal-content w-356px">
                            <div className="modal-header pt-1 pb-1">
                                <h5 className="modal-title">提示</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            </div>
                            <div className="modal-body">
                                <p className="d-flex justify-content-center" />
                                <div className="d-flex align-items-end flex-column mt-4">
                                    <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={this.closeMessageDialog}>关闭</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

export default WorkEntryDialog;

