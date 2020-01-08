import React from 'react';
import 'bootstrap-3-typeahead';
import $ from 'jquery';
import '../css/ChangeUserDialog.css';
import checkLoginStatus from "../common/checkLoginStatus";
import axios from "axios";

class ChangeUserDialog extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            btnState: true,
            totalBoxChecked: false,
            page: 0,
            totalPage: 1,
            fromIndex: 0,
            toIndex: 5,
            userItem: []
        }
    }

    componentDidMount() {
        if (checkLoginStatus()) {
            let selected = false;
            // 加载typeahead插件
            $("#change-username").typeahead({
                minLength: 1,
                items: 20,
                source: function (query, process) {
                    axios.get('/userinfo-nameAndEmail', { params: { query: query } }).then((userList) => {
                        return process(userList.data);
                    });
                },
                displayText: function (item) {
                    if (!selected) {
                        return item.name + " " + item.email;
                    } else {
                        selected = false;
                        return item.name;
                    }
                },
                updater: function (item) {
                    $("#change-user-email").val(item.email);
                    selected = true;
                    return item;
                }
            });
            $("#changeUserDialog").on("show.bs.modal", () =>{
                this.setState({
                    btnState: true,
                    totalBoxChecked: false,
                    page: 0,
                    totalPage: 1,
                    fromIndex: 0,
                    toIndex: 5,
                    userItem: []
                });
            });
        }
    }

    /*
     * 获取匹配用户列表
     */
    getUserList = (event) => {
        let query = event.target.value;
        axios.get('/userinfo-nameAndEmail', { params: { query: query } }).then((userList) => {
            this.setState({ userList: userList.data });
        });

    };

    /**
     * 查询用户信息
     */
    searchUserInfo = () => {
        if ($("#change-username").val() !== "" && $("#change-user-email").val() === "") {
            this.openMessageDialog("提示", "该员工不存在！");
            this.setState({userItem: []});
            $("#change-username").val("");
        } else if ($("#change-username").val() === "") {
            $("#change-user-email").val("")
            $.ajax({
                url: '/user-info',
                type: 'GET',
                data: {email: $("#change-user-email").val(), page: 0, start: this.state.fromIndex, count: this.state.toIndex},
                async: false,
                success: item => {
                    this.setState({userItem: item.employees});
                    this.setState({totalPage: item.totalPage});
                }
            });
            this.setState({page: 1});
        }
    };

    /**
     * 修改用户假期天数
     */
    updateUserInfoClick = (index) => {
        const toEdit = document.getElementById(`${"cell" + index + 7 + 'update'}`).value === "修改";
        document.getElementById(`${"cell" + index + 7 + 'update'}`).value = toEdit ? '确定' : '修改';
        document.getElementById(`${"cell" + index + 7 + 'update'}`).innerText = toEdit ? '确定' : '修改';
        /*if (!this.state.btnState) {
            document.getElementById("update-user-btn").value = toEdit ? '确定' : '修改';
            document.getElementById("update-user-btn").innerText = toEdit ? '确定' : '修改';
        }*/
        if (toEdit) {
                document.getElementById(`${"cell" + index + 3}`).innerHTML = '<input type="text" style="width: 40px;text-align: center; vertical-align: middle"' +
                'value="'+document.getElementById(`${"cell" + index + 3}`).innerHTML.replace(/"/g,'&quot;')+'"/>';
            document.getElementById(`${"cell" + index + 4}`).innerHTML = '<input type="text" style="width: 40px;text-align: center; vertical-align: middle"' +
                'value="'+document.getElementById(`${"cell" + index + 4}`).innerHTML.replace(/"/g,'&quot;')+'"/>';
        } else {
            document.getElementById(`${"cell" + index + 3}`).innerHTML =
                document.getElementById(`${"cell" + index + 3}`).firstChild.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            document.getElementById(`${"cell" + index + 4}`).innerHTML =
                document.getElementById(`${"cell" + index + 4}`).firstChild.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            let email = document.getElementById(`${"cell" + index + 1}`).innerText;
            let vacation_leave = document.getElementById(`${"cell" + index + 3}`).innerText;
            let annual_leave = document.getElementById(`${"cell" + index + 4}`).innerText;
            $.ajax({
                url: '/update-user-info',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify([{email: email, vacationLeave: vacation_leave,annualLeave: annual_leave}]),
                async: false,
                success: () => {
                    $("#hint-modal").modal("toggle");
                    $("#hint-modal").on('show.bs.modal', this.openMessageDialog("提示", "用户修改成功"));
                }
            });
        }
    };

    /**
     * 删除用户
     */
    deleteUserInfoClick = (index) => {
        let email = document.getElementById(`${"cell" + index + 1}`).innerText;
        $.ajax({
            url: '/delete-userinfo',
            type: 'GET',
            data: {email: email},
            async: false,
            success: () => {
                $("#hint-modal").modal("toggle");
                $("#hint-modal").on('show.bs.modal', this.openMessageDialog("提示", "用户删除成功"));
                $("#change-user-email").val("");
                $("#change-username").val("");
                this.setState({userItem: []});
            }
        });
    };

    /**
     * 提示模态框
     */
    openMessageDialog = (title, message) => {
        let $modal = $("#hint-modal");
        $modal.find("h5").text(title);
        $modal.find("p").text(message);
        $modal.modal("toggle");
        $(".modal-backdrop").css("z-index","9998");
    };

    /**
     * 控制table显示条数
     */
    handleSelectClick = (event) => {
        const emailItem = $("#change-user-email").val();
        if (checkLoginStatus()) {
            let pageNum = Number(event.target.value);
            $.ajax({
                url: '/user-info',
                type: 'GET',
                data: {email: emailItem,page: 0, start: 0, count: pageNum},
                async: false,
                success: item => {
                    this.setState({userItem: item.employees});
                    this.setState({totalPage: item.totalPage})
                }
            });
            this.setState({toIndex: pageNum});
            this.setState({page: 1});
            this.setState({fromIndex: 0});
        }
    };

    /**
     * 点击上一页函数
     */
    handlePrePageClick = () => {
        if (checkLoginStatus()) {
            let pageNum = Number(this.refs.selectNum.value);
            let from = this.state.fromIndex-pageNum;
            if (from < 0) {
                from = 0;
            }
            $.ajax({
                url: '/user-info',
                type: 'GET',
                data: {email: null,page: this.state.page - 2, start: from, count: this.state.toIndex},
                async: false,
                success: item => {
                    this.setState({userItem: item.employees});
                    this.setState({totalPage: item.totalPage})
                }
            });
            this.setState({fromIndex: from});
            this.setState({page: this.state.page - 1});
        }
    };

    /**
     * 点击下一页函数
     */
    handleNextPageClick = () => {
        if (checkLoginStatus()) {
            let pageNum = Number(this.refs.selectNum.value);
            let from = this.state.fromIndex+pageNum;
            $.ajax({
                url: '/user-info',
                type: 'GET',
                data: {email: null,page: this.state.page, start: from, count: this.state.toIndex},
                async: false,
                success: item => {
                    this.setState({userItem: item.employees});
                    this.setState({totalPage: item.totalPage})
                }
            });
            this.setState({fromIndex: from});
            this.setState({page: this.state.page + 1});
        }
    };

    /**
     * 关闭函数
     */
    onCancelClick = () => {
        $("#change-user-email").val("");
        $("#change-username").val("");
    };

    render() {
        return (
            <div>
                <div className="modal fade" id="changeUserDialog" data-backdrop="static">
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>用户信息修改</h3>
                                <button type="button" className="close btn btn-outline-light" data-dismiss="modal" onClick={this.onCancelClick}>&times;</button>
                            </div>
                            <div className="modal-body ml-4 height-450px">
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">姓名：</span>
                                    <input id="change-username" className="form-control typeahead col-6 modal-input rounded-right mr-1" data-provide="typeahead"
                                           type="text" placeholder="请输入用户姓名" onBlur={this.getUserList} />
                                    <div className="invalid-feedback">姓名输入错误</div>
                                    <input id="change-user-email" className="d-none" type="text" />
                                    <button className="btn btn-outline-primary" type="button" onClick={this.searchUserInfo}>查询</button>
                                </div>
                                <hr />
                                {/*<div className="mb-3">
                                        <button type="button" className="btn btn-outline-primary mr-1" onClick={this.onDeleteUserClick}
                                                data-toggle="modal" disabled={this.state.btnState /*|| this.state.data.length === 0*!/>
                                            删除
                                        </button>
                                        <button type="button" id="update-user-btn" className="btn btn-outline-primary" onClick={this.onUpdateUserClick} value="修改"
                                                data-toggle="modal" disabled={this.state.btnState /*|| this.state.data.length === 0*!/>
                                            修改
                                        </button>
                                </div>*/}
                                <div>
                                    <table className="table  table-hover table-bordered table-sm text-center approval-table">
                                        <thead className="approval-table-head text-nowrap ">
                                        <tr>
                                            <th className="align-middle p-2">姓名</th>
                                            <th className="align-middle p-2">邮箱</th>
                                            <th className="align-middle p-2">员工种类</th>
                                            <th className="align-middle p-2">调休假</th>
                                            <th className="align-middle p-2">年假</th>
                                            <th className="align-middle p-2">项目编号</th>
                                            <th className="align-middle p-2">员工级别</th>
                                            <th className="align-middle p-2">操作</th>
                                        </tr>
                                        </thead>
                                        {
                                            this.state.userItem.length === 0
                                                ? <tbody><tr><td colSpan="8">无数据</td></tr></tbody>
                                                : <tbody>
                                                {
                                                    this.state.userItem.map((info, index) => {
                                                        return (
                                                            <tr key={index} id={"tr" + index}>
                                                                <td className="align-middle p-2" id={"cell" + index + 0}>{info.name}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 1}>{info.login}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 2}>{info.official}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 3}>{info.vacation_leave}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 4}>{info.annual_leave}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 5}>{info.project}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 6}>{info.e_level}</td>
                                                                <td className="align-middle p-2" id={"cell" + index + 7}>
                                                                    <div className="btn-group btn-group-sm mr-1">
                                                                        <button type="button" className="btn  btn-outline-primary"
                                                                                id={"cell" + index + 7 + 'delete'} data-toggle="modal"
                                                                                onClick={() => this.deleteUserInfoClick(index)}>
                                                                            删除
                                                                        </button>
                                                                    </div>
                                                                    <div className="btn-group  btn-group-sm">
                                                                        <button type="button" className="btn  btn-outline-primary"
                                                                                id={"cell" + index + 7 + 'update'} data-toggle="modal" value="修改"
                                                                                onClick={() => this.updateUserInfoClick(index)}>
                                                                            修改
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                                </tbody>
                                        }
                                    </table>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <div className="mr-3">
                                        <select className="form-control form-control-sm" ref="selectNum" onChange={this.handleSelectClick}
                                                hidden={this.state.userItem.length === 0}>
                                            <option value="5" >5</option>
                                            <option value="10" >10</option>
                                            <option value="15" >15</option>
                                            <option value="20" >20</option>
                                        </select>
                                    </div>
                                    <div className="mr-2">
                                        <button className="btn btn-outline-primary btn-sm" onClick={this.handlePrePageClick}
                                                hidden={this.state.userItem.length === 0} disabled={this.state.page === 1}>
                                            上一页
                                        </button>
                                    </div>
                                    <div className="mr-2 btn-sm">
                                        <p hidden={this.state.userItem.length === 0} >{this.state.page}/{this.state.totalPage}</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-primary btn-sm" onClick={this.handleNextPageClick}
                                                hidden={this.state.userItem.length === 0} disabled={this.state.page === this.state.totalPage}>
                                            下一页
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" type="button" data-dismiss="modal" onClick={this.onCancelClick}>取消</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className="modal fade" id="new-message" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered mx-auto pl-70px" role="document">
                        <div className="modal-content w-356px">
                            <div className="modal-header pt-1 pb-1">
                                <h5 className="modal-title">提示</h5>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">调休假天数：</span>
                                    <input id="user-vacation-field" className="form-control col-6 modal-input rounded-right"
                                           type="text" placeholder="请输入员工调休假天数" maxLength="3" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">年假天数：</span>
                                    <input id="user-annual-field" className="form-control col-6 modal-input rounded-right"
                                           type="text" placeholder="请输入员工年假天数" maxLength="3" />
                                </div>
                                <div className="d-flex align-items-end flex-column mt-4">
                                    <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={this.onFlushClick}>关闭</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}
            </div>
        );
    }
}

export default ChangeUserDialog;
