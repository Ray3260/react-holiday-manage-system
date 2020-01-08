import React from 'react';
import $ from 'jquery';
import checkLoginStatus from "../common/checkLoginStatus";

class AddUserDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            projectItem: [],
        };
    }

    componentDidMount() {
        $.ajax({
            url: '/project-info',
            type: 'GET',
            async: false,
            success: item => {
                this.setState({projectItem : item});
            }
        });
        $("#addUserDialog").on("show.bs.modal", () => {
            document.getElementById("add-user-form").reset();
        });
    }

    /**
     * 增加用户
     */
    onAddUserInfo = () => {
        let dataItem = [];
        let modal = $("#hint-modal");
        if (checkLoginStatus()) {
            const isEmail = ($("#user-email-field").val() !== null && $("#user-email-field").val() !== "");
            const isPassword = ($("#user-password-field").val() !== null && $("#user-password-field").val() !== "");
            const isName = ($("#user-name-field").val() !== null && $("#user-name-field").val() !== "");
            const isOfficial = ($("#user-official-field").val() !== null && $("#user-official-field").val() !== "");
            const isVacation = ($("#user-vacation-field").val() !== null && $("#user-vacation-field").val() !== "");
            const isAnnual = ($("#user-annual-field").val() !== null && $("#user-annual-field").val() !== "");
            const isProject = ($("#user-project-field").val() !== null && $("#user-project-field").val() !== "");
            const isLevel = ($("#user-level-field").val() !== null && $("#user-level-field").val() !== "");
            if (isEmail && isPassword && isName && isOfficial && isVacation && isAnnual && isProject && isLevel) {
                dataItem.push({
                    email: $("#user-email-field").val(),
                    password: $("#user-password-field").val(),
                    username: $("#user-name-field").val(),
                    official: $("#user-official-field").val(),
                    vacationLeave: $("#user-vacation-field").val(),
                    annualLeave: $("#user-annual-field").val(),
                    project: $("#user-project-field").val(),
                    level: $("#user-level-field").val(),
                });
                $.ajax({
                    url: '/add-user-info',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(dataItem),
                    async: false,
                    success: item => {
                        if (item === 0) {
                            modal.modal("toggle");
                            modal.on('show.bs.modal', this.openMessageDialog("提示", "用户增加成功！"));
                            document.getElementById("add-user-form").reset();
                        } else {
                            modal.modal("toggle");
                            modal.on('show.bs.modal', this.openMessageDialog("提示", "用户已存在！"));
                            document.getElementById("add-user-form").reset();
                        }
                    }
                });
            } else {
                modal.modal("toggle");
                modal.on('show.bs.modal', this.openMessageDialog("提示", "请填写所有内容！"));
                document.getElementById("add-user-form").reset();
            }
        }
    };

    /**
     * 提示信息
     */
    openMessageDialog = (title, message) => {
        let $modal = $("#hint-modal");
        $modal.find("h5").text(title);
        $modal.find("p").text(message);
        $(".modal-backdrop").css("z-index","9998");
    };

    render() {
        return(<div>
            <div className="modal fade" id="addUserDialog" data-backdrop="static" role="dialog">
                <div className="modal-dialog modal-dialog-centered"  role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>增加用户</h3>
                            <button type="button" className="close btn btn-outline-light" data-dismiss="modal" onClick={this.onCancelClick}>
                                &times;
                            </button>
                        </div>
                        <form id="add-user-form">
                            <div className="modal-body ml-4 height-450px">
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">邮箱：</span>
                                    <input id="user-email-field" className="form-control col-6 modal-input rounded-right mr-1"
                                           type="text" autoComplete="off" placeholder="请输入员工邮箱" maxLength="20" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">密码：</span>
                                    <input id="user-password-field" className="form-control col-6 modal-input rounded-right mr-1"
                                           type="text" autoComplete="off" placeholder="请输入员工密码" maxLength="16" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">姓名：</span>
                                    <input id="user-name-field" className="form-control col-6 modal-input rounded-right mr-1"
                                           type="text" autoComplete="off" placeholder="请输入员工姓名" maxLength="8" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">员工种类：</span>
                                    <select id="user-official-field" className="form-control col-6" style={{color:"#007bff"}}
                                            defaultValue={0}>
                                        <option value={0}>正式员工</option>
                                        <option value={1}>协力</option>
                                        <option value={2}>实习</option>
                                    </select>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">调休假天数：</span>
                                    <input id="user-vacation-field" className="form-control col-6 modal-input rounded-right mr-1"
                                           type="text" autoComplete="off" placeholder="请输入员工调休假天数" maxLength="3" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">年假天数：</span>
                                    <input id="user-annual-field" className="form-control col-6 modal-input rounded-right mr-1"
                                           type="text" autoComplete="off" placeholder="请输入员工年假天数" maxLength="3" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">项目编号：</span>
                                    <select id="user-project-field" className="form-control col-6" style={{color:"#007bff"}}
                                            defaultValue={0}
                                            >
                                        {
                                            this.state.projectItem.map(info => {
                                                return (<option value={info.projectNumber} key={info.projectNumber}>{info.projectName}</option>);
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text col-4 modal-input">员工级别：</span>
                                    <select id="user-level-field" className="form-control col-6" style={{color:"#007bff"}}
                                            defaultValue={0}>
                                        <option value={0}>普通员工</option>
                                        <option value={1}>项目管理者</option>
                                        <option value={2}>系统管理者</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                        <div className="modal-footer">
                            <button className="btn btn-outline-primary" type="button" data-dismiss="modal" onClick={this.onCancelClick}>取消</button>
                            <button className="btn btn-outline-primary" type="button" onClick={this.onAddUserInfo}>提交</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default AddUserDialog;
