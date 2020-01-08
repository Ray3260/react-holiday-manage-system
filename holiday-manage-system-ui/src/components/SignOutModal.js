import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import '../css/SingOutModal.css';

class SignOutModal extends React.Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    this.state ={
      employee: {}
    }
  }

  componentDidMount(){
    if(sessionStorage.getItem('userInfo')){
      $.ajax({
        type: 'GET',
        url: '/personal',
        data: {userInfo: sessionStorage.getItem('userInfo')},
        success: (res) => {
          this.setState({
            employee: res
          });
        }
      });
    }
  }
  render() {
    return (
      <div className="modal fade" id="logout-modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true" data-backdrop="static">
        <div className="modal-dialog modal-dialog-centered w-400px" role="document">
          <div className="modal-content">
            <div className="modal-header pt-1 pb-1">
              <h5 className="modal-title">个人主页</h5>
            </div>
            <div className="modal-body">
              <div className="card">
                <div className="personal-header card-header"><img className="personal-img" src={require("../images/person.jpg")} alt="" />
                  <div className="peronal-information">{this.state.employee.name}</div>
                  <div className="peronal-information">{this.state.employee.email}</div>
                </div>
                <div className="personal-divider" />
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><span>调休假:</span><span>剩余 {this.state.employee.vacationLeave} 天</span></li>
                  <li className="list-group-item"><span>年&#12288;假:</span><span>剩余 {this.state.employee.annualLeave} 天</span></li>
                  <li className="list-group-item"><span>项目组:</span>
                    <span>{this.state.employee.project}</span>
                  </li>
                  <li className="list-group-item"><span>职&#12288;权:</span>
                    <span>{this.state.employee.eLevel === '2' 
                      ? "系统管理员"
                      : (this.state.employee.eLevel === '1' ? "项目管理员" : "员工")}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-primary" data-dismiss="modal">关闭</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.signOut}>退出登录</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  signOut() {
    var signOut = false;
    $.ajax({
      type: 'POST',
      url: '/logout',
      async: false,
      success: function (res) {
        if (res === 'succeed') {
          signOut = true;
        }
      }
    });
    if (signOut) {
      sessionStorage.clear();
      window.location.href = window.location.href.split('#')[0];
    }
  }
}
export default SignOutModal;