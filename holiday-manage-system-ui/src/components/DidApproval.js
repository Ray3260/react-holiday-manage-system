import React from 'react';
import $ from 'jquery'
import axios from 'axios';
import '../css/Approval.css';
import checkLoginStatus from '../common/checkLoginStatus';

class DidApproval extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            totalPage: 1,
            fromIndex: 0,
            toIndex: 5,
            userItem: [],
        };
    };

    componentDidMount() {
        axios.get('/did-user-approval', {params: {page: 0, start: 0, count: 5,
                admin: sessionStorage.getItem("userInfo")}})
            .then(info => {
                this.setState({userItem: info.data.approvalList});
                this.setState({totalPage: info.data.totalPage});
            });
        this.setState({page: 1});
    }

    /**
     * 选择显示table条数
     * */
    handleSelectClick = (event) => {
        if (checkLoginStatus()) {
            let pageNum = Number(event.target.value);
            this.setState({toIndex: pageNum});
            axios.get('/did-user-approval', {params: {page: 0, start: 0, count: pageNum,
                    admin: sessionStorage.getItem("userInfo")}})
                .then(info => {
                    this.setState({userItem: info.data.approvalList});
                    this.setState({totalPage: info.data.totalPage});
                });
            this.setState({preCount: pageNum});
            this.setState({page: 1});
            this.setState({fromIndex: 0});
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
            axios.get('/did-user-approval', {params: {page: this.state.page - 2,
                    start: from, count: this.state.toIndex, admin: sessionStorage.getItem("userInfo")}})
                .then(info => {
                    this.setState({userItem: info.data.approvalList});
                    this.setState({totalpage: info.data.totalPage});
                });
            this.setState({fromIndex: from});
            this.setState({page: this.state.page - 1});
        }
    };

    /**
     * 下一页点击函数
     * */
    handleNextPageClick = () => {
        if (checkLoginStatus()) {
            let pageNum = Number(this.refs.selectNum.value);
            let from = this.state.fromIndex+pageNum;
            axios.get('/did-user-approval', {params: {page: this.state.page,
                    start: from, count: this.state.toIndex, admin: sessionStorage.getItem("userInfo")}})
                .then(info => {
                    this.setState({userItem:info.data.approvalList});
                    this.setState({totalPage: info.data.totalPage});
                });
            this.setState({fromIndex: from});
            this.setState({page: this.state.page + 1});
        }
    };

    /**
     * 打开登录模态框
     * */
    static showModalSignIn = () => {
        $('#exampleModalCenter').modal({ show: true });
    };

    render() {
        return (
            <div id="did-approval-field">
                <div>
                    <table className="table  table-hover table-bordered table-sm text-center approval-table">
                        <thead className="approval-table-head text-nowrap ">
                        <tr>
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
                            this.state.userItem.length === 0
                                ? <tbody><tr><td colSpan="11" className="align-middle">没有查询到相关的数据，请重新加载。</td></tr></tbody>
                                : <tbody>
                                {
                                    this.state.userItem.map((row, index) => {
                                        const rowIndex = 'cell' + index;
                                        return (<tr key={index} id={"tr" + index}>
                                                <td className="align-middle p-2" id={rowIndex + 0}>{row.name}</td>
                                                <td className="align-middle p-2" id={rowIndex + 1}>{row.year}</td>
                                                <td className="align-middle p-2" id={rowIndex + 2}>{row.email}</td>
                                                <td className="align-middle p-2" id={rowIndex + 3}>{row.type}</td>
                                                <td className="align-middle p-2" id={rowIndex + 4}>{row.times}</td>
                                                <td className="align-middle p-2" id={rowIndex + 5}>{row.days}</td>
                                                <td className="align-middle p-2" id={rowIndex + 6}>{row.contact}</td>
                                                <td className="align-middle p-2" id={rowIndex + 7}>{row.reason}</td>
                                                <td className="align-middle p-2" id={rowIndex + 8}>{row.approverComment}</td>
                                                <td className="align-middle p-2">{row.status}</td>
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
                        <form id="approval-form-field"><select className="form-control form-control-sm" ref="selectNum" onChange={this.handleSelectClick}
                                hidden={this.state.userItem.length === 0}>
                            <option value="5" >5</option>
                            <option value="10" >10</option>
                            <option value="15" >15</option>
                            <option value="20" >20</option>
                        </select></form>
                    </div>
                    <div className="mr-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={this.handlePrePageClick}
                                hidden={this.state.userItem.length === 0} disabled={this.state.page === 1}>
                            上一页
                        </button>
                    </div>
                    <div className="mr-2 btn-sm">
                        <p hidden={this.state.userItem.length === 0}>{this.state.page}/{this.state.totalPage}</p>
                    </div>
                    <div>
                        <button className="btn btn-outline-primary btn-sm" onClick={this.handleNextPageClick}
                                hidden={this.state.userItem.length === 0} disabled={this.state.page === this.state.totalPage}>
                            下一页
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DidApproval;
