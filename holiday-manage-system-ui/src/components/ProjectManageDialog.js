import React from 'react';
import $ from 'jquery';
import checkLoginStatus from '../common/checkLoginStatus';

class ProjectManageDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectInfoList: [],
            deleteProjectInfoList: [],
            addProjectInfoList: []
        };
    }
    componentDidMount() {
        $("#project-manage-dialog").on("show.bs.modal", () => {
            $.ajax({
                url:'/project-info',
                type: 'GET',
                async: false,
                success: (projectInfo) => {
                    this.setState({projectInfoList: projectInfo, addProjectInfoList: [], deleteProjectInfoList: []});
                }
            });
        });
    }

    addProject = () => {
        let list = this.state.addProjectInfoList;
        if(list.length < 5) {
            list.push({id: list.length - 1, projectNumber: '', projectName: ''});
            this.setState({addProjectInfoList: list});
        } else {
            this.openMessageDialog("提示", "单次添加项目最大值为5！");
        }
    };

    deleteDefaultProject = (index) => {
        let list = this.state.projectInfoList;
        let deleteList = this.state.deleteProjectInfoList;
        deleteList.push({projectNumber: list[index].projectNumber, projectName: list[index].projectName});
        list.splice(index, 1);
        this.setState({projectInfoList: list, deleteProjectInfoList: deleteList});
    };

    deleteAddProject = (index) => {
        let list = this.state.addProjectInfoList;
        list.splice(index, 1);
        this.setState({addProjectInfoList: list});
    };

    projectNumberChange = (index, event) => {
        let list = this.state.addProjectInfoList;
        list[index].projectNumber = event.target.value;
        this.setState({addProjectInfoList: list});
    };

    projectNameChange = (index, event) => {
        let list = this.state.addProjectInfoList;
        list[index].projectName = event.target.value;
        this.setState({addProjectInfoList: list});
    };

    openMessageDialog = (title, message) => {
        let $modal = $("#hint-modal");
        $modal.find("h5").text(title);
        $modal.find("p").text(message);
        $modal.modal("toggle");
        $(".modal-backdrop").css("z-index","9998");
    };

    closeDialog = () => {
        $("#project-manage-dialog").modal("toggle");
    };

    restoreProjectInfo = () =>{
        document.getElementById("project-manage-form").reset();
        $.ajax({
            url:'/project-info',
            type: 'GET',
            async: false,
            success: (projectInfo) => {
                let projectList = projectInfo.map((item) => {
                    return {projectNumber: item.projectNumber, projectName: item.projectName, isReadOnly: true}
                });
                this.setState({projectInfoList: projectList, addProjectInfoList: [], deleteProjectInfoList: []});
            }
        });
    };

    checkExistingProject = (list) => {
        let pNumbers = list.map(item => {
            return item.pNumber;
        });
        pNumbers = pNumbers.length === 0 ? null : pNumbers;
        let result = false;
        $.ajax({
            url: '/project-info-byPNumber',
            type: 'GET',
            data: {pNumbers: pNumbers},
            traditional: true,
            async: false,
            success: (res) => {
                if (!res) {
                    result = true;
                } else{
                    this.openMessageDialog("提示", "项目编号已存在，请修改。");
                }
            }
        });
        return result;
    };

    saveProjectInfo = () => {
        if(checkLoginStatus()) {
            let list = this.state.addProjectInfoList.map(item => {
                return {pNumber: item.projectNumber, pName: item.projectName};
            });
            let result = {addResult: false, deleteResult: false};
            if(this.state.addProjectInfoList.length === 0 && this.state.deleteProjectInfoList.length === 0) {
                this.closeDialog();
                this.openMessageDialog("提示","未进行修改。");
                return null;
            }
            if(this.checkExistingProject(list)) {
                if (this.state.addProjectInfoList.length > 0) {
                    $.ajax({
                        url: '/save-project-info',
                        type: 'POST',
                        data: JSON.stringify(list),
                        contentType: 'application/json',
                        async: false,
                        success: (res) => {
                            if (res !== "保存成功") {
                                this.openMessageDialog("提示", "添加失败！");
                            } else {
                                result.addResult = true;
                            }
                        }
                    });
                }
                if (this.state.deleteProjectInfoList.length > 0) {
                    let list = this.state.deleteProjectInfoList.map(item => {
                        return item.projectNumber;
                    });
                    $.ajax({
                        url: '/delete-project-info',
                        type: 'POST',
                        data: JSON.stringify(list),
                        contentType: 'application/json',
                        async: false,
                        success: (res) => {
                            if (res !== "删除成功") {
                                this.openMessageDialog("提示", "删除失败！");
                            } else {
                                result.deleteResult = true;
                            }
                        }
                    });
                }
                this.closeDialog();
                this.openMessageDialog("提示", "修改成功");
            }
        }
    };
    render() {
        return(
            <div>
                <div className="modal fade" id="project-manage-dialog" data-backdrop="static">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg width-600px">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>项目管理</h3>
                                <button type="button" className="close btn btn-outline-light" data-dismiss="modal" onClick={this.closeDialog}>&times;</button>
                            </div>
                            <div className="modal-body ml-4 height-450px">
                                <form id="project-manage-form">
                                    <button className="btn btn-outline-primary" type="button" onClick={this.addProject}>添加项目</button>
                                    <table className="table table-hover table-bordered table-sm text-center mt-3">
                                        <thead>
                                            <tr>
                                                <th>项目编号</th>
                                                <th>项目名称</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.projectInfoList.map((item, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td className="align-middle"><input className="form-control"  type="text" autoComplete="off" readOnly={true} placeholder={item.projectNumber} /></td>
                                                    <td className="align-middle"><input className="form-control"  type="text" autoComplete="off" readOnly={true} placeholder={item.projectName} /></td>
                                                    <td>
                                                        <button className="btn btn-outline-primary btn-sm" type="button" onClick={this.deleteDefaultProject.bind(this, index)}>删除</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {this.state.addProjectInfoList.map((item, index) => {
                                            return(
                                                <tr key={item.id}>
                                                    <td className="align-middle"><input id={"project-number-"+index} className="form-control"  type="text" autoComplete="off" onChange={this.projectNumberChange.bind(this, index)} /></td>
                                                    <td className="align-middle"><input id={"project-name-"+index} className="form-control"  type="text" autoComplete="off" onChange={this.projectNameChange.bind(this, index)}/></td>
                                                    <td>
                                                        <button className="btn btn-outline-primary btn-sm" type="button" onClick={this.deleteAddProject.bind(this, index)}>删除</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" type="button" onClick={this.restoreProjectInfo}>重置</button>
                                <button className="btn btn-outline-primary" type="button" data-dismiss="modal" onClick={this.closeDialog}>取消</button>
                                <button className="btn btn-outline-primary" type="button" onClick={this.saveProjectInfo}>保存修改</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProjectManageDialog;