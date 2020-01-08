import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'bootstrap-3-typeahead';
import '../css/VacationManage.css';
import checkLoginStatus from '../common/checkLoginStatus'
import VacationEntryDialog from "../components/VacationEntryDialog";
import WorkEntryDialog from "../components/WorkEntryDialog";
import ChangeUserDialog from "../components/ChangeUserDialog";
import AddUserDialog from "../components/AddUserDialog";
import ProjectManageDialog from "../components/ProjectManageDialog";

const exchangeTableHead = ['姓名', '邮箱@neusoft.com', '年度', '补休日期（加班）', '补休天数', '调休日期', '已休天数', '剩余天数', '状态', '操作'];
const annualTableHead = ['姓名', '邮箱@neusoft.com', '年度', '总计天数', '休假日期', '已休天数', '剩余天数', '状态', '操作']
const sickTableHead = ['姓名', '邮箱@neusoft.com', '年度', '休假日期', '共计天数']
class VacationManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vacationTable: [],
            showTableTitle: null,
            selectVacationType: "1",
            vacationType: null,
            searchName: '',
            searchEmail: "null",
            searchYear: "null",
            showRowsNum: 5,
            showPageNO: 1,
            totalPage: null,
            modalMassage: null,
            modalTitle: null,
            managerEmail: null
        };
        this.changeVacationeType = this.changeVacationeType.bind(this);
        this.changeSearchYear = this.changeSearchYear.bind(this);
        this.sendRemindEmail = this.sendRemindEmail.bind(this);
        this.showRowsSelect = this.showRowsSelect.bind(this);
        this.clickPrePage = this.clickPrePage.bind(this);
        this.clickNextPage = this.clickNextPage.bind(this);
    }

    componentDidMount() {
        if (checkLoginStatus()) {
            this.setState({
                managerEmail: sessionStorage.getItem('userInfo')
            })
            let selected = false;
            // 加载typeahead插件
            $("#vacation-manage-search-name").typeahead({
                minLength: 1,
                items: 20,
                delay: 400,
                autoSelect: true,
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
                    return (userInfo[0] + " <small><b>" + userInfo[1] + "</b></small>");
                },
                updater: (item) => {
                    this.setState({ searchName: item.name, searchEmail: item.email });
                    selected = true;
                    return item;
                }
            });
        }
    }

    changeVacationeType = (event) => {
        this.setState({
            selectVacationType: event.target.value,
            showPageNO: 1
        })
    }

    changeSearchName = (event) => {
        this.setState({
            searchName: event.target.value
        });
    };

    changeSearchYear = (event) => {
        this.setState({
            searchYear: event.target.value
        })
    }

    showRowsSelect = (event) => {
        if (checkLoginStatus()) {
            const showRowsNum = Number(event.target.value);
            this.setState({
                showRowsNum: showRowsNum,
                showPageNO: 1
            }, () => { this.searchInfo() })
        }
    }

    clickPrePage = () => {
        if (checkLoginStatus()) {
            const showPageNO = this.state.showPageNO - 1;
            this.setState({
                showPageNO: showPageNO
            }, () => { this.searchInfo() })
        }
    }

    clickNextPage = () => {
        if (checkLoginStatus()) {
            const showPageNO = this.state.showPageNO + 1;
            this.setState({
                showPageNO: showPageNO
            }, () => { this.searchInfo() })
        }
    }

    render() {
        return (
            <section className="VM-background VM-scrollable" style={{ height: window.innerHeight }}>
                <section className="container pl-60px">
                    <div className="row mb-5 pt-4">
                        <div className="mx-auto">
                            <h3>休假管理</h3>
                        </div>
                    </div>
                    <form>
                        <div className="w-50 min-w-480px">
                            <div className="input-group mb-3">
                                <label htmlFor="vacationType" className="w-180px input-group-text">请假类型（必须）：</label>
                                <select id="vacationType" className="form-control" value={this.state.selectVacationType} onChange={this.changeVacationeType}>
                                    <option value="1">调休假</option>
                                    <option value="0">年假</option>
                                    <option value="2">事假/病假</option>
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <label htmlFor="searchEmail" className="w-180px input-group-text">用户名：</label>
                                <input id="vacation-manage-search-name" type="text" className="form-control" placeholder="请输入需要查询的用户名" data-provide="typeahead" autoComplete="off" value={this.state.searchName} onChange={this.changeSearchName} />
                            </div>
                            <div className="input-group mb-5 ">
                                <label htmlFor="searchYear" className="w-180px input-group-text">年度：</label>
                                <select className="form-control" value={this.state.searchYear} onChange={this.changeSearchYear}>
                                    <option value="null">--</option>
                                    {
                                        this.getYears()
                                    }
                                </select>
                            </div>
                        </div>
                    </form>
                    <div className="mb-5 min-vw-100">
                        <button type="button" className="btn btn-outline-primary" onClick={this.searchInfo}>查询</button>
                        <button type="button" className="btn btn-outline-primary ml-3" onClick={this.exportSearch}>导出文件</button>
                        <button type="button" className="btn btn-outline-primary ml-3" onClick={this.openVacationInput}>请假录入</button>
                        <button type="button" className="btn btn-outline-primary ml-3" onClick={this.openWorkInput}>加班录入</button>
                        <button type="button" className="btn btn-outline-primary ml-3" onClick={this.changeUserInfo}>用户修改</button>
                        <button type="button" className="btn btn-outline-primary ml-3" onClick={this.addUserInfo}>增加用户</button>
                        <button type="button" className="btn btn-outline-primary ml-3" onClick={this.openProjectManage}>项目管理</button>
                    </div>
                    {
                        this.state.vacationTable.length !== 0 ? ([
                            <table key={1} className="table table-hover table-bordered table-sm text-center VM-table">
                                <thead className="text-nowrap bg-white">
                                    <tr>
                                        {
                                            this.state.showTableTitle.map((head, index) =>
                                                <th key={index}>{head}</th>
                                            )
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.vacationTable.map((item, index) => {
                                            const vType = this.state.vacationType
                                            return (<tr key={vType + index} id={vType + index}>
                                                <td className="text-nowrap" key={vType + index + 1} id={vType + index + 1}>{item.name}</td>
                                                <td key={vType + index + 2} id={vType + index + 2}> {item.email}</td>
                                                <td key={vType + index + 3}> {item.Year}</td>
                                                {
                                                    this.state.vacationType === "1" ? (<td key={"1" + index + 4}>{item.overTimeDate}</td>) : null
                                                }
                                                {
                                                    this.state.vacationType === "1" ? (<td key={"1" + index + 5}>{item.overTimeDay}</td>) : null
                                                }
                                                {
                                                    this.state.vacationType === "0" ? (<td key={"0" + index + 4}>{item.annualTotal}</td>) : null
                                                }
                                                <td key={vType + index + 6}> {item.vacationDate}</td>
                                                <td key={vType + index + 7}>{item.vacationDay === 0 ? null : item.vacationDay}</td>
                                                {
                                                    this.state.vacationType !== "2" ? (<td key={"0" + index + 8}>{item.vacationTotal}</td>) : null
                                                }
                                                {
                                                    [this.state.vacationType !== "2" ? item.status === 1 || item.status === 3 ? (<td key={vType + index + 9}> 即将过期</td>) : <td key={vType + index + 9}></td> : null,
                                                    this.state.vacationType !== "2" ? item.status === 1 || item.status === 3 ? (
                                                        <td key={vType + index + 10}><button id={vType + index + 10} className="btn btn-outline-primary btn-sm" onClick={this.sendRemindEmail}>邮件提醒</button></td>
                                                    ) : <td key={vType + index + 11}></td> : null
                                                    ]
                                                }
                                            </tr>)
                                        })}
                                </tbody>
                            </table>
                            ,
                            <form key={2}>
                                <div className="d-flex justify-content-end">
                                    <div className="mr-3">
                                        <select className="form-control form-control-sm" onChange={this.showRowsSelect}>
                                            <option value="5" >5</option>
                                            <option value="10" >10</option>
                                            <option value="15" >15</option>
                                            <option value="20" >20</option>
                                        </select>
                                    </div>
                                    <div className="mr-2">
                                        <button className="btn btn-outline-primary btn-sm" onClick={this.clickPrePage}
                                            disabled={this.state.showPageNO === 1}>上一页</button>
                                    </div>
                                    <div className="mr-2 btn-sm">
                                        <p>{this.state.showPageNO}/{this.state.totalPage}</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-primary btn-sm" onClick={this.clickNextPage}
                                            disabled={this.state.showPageNO === this.state.totalPage}>下一页</button>
                                    </div>
                                </div>
                            </form>]
                        ) : null
                    }
                    <WorkEntryDialog reflashManagePage={this.reflashManagePage} />
                    <VacationEntryDialog reflashManagePage={this.reflashManagePage} />
                    <ChangeUserDialog />
                    <AddUserDialog />
                    <ProjectManageDialog />
                    <div className="modal fade" id="modelDialog" data-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered pl-70px" role="document">
                            <div className="modal-content w-356px">
                                <div className="modal-header pt-1 pb-1">
                                    <h5 className="modal-title">{this.state.modalTitle}</h5>
                                </div>
                                <div className="modal-body">
                                    <div className="text-center">{this.state.modalMassage}</div>
                                </div>
                                <div className="modal-footer t-line">
                                    <button type="button" className="btn btn-outline-primary" data-dismiss="modal">确定</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section >
        )
    }

    // 显示近十年选项
    getYears = () => {
        const getNowDate = new Date();
        const getThisYear = getNowDate.getFullYear();
        let yearsOption = [];
        for (let i = 0; i < 10; i++) {
            yearsOption.push(<option key={getThisYear - i} value={getThisYear - i}>{getThisYear - i}</option>)
        }
        return yearsOption;
    }

    // 搜索按钮按下，检索并显示相关信息
    searchInfo = () => {
        if (checkLoginStatus()) {
            const params = {
                searchEmail: this.state.searchEmail,
                searchYear: this.state.searchYear,
                showRowsNum: this.state.showRowsNum,
                showPageNO: this.state.showPageNO
            };
            this.setState({
                vacationType: this.state.selectVacationType
            })
            axios.get(`/holiday-manage/search/search-info/${this.state.selectVacationType}`, { params }).then(vacationInfo => {
                this.setState({
                    totalPage: vacationInfo.data.totalPage
                })
                switch (this.state.selectVacationType) {
                    case "1":
                        this.setState({
                            vacationTable: vacationInfo.data.eVacationPageInfoList,
                            showTableTitle: exchangeTableHead
                        })
                        break;
                    case "0":
                        this.setState({
                            vacationTable: vacationInfo.data.eVacationPageInfoList,
                            showTableTitle: annualTableHead
                        })
                        break;
                    case "2":
                        this.setState({
                            vacationTable: vacationInfo.data.eVacationPageInfoList,
                            showTableTitle: sickTableHead
                        })
                        break;
                    default:
                        break;
                }
                if (this.state.searchEmail !== "" && this.state.vacationTable.length === 0) {
                    if (this.state.searchYear !== "null") {
                        this.openMessageDialog("查询结果", this.state.searchEmail + " 在 " + this.state.searchYear + " 年，没有休假信息");
                    } else {
                        this.openMessageDialog("查询结果", this.state.searchEmail + " 没有休假信息");
                    }
                } else if (this.state.searchYear !== "null" && this.state.vacationTable.length === 0) {
                    this.openMessageDialog("查询结果", this.state.searchYear + " 年度，没有休假信息");
                } else if (this.state.vacationTable.length === 0) {
                    this.openMessageDialog("查询结果", "没有休假信息");
                }
            }, () => {
                this.openMessageDialog("查询结果", "连接超时，请重试");
            });
        }
    }

    // 导出按钮按下，导出检索结果
    exportSearch = () => {
        if (checkLoginStatus()) {
            var str = window.location.origin + "/UserExcelDownloads/" +
                this.state.selectVacationType + "?searchEmail=" +
                this.state.searchEmail + "&searchYear=" + this.state.searchYear;
            const exportSearch = document.createElement("a");
            exportSearch.setAttribute("download", "");
            exportSearch.setAttribute("href", str);
            exportSearch.click();
            // window.open("http://localhost:8080/UserExcelDownloads/" + this.state.selectVacationType +
            //     "?searchEmail=" + this.state.searchEmail + "&searchYear=" + this.state.searchYear);
        }
    }

    // 假期逾期邮件提醒
    sendRemindEmail = (event) => {
        if (checkLoginStatus()) {
            const getEmailAddrId = event.target.id.slice(0, -2) + "2";
            const getEmailAddr = document.getElementById(getEmailAddrId).innerText;
            const params = {
                vacationType: this.state.selectVacationType,
                managerEmail: this.state.managerEmail
            }
            axios.get(`/remind-email/${getEmailAddr}`, { params }).then((message) => {
                if (message) {
                    this.openMessageDialog("假期逾期提醒", "提醒" + getEmailAddr + "成功");
                } else {
                    this.openMessageDialog("假期逾期提醒", "提醒" + getEmailAddr + "失败，请重试");
                }
            }, () => {
                this.openMessageDialog("假期逾期提醒", "连接超时，请重试");
            })
        }
    }

    //录入弹窗关闭后刷新页面表格
    reflashManagePage = () => {
        if (this.state.vacationTable.length !== 0) {
            this.searchInfo();
        }
    }

    //打开消息modal
    openMessageDialog = (title, message) => {
        let $modal = $("#hint-modal");
        $modal.find("h5").text(title);
        $modal.find("p").text(message);
        $modal.modal("toggle");
        $(".modal-backdrop").css("z-index", "9998");
    };

    // 休假录入页面
    openVacationInput = () => {
        if (checkLoginStatus()) {
            $("#vacationEntryDialog").modal("toggle");
        }
    }

    //加班录入画面
    openWorkInput = () => {
        if (checkLoginStatus()) {
            $("#WorkEntryDialog").modal("toggle");
        }
    }

    //用户修改画面
    changeUserInfo = () => {
        $("#changeUserDialog").modal("toggle");
    };

    //增加用户画面
    addUserInfo = () => {
        $("#addUserDialog").modal("toggle");
    };

    //打开项目管理页面
    openProjectManage = () => {
        $("#project-manage-dialog").modal("toggle");
    }
}

export default VacationManage;
