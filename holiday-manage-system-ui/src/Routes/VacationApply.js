import React, { Component } from 'react'
import addIcon from '../images/add.jpg';
import deleteIcon from '../images/reduce.jpg';
import $ from 'jquery';
import axios from 'axios';
import '../css/VacationApply.css'
import checkLoginStatus from '../common/checkLoginStatus';

class VacationApply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            vacationList: [{ id: 1, continuousTime: true }],
            listKey: 1,
            vacationLeave: 0,
            annualLeave: 0,
            userEmail: null,
            emergencyPhone: null,
            result: false
        }
    }

    componentDidMount() {
        if (checkLoginStatus()) {
            axios.get(`vacation-apply/${sessionStorage.getItem("userInfo")}`).then(personVacationInfo => {
                this.setState({
                    annualLeave: personVacationInfo.data.annualLeave,
                    vacationLeave: personVacationInfo.data.vacationLeave,
                    userEmail: sessionStorage.getItem("userInfo")
                })
            }, () => {
                this.openMessageDialog("提示", "请刷新页面");
            })
        }
    }

    //增加一条休假日期
    addVacationDays = (index) => {
        let list = this.state.vacationList;
        const key = this.state.listKey + 1;
        list.splice(index + 1, 0, { id: key, continuousTime: true });
        this.setState({ vacationList: list, listKey: key });
    };

    //减少一条休假日期
    deleteVacationDays = (index) => {
        let list = this.state.vacationList;
        if (list.length !== 1) {
            const days = this.state.days - ($("#allday-select-" + index).val() || 0);
            list.splice(index, 1);
            this.setState({
                days: days,
                vacationList: list
            });
        }
    };

    //全半天切换
    dayToggle = (event) => {
        const val = parseFloat(event.target.value);
        let days = this.state.days
        if (val === 0.5) days -= 0.5
        else days += 0.5
        console.log(days);
        this.setState({ days: days });
    };

    emergencyPhone = (event) => {
        $('#emergency-phone').removeClass("is-invalid");
        const phoneNum = event.target.value;
        this.setState({
            emergencyPhone: phoneNum
        })
    }

    //判断日期是否连续
    dateChange = (event) => {
        let vacationList = this.state.vacationList;
        let days = this.state.days;
        const selectDate = new Date(event.target.value);
        const selectId = event.target.id;
        const selectDateType = selectId.split("-")[1];
        const selectIdIndex = selectId.split("-")[2];
        const vacationListSelect = vacationList[selectIdIndex];
        let intervalTime = null;
        $("#apply-start-" + selectIdIndex).removeClass("is-invalid");
        $("#apply-end-" + selectIdIndex).removeClass("is-invalid");
        if (selectDateType === "start") {
            vacationListSelect.startDate = selectDate;
            const endDate = vacationListSelect.endDate || null;
            intervalTime = endDate ? endDate - selectDate : null;
            if (this.checkDate(selectDate, Number(selectIdIndex), "start")) {
                this.setState({ result: false });
                return;
            }
        } else {
            vacationListSelect.endDate = selectDate;
            const startDate = vacationListSelect.startDate || null;
            intervalTime = startDate ? selectDate - startDate : null;
            if (this.checkDate(selectDate, Number(selectIdIndex), "end")) {
                this.setState({ result: false });
                return;
            }
        }
        if (intervalTime !== null) {
            if (intervalTime >= 0) {
                const oldDays = vacationListSelect.days ? vacationListSelect.days : 0;
                days -= oldDays;
                const intervalDay = parseInt(intervalTime / (1000 * 60 * 60 * 24), 10) + 1;
                if (intervalDay === 1) {
                    vacationListSelect.continuousTime = false
                    vacationListSelect.days = 1;
                    days += 1;
                } else {
                    vacationListSelect.continuousTime = true
                    vacationListSelect.days = intervalDay;
                    days += intervalDay
                }
                this.setState({ result: true })
            } else {
                $("#apply-start-" + selectIdIndex).addClass("is-invalid");
                this.openMessageDialog("提示", "休假开始日期应小于结束日期");
                this.setState({ result: false })
            }
        }
        this.setState({
            vacationList: vacationList,
            days: days
        })
        console.log(this.state.days);
    }

    //验证日期，是否交叉
    checkDate = (selectDate, index, type) => {
        const vacationList = this.state.vacationList;
        const result = this.state.vacationList.length !== 0 ?
            this.state.vacationList.map((item, num) => {
                if (index !== num) {
                    return (item.startDate < selectDate ?
                        vacationList[num].endDate ? type === "start" ?
                            vacationList[num].endDate < selectDate : vacationList[index].startDate ?
                                vacationList[index].startDate > vacationList[num].endDate && vacationList[num].endDate < selectDate : true : true
                        : Date.parse(item.startDate) === Date.parse(selectDate) ?
                            false : vacationList[num].endDate ? vacationList[num].endDate > selectDate : true)
                } else return true
            }) : true
        if (result.some(item => item === false)) {
            if (type === "start") {
                $("#apply-start-" + index).addClass("is-invalid");
            } else {
                $("#apply-end-" + index).addClass("is-invalid");
            }
            this.openMessageDialog("提示", "休假时间重叠，请检查");
            return true;
        }
        return false
    };

    //打开消息modal
    openMessageDialog = (title, message) => {
        let $modal = $("#hint-modal");
        $modal.find("h5").text(title);
        $modal.find("p").text(message);
        $modal.modal("toggle");
        $(".modal-backdrop").css("z-index", "9998");
    };

    //验证表单内容
    checkForm = () => {
        //选择调休假时的验证
        const list = this.state.vacationList;
        let vacationDates = [];
        let result = true;
        list.forEach((item, index) => {
            if (item.startDate && item.endDate) {
                const startDate = this.dateToString(item.startDate);
                const endDate = this.dateToString(item.endDate);
                vacationDates.push(startDate + "~" + endDate);
            } else {
                if (!item.startDate) {
                    $("#apply-start-" + index).addClass("is-invalid");
                    result = false;
                }
                if (!item.endDate) {
                    $("#apply-end-" + index).addClass("is-invalid");
                    result = false;
                }
            }
        })
        if (!this.state.emergencyPhone) {
            $("#emergency-phone").addClass("is-invalid")
            result = false;
        }
        if (!result) this.openMessageDialog("提示", "存在未填写的内容，请检查");
        else result = this.checkExistingDate(vacationDates);
        return result;
    };

    /*
    * 检查是否存在已审核或待审批的时间段，避免重复录入
    */
    checkExistingDate = (vacationDates) => {
        let result = false;
        $.ajax({
            type: "GET",
            url: "/check-vacation-date",
            traditional: true,
            data: { email: this.state.userEmail, vacationDates: vacationDates },
            async: false,
            success: (existingDates) => {
                if (existingDates.every((item) => { return item; })) {
                    result = true;
                } else {
                    existingDates.forEach((item, index) => {
                        let $start = $("#apply-start-" + index);
                        let $end = $("#apply-end-" + index);
                        if (!item) {
                            $start.addClass("is-invalid");
                            $end.addClass("is-invalid");
                            this.openMessageDialog("提示", "存在已审核或待审核的时间段！");
                        }
                    });
                }
            }
        });
        return result;
    };

    //录入请假信息
    onSubmitClick = () => {
        if (checkLoginStatus()) {
            const vacationType = $("#vacation-type").val();
            if (vacationType === "0" && (this.state.annualLeave < this.state.days)) {
                this.openMessageDialog("提示", "休假时间大于剩余年假天数，请重新审核");
            } else if (vacationType === "1" && (this.state.vacationLeave < this.state.days)) {
                this.openMessageDialog("提示", "休假时间大于剩余调休假天数，请重新审核");
            } else if (this.state.result && this.checkForm()) {
                let vacationDate = [];
                this.state.vacationList.forEach((item, index) => {
                    const startDate = this.dateToString(item.startDate);
                    const endDate = this.dateToString(item.endDate);
                    if (item.continuousTime) vacationDate.push(startDate + "~" + endDate + "@1");
                    else vacationDate.push(startDate + "~" + endDate + "@" + $("#allday-select-" + index).val())
                })
                const vacationInfo = {
                    email: this.state.userEmail,
                    type: vacationType,
                    days: this.state.days,
                    vacationDates: vacationDate,
                    remark: $("#vacation-entry-remark").val(),
                    contact: this.state.emergencyPhone
                };
                console.log(vacationInfo);
                //录入
                axios.post("/vacation-apply/submit", vacationInfo).then(() => {
                    this.openMessageDialog("提示", "申请成功");
                    this.resetForm();
                }, () => {
                    this.openMessageDialog("提示", "申请失败");
                });
            }
        }
    };

    //点击取消按钮
    onResetClick = () => {
        this.resetForm();
    };

    //重置内容
    resetForm = () => {
        $(".is-invalid").removeClass("is-invalid");
        // document.getElementById("vacation-apply-form").reset();
        // this.setState({
        //     vacationType: 1,
        //     days: 0,
        //     vacationList: [{ id: 1, date: null, continuousTime: true }],
        //     listKey: 1
        // });
    };

    dateToString = (date) => {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString();
        var day = (date.getDate()).toString();
        if (month.length === 1) {
            month = "0" + month;
        }
        if (day.length === 1) {
            day = "0" + day;
        }
        var dateTime = year + "-" + month + "-" + day;
        return dateTime;
    }

    render() {
        return (
            <section className="VM-background VM-scrollable" style={{ height: window.innerHeight }}>
                <div className="container pl-60px">
                    <div className="row mb-5 pt-4">
                        <div className="mx-auto">
                            <h3>休假申请</h3>
                        </div>
                    </div>
                    <div className="row mb-4 no-gutters mx-auto">
                        <div className="col-2 bg-darkseagreen mr-5 text-center border-radius">
                            <div>调休假剩余天数</div>
                            <div className="h3 font-weight-bold fc-white">{this.state.vacationLeave}</div>
                        </div>
                        <div className="col-2 bg-warning text-center border-radius ml-4">
                            <div>年假剩余天数</div>
                            <div className="h3 font-weight-bold fc-white">{this.state.annualLeave}</div>
                        </div>
                    </div>
                    <div className="mb-2 w-50 min-w-480px">
                        <form id="vacation-apply-form" className="mb-4">
                            <div className="mb-3">
                                <div className="mb-2">请假类型：</div>
                                <select id="vacation-type" className="form-control col-6" defaultValue={1}>
                                    <option value={1}>调休假</option>
                                    <option value={0}>年假</option>
                                    <option value={2}>事假/病假</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <div className="mb-2">
                                    <span>休假日期：</span>
                                </div>
                                <div id="vacation-date">
                                    {this.state.vacationList.map((item, index) => {
                                        return (
                                            <div className="row input-group mb-1" key={item.id} id={"vacation-applyInfo-" + index}>
                                                <div className="col-4 pr-0">
                                                    <input id={"apply-start-" + index} className="form-control pl-2 pr-2" type="date" onChange={this.dateChange.bind(this)} />
                                                    <div className="invalid-feedback">日期不能为空,不能重叠</div>
                                                </div>
                                                <span>~</span>
                                                <div className="col-4 pl-0 pr-2">
                                                    <input id={"apply-end-" + index} className="form-control pl-2 pr-2" type="date" onChange={this.dateChange.bind(this)} />
                                                    <div className="invalid-feedback">日期不能为空,不能重叠</div>
                                                </div>
                                                {
                                                    item.continuousTime ? (this.state.vacationList[index].days ? (<input readOnly id={"allday-select-" + index} className="form-control pl-1 pr-1 text-center"
                                                        value={this.state.vacationList[index].days || ""} />) : null) : (<select id={"allday-select-" + index} className="form-control pl-1 pr-1" defaultValue={1}
                                                            onChange={this.dayToggle.bind(this)}>
                                                            <option value={1}>全天</option>
                                                            <option value={0.5}>半天</option>
                                                        </select>)
                                                }
                                                <div className="col-1 pl-2 pr-0 mr-n2">
                                                    <button type="button" className="btn btn-outline-light btn-sm pl-0 pr-0" onClick={this.addVacationDays.bind(this, index)}>
                                                        <img src={addIcon} alt="" width="25px" height="25px" /></button>
                                                </div>
                                                <div className="col-1 pl-2 ml-n2">
                                                    {index !== 0
                                                        ? (<button type="button" className="btn btn-outline-light btn-sm pl-0 pr-0" onClick={this.deleteVacationDays.bind(this, index)}>
                                                            <img src={deleteIcon} alt="" width="25px" height="25px" /></button>)
                                                        : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="mb-2">紧急联系人及电话：</div>
                                <input type="text" className="form-control col-6" id="emergency-phone" onChange={this.emergencyPhone.bind(this)} />
                                <div className="invalid-feedback">紧急联系人及电话不能为空</div>
                            </div>
                            <div>
                                <div className="mb-2">备注：</div>
                                <textarea id="vacation-entry-remark" className="form-control col-10 textarea-resize-fix" rows="4" />
                            </div>
                        </form>
                    </div>
                    <div className="min-vw-100">
                        <button className="btn btn-outline-primary" type="button" onClick={this.onResetClick}>重置</button>
                        <button className="btn btn-outline-primary ml-3" type="button" onClick={this.onSubmitClick}>提交</button>
                    </div>
                </div>
            </section >
        );
    }
}

export default VacationApply;