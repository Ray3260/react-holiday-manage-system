import React from 'react';
import $ from 'jquery'
import axios from 'axios';
import '../css/Approval.css';
import DidApproval from "../components/DidApproval";
import checkLoginStatus from '../common/checkLoginStatus';

class Approval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnState: true,
            totalBoxChecked: false,
            flag: false,
            page: 0,
            totalPage: 1,
            fromIndex: 0,
            toIndex: 5,
            data: [],
        };
    };

    /**
     * 初始化加载
     * */
    componentDidMount() {
        if (checkLoginStatus()) {
            $("#will-approval-field").show();
            $("#did-approval-field").hide();
            axios.get('/user-approval', {params: {page: this.state.page,
                    start: this.state.fromIndex, count: this.state.toIndex, admin: sessionStorage.getItem("userInfo")}})
                .then(data => {
                    this.setState({data: data.data.approvalList});
                    this.setState({totalPage: data.data.totalPage});
                });
            this.setState({page: this.state.page+1});
        }
    };

    /**
     * 显示未审批的table
     */
    onWillApprovalClick = () => {
        $("#will-approval-field").show();
        $("#did-approval-field").hide();
    };

    /**
     * 显示已审批的table
     */
    onDidApprovalClick = () => {
        $("#will-approval-field").hide();
        $("#did-approval-field").show();
    };

    handleBoxClick = (event) => {
        let selector = $("input[id][name='checkbox']");
        if (checkLoginStatus()) {
            if (event.target.checked) {
                selector.prop('checked', true);
                this.setState({totalBoxChecked: true});
                this.setState({btnState: false});
            } else {
                selector.prop('checked', false);
                this.setState({totalBoxChecked: false});
                this.setState({btnState: true});
            }
        }
    };

    handleInBoxClick = () => {
        let selector = $("input[id][name='checkbox']");
        if (checkLoginStatus()) {
            let count = selector.length;
            let sum = 0;
            for (let i = 0; i < count; i++) {
                if (selector[i].checked) {
                    sum++;
                }
            }
            (sum > 0) ? this.setState({btnState: false}) : this.setState({btnState: true});
            (sum === count) ? this.setState({totalBoxChecked: true}) : this.setState({totalBoxChecked: false});
        }
    };

    /**
     * 同意批处理函数
     * */
    handleOnAllSubmitClick = () => {
        let selector = $("input[id][name='checkbox']");
        let myModal = $("#myModal-on");
        let messageItem = [];
        if (checkLoginStatus()) {
            for (let i = 0; i < selector.length; i++) {
                let dataItem = [];
                if (selector[i].checked === true) {
                    let index = selector[i].id.toString().charAt(selector[i].id.length-1);
                    const data = {
                        email: document.getElementById(`${"cell" + index + 2}`).innerText,
                        type: document.getElementById(`${"cell" + index + 3}`).innerText,
                        time: document.getElementById(`${"cell" + index + 4}`).innerText,
                        days: document.getElementById(`${"cell" + index + 5}`).innerText,
                        approval_reason: this.refs[index].value,
                        status: (sessionStorage.getItem("isSystemManager") === "true") ? 1 : 2,
                        admin: sessionStorage.getItem("userInfo"),
                        date: new Date().getTime()
                    };
                    dataItem.push(data);
                    $.ajax({
                        url:'/user-days',
                        type: 'POST',
                        data: JSON.stringify([{'email':data.email, 'type': data.type}]),
                        contentType: 'application/json',
                        async: false,
                        success: item => {
                            item.forEach((info, index) => {
                                if (info < dataItem[index].days) {
                                    messageItem.push(document.getElementById(`${"cell" + index  + 0}`).innerText
                                        + dataItem[index].type + " ");
                                } else {
                                    $.ajax({
                                        url:'/holiday-approval',
                                        type: 'POST',
                                        data: JSON.stringify(dataItem),
                                        async: false,
                                        contentType: 'application/json',
                                    }).then(this.setState({flag: true}));
                                }
                            });
                        }
                    });
                }
            }
            if (messageItem.length > 0) {
                myModal.modal("toggle");
                myModal.on('show.bs.modal', this.handleModal("Warning","假期天数不足，请拒绝！",messageItem));
            } else {
                myModal.modal("toggle");
                myModal.on('show.bs.modal', this.handleModal("Success", "数据提交成功！",[]));
                this.setState({flag: true});
            }
        }
    };

    /**
     * 不同意批处理函数
     * */
    handleUnAllSubmitClick = () => {
        let selector = $("input[id][name='checkbox']");
        let myModal = $("#myModal-on");
        const dataItem = [];
        if (checkLoginStatus()) {
            for (let i = 0; i < selector.length; i++) {
                if (selector[i].checked === true) {
                    let index = selector[i].id.toString().charAt(selector[i].id.length-1);
                    const data = {
                        email: document.getElementById(`${"cell" + index + 2}`).innerText,
                        type: document.getElementById(`${"cell" + index + 3}`).innerText,
                        time: document.getElementById(`${"cell" + index + 4}`).innerText,
                        days: document.getElementById(`${"cell" + index + 5}`).innerText,
                        approval_reason: this.refs[index].value,
                        status: 3,
                        admin: sessionStorage.getItem("userInfo"),
                        date: new Date().getTime()
                    };
                    dataItem.push(data);
                }
            }
            let count = 0;
            for (let data of dataItem) {
                if (data.approval_reason !== "") {
                    count++;
                }
            }
            if (count === dataItem.length) {
                myModal.modal("toggle");
                myModal.on('show.bs.modal', this.handleModal("Success","数据提交成功！", []));
                this.setState({flag: true});
                axios.post('/holiday-approval', dataItem)
                    .then(res =>
                        console.log(res + "success"));
            } else {
                myModal.modal("toggle");
                myModal.on('show.bs.modal', this.handleModal("Warning", "请先填写审批意见！"));
                this.setState({flag: false});
            }
        }
    };

    /**
     * 同意点击函数
     * */
    handleOnSubmitClick = (index) => {
        let myModal = $("#myModal-on");
        const dataItem = [];
        if (checkLoginStatus()) {
            const data = {
                email: document.getElementById(`${"cell" + index + 2}`).innerText,
                type: document.getElementById(`${"cell" + index + 3}`).innerText,
                time: document.getElementById(`${"cell" + index + 4}`).innerText,
                days: document.getElementById(`${"cell" + index + 5}`).innerText,
                approval_reason: this.refs[index].value,
                status: (sessionStorage.getItem("isSystemManager") === "true") ? 1 : 2,
                admin: sessionStorage.getItem("userInfo"),
                date: new Date().getTime()
            };
            dataItem.push(data);
            $.ajax({
                url:'/user-days',
                type: 'POST',
                data: JSON.stringify([{"email": data.email, "type": data.type}]),
                contentType: 'application/json',
                async: false,
                success: item => {
                    if (item[0] < data.days) {
                        let message = [];
                        message.push(document.getElementById(`${"cell" + index  + 0}`).innerText
                            + data.type + " ");
                        myModal.modal("toggle");
                        myModal.on('show.bs.modal', this.handleModal("Warning","假期天数不足，请拒绝！", message));
                    } else {
                        myModal.modal("toggle");
                        myModal.on('show.bs.modal', this.handleModal("Success","数据提交成功！", []));
                        this.setState({flag: true});
                        axios.post('/holiday-approval', dataItem)
                            .then(res => console.log(res + "success"));
                    }
                }
            })
        }
    };

    /**
     * 不同意点击函数
     * */
    handleUnSubmitClick = (index) => {
        let myModal = $("#myModal-on");
        if (checkLoginStatus()) {
            if (this.refs[index].value === "") {
                myModal.modal("toggle");
                myModal.on('show.bs.modal', this.handleModal("Warning","请先填写审批意见！",[]));
                this.setState({flag: false});
            } else {
                const dataItem = [];
                myModal.modal("toggle");
                myModal.on('show.bs.modal', this.handleModal("Success","数据提交成功！",[]));
                this.setState({flag: true});
                const data = {
                    email: document.getElementById(`${"cell" + index + 2}`).innerText,
                    type: document.getElementById(`${"cell" + index + 3}`).innerText,
                    time: document.getElementById(`${"cell" + index + 4}`).innerText,
                    days: document.getElementById(`${"cell" + index + 5}`).innerText,
                    approval_reason: this.refs[index].value,
                    status: 3,
                    admin: sessionStorage.getItem("userInfo"),
                    date: new Date().getTime()
                };
                dataItem.push(data);
                axios.post('/holiday-approval', dataItem)
                    .then(res => console.log(res + "success"));
            }
        }
    };

    /**
     * 提示模态框
     * */
    handleModal = (title, content, flag) => {
        let modal = $("#myModal-on");
        if (flag.length === 0) {
            modal.find('.modal-title').text(title);
            modal.find('.modal-body p').text(content);
        } else {
            let email = "";
            flag.filter((item, index, self) => self.indexOf(item) === index)
                .forEach(info => email += info);
            modal.find('.modal-title').text(title);
            modal.find('.modal-body p').text(email + content);
            $(":checkbox").prop('checked', false);
            this.setState({btnState: true});
            this.setState({totalBoxChecked: false});
            $("textarea").val("");
        }
    };

    /**
     * 选择显示table条数
     * */
    handleSelectClick = (event) => {
        if (checkLoginStatus()) {
            let pageNum = Number(event.target.value);
            this.setState({toIndex: pageNum});
            axios.get('/user-approval', {params: {page: 0, start: 0, count: pageNum,
                    admin: sessionStorage.getItem("userInfo")}})
                .then(data => {
                    this.setState({data: data.data.approvalList});
                    this.setState({totalPage: data.data.totalPage});
                });
            this.setState({preCount: pageNum});
            this.setState({page: 1});
            this.setState({fromIndex: 0});
            $('textarea').val("");
            $(":checkbox").prop('checked', false);
            this.setState({btnState: true});
            this.setState({totalBoxChecked: false});
        }
    };

    /**
     *  上一页点击函数
     * */
    handlePrePageClick = () => {
        if (checkLoginStatus()) {
            let pageNum = Number(this.refs.selectNum.value);
            let from = this.state.fromIndex-pageNum;
            if (from < 0) {
                from = 0;
            }
            axios.get('/user-approval', {params: {page: this.state.page - 2,
                    start: from, count: this.state.toIndex, admin: sessionStorage.getItem("userInfo")}})
                .then(data => {
                    this.setState({data: data.data.approvalList});
                    this.setState({totalpage: data.data.totalPage});
                });
            this.setState({fromIndex: from});
            this.setState({page: this.state.page - 1});
            $('textarea').val("");
            $(":checkbox").prop('checked', false);
            this.setState({btnState: true});
            this.setState({totalBoxChecked: false});
        }
    };

    /**
     * 下一页点击函数
     * */
    handleNextPageClick = () => {
        if (checkLoginStatus()) {
            let pageNum = Number(this.refs.selectNum.value);
            let from = this.state.fromIndex+pageNum;
            axios.get('/user-approval', {params: {page: this.state.page,
                    start: from, count: this.state.toIndex, admin: sessionStorage.getItem("userInfo")}})
                .then(data => {
                    this.setState({data:data.data.approvalList});
                    this.setState({totalPage: data.data.totalPage});
                });
            this.setState({fromIndex: from});
            this.setState({page: this.state.page + 1});
            $('textarea').val("");
            $(":checkbox").prop('checked', false);
            this.setState({btnState: true});
            this.setState({totalBoxChecked: false});
        }
    };

    /**
     * 打开登录模态框
     * */
    static showModalSignIn = () => {
        $('#exampleModalCenter').modal({ show: true });
    };

    /**
     * 刷新table表格数据
     * */
    closeMessageDialog = () => {
        if (this.state.flag === true) {
            axios.get('/user-approval', {params: {page: 0, start: 0, count: this.state.toIndex,
                    admin: sessionStorage.getItem("userInfo")}})
                .then(data => {
                    this.setState({data: data.data.approvalList});
                    this.setState({totalPage: data.data.totalPage});
                });
            this.setState({page: 1});
            this.setState({fromIndex: 0});
            $(":checkbox").prop('checked', false);
            this.setState({btnState: true});
            this.setState({totalBoxChecked: false});
            $("textarea").val("");
        }
    };

    render() {
        return (
            <section className="approval-content approval-scrollable" style={{height:window.innerHeight}}>
                <section className="container  pl-60px approval-section">
                    <h3 className="text-center pt-4 mb-5">休假审核</h3>
                    <div className="text-center mb-3">
                        <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                            <button type="button" className="btn btn-outline-primary" onClick={this.onWillApprovalClick}>未审批</button>
                            <button type="button" className="btn btn-outline-primary" onClick={this.onDidApprovalClick}>已审批</button>
                        </div>
                    </div>
                    <div id="will-approval-field">
                        <div className="btn-group btn-sm mr-0 mb-2 pl-0" role="group" aria-label="First group">
                            <button type="button" className="btn btn-outline-primary" onClick={this.handleOnAllSubmitClick}
                                    data-toggle="modal" disabled={this.state.btnState || this.state.data.length === 0}>
                                同意
                            </button>
                        </div>
                        <div className="btn-group btn-sm mb-2" role="group">
                            <button type="button" className="btn btn-outline-primary" onClick={this.handleUnAllSubmitClick}
                                    data-toggle="modal" disabled={this.state.btnState || this.state.data.length === 0}>
                                不同意
                            </button>
                        </div>
                        <div>
                            <table className="table  table-hover table-bordered table-sm text-center approval-table">
                                <thead className="approval-table-head text-nowrap ">
                                <tr>
                                    <th className="align-middle p-2" style={{width: "35px"}}>
                                        <input type="checkbox" ref="trInputCheckbox" onChange={this.handleBoxClick}
                                               checked={this.state.totalBoxChecked}/>
                                    </th>
                                    <th className="align-middle p-2" style={{width: "72px"}} >姓名</th>
                                    <th className="align-middle p-2" style={{width: "53px"}} >年度</th>
                                    <th className="align-middle p-2" style={{width: "105px"}} >邮箱</th>
                                    <th className="align-middle p-2" style={{width: "80px"}} >请假类型</th>
                                    <th className="align-middle p-2" style={{width: "115px"}} >请假时间</th>
                                    <th className="align-middle p-2" style={{width: "60px"}} >总天数</th>
                                    <th className="align-middle p-2" style={{width: "115px"}} >联系电话</th>
                                    <th className="align-middle p-2" style={{width: "135px"}} >备注</th>
                                    <th className="align-middle p-2" style={{width: "170px"}} >审批意见</th>
                                    <th className="align-middle p-2" style={{width: "130px"}} >操作</th>
                                </tr>
                                </thead>
                                {
                                    this.state.data.length === 0
                                        ? <tbody><tr><td colSpan="11" className="align-middle">没有查询到相关的数据，请重新加载。</td></tr></tbody>
                                        : <tbody>
                                        {
                                            this.state.data.map((row, index) => {
                                                const rowIndex = 'cell' + index;
                                                return (<tr key={index} id={"tr" + index}>
                                                        <td className="align-middle p-2">
                                                            <input type="checkbox" id={"checkbox" + index} name="checkbox"
                                                                   onClick={this.handleInBoxClick}/>
                                                        </td>
                                                        <td className="align-middle p-2" id={rowIndex + 0}>{row.name}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 1}>{row.year}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 2}>{row.email}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 3}>{row.type}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 4}>{row.times}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 5}>{row.days}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 6}>{row.contact}</td>
                                                        <td className="align-middle p-2" id={rowIndex + 7}>{row.reason}</td>
                                                        <td className="align-middle p-2"><textarea rows="1" ref={index}/></td>
                                                        <td className="align-middle p-2">
                                                            <div className="btn-group btn-group-sm mr-1">
                                                                <button type="button" className="btn  btn-outline-primary"
                                                                        id={rowIndex + 'btn-on'} data-toggle="modal"
                                                                        onClick={() => this.handleOnSubmitClick(index)}>
                                                                    同意
                                                                </button>
                                                            </div>
                                                            <div className="btn-group  btn-group-sm">
                                                                <button type="button" className="btn  btn-outline-primary"
                                                                        id={rowIndex + 'btn-off'} data-toggle="modal"
                                                                        onClick={() => this.handleUnSubmitClick(index)}>
                                                                    不同意
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                          </tbody>
                                }
                            </table>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="mr-3">
                                <select className="form-control form-control-sm" ref="selectNum" onChange={this.handleSelectClick}
                                        hidden={this.state.data.length === 0}>
                                    <option value="5" >5</option>
                                    <option value="10" >10</option>
                                    <option value="15" >15</option>
                                    <option value="20" >20</option>
                                </select>
                            </div>
                            <div className="mr-2">
                                <button className="btn btn-outline-primary btn-sm" onClick={this.handlePrePageClick} hidden={this.state.data.length === 0}
                                        disabled={this.state.page === 1}>上一页</button>
                            </div>
                            <div className="mr-2 btn-sm">
                                <p hidden={this.state.data.length === 0}>{this.state.page}/{this.state.totalPage}</p>
                            </div>
                            <div>
                                <button className="btn btn-outline-primary btn-sm" onClick={this.handleNextPageClick} hidden={this.state.data.length === 0}
                                        disabled={this.state.page === this.state.totalPage}>下一页</button>
                            </div>
                        </div>
                    </div>
                    <div id="did-approval-field">
                        <DidApproval />
                    </div>
                    {/*模态框*/}
                    <div className="modal fade" id="myModal-on" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered mx-auto pl-70px" role="document">
                            <div className="modal-content w-356px">
                                <div className="modal-header pt-1 pb-1">
                                    <h5 className="modal-title" id="myModalLabel"> </h5>
                                </div>
                                <div className="modal-body pt-0">
                                    <p className="d-flex justify-content-center mt-4 align-middle text-center" />
                                    <div className="d-flex align-items-end flex-column mt-4">
                                        <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={this.closeMessageDialog}>关闭</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        );
    }
}

export default Approval;
