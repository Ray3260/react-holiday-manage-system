import React from 'react';
import { Link } from "react-router-dom";
import {withRouter} from "react-router-dom";
import $ from "jquery";
import 'animate.css';
import logo from '../../../public/favicon.ico';
require('../../css/Nav.css');

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin_show: sessionStorage.getItem("isManager"),
      system_show: sessionStorage.getItem("isSystemManager"),
      login_state: sessionStorage.getItem("isAccess")
    }
    this.showModalSignIn = this.showModalSignIn.bind(this);
    this.showModalLogOut = this.showModalLogOut.bind(this);
  }
  handleClick = (event) => {
    // 调用ajax请求登录状态
    var isLogin = false;
    $.ajax({
        type:'GET',
        url:'/check',
        async:false,
        success:function(res){
            if (res === 'isChecked'){
                isLogin = true;
            }
        }
    });
    if (!isLogin) {
        this.setState({
          admin_show: false,
          login_state: false
        });
        sessionStorage.clear();
        this.showModalSignIn();
        sessionStorage.setItem("toUrl", event.target.href)
        event.preventDefault();
    }
  }
  showModalSignIn() {
    $('#exampleModalCenter').modal({show:true});
  }
//   componentDidMount() {
//     document.addEventListener('click', e => {
//       var _con = $('#wrapper');   // 设置目标区域
//       if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
//         if($('#wrapper').hasClass('is-nav-open')){
//           $('#wrapper').removeClass('is-nav-open')
//         }
//       }
//     })
// }

  openAbout(){
    this.props.history.push("/about");
  }

  showModalLogOut() {
    var is_Login = false;
    $.ajax({
      type:'GET',
      url:'/check',
      async:false,
      success:function(res){
          if (res === 'isChecked'){
              is_Login = true;
              $('#logout-modal').modal('toggle');
          }
      }
  });
  if (!is_Login) {
      this.setState({
        admin_show: false,
        login_state: false
      });
      sessionStorage.clear();
      this.showModalSignIn();
  }
  }
  render() {
    return (
      <aside id="wrapper" className="is-nav-open">
        <div className="wrapper-content">
          <nav className="navbar">
            <Link to='/about' className="d-flex navbar-brand">
              
              <img src={logo} alt="" width="40" height="30" className="pr-2"/>
              <span className="text-white">遍在软件&nbsp;ICT</span>
            </Link>
          </nav>
          <div className="hms-ul-content">
            <ul className="list-group list-group-flush nav flex-column">
              <li className="nav-item">
                <Link to='/home' className="list-group-item nav-link">{'主页'}</Link>
              </li>
              <li className="nav-item"><Link to='vacation-apply' className="list-group-item nav-link" onClick={this.handleClick}>{'休假申请'}</Link></li>
              <li className="nav-item"><Link to='/search' className="list-group-item nav-link" onClick={this.handleClick}>{'我申请的假期'}</Link></li>
              {this.state.system_show === "true" ? (<div>
                  <li className="nav-item"><Link to='/approval' className="list-group-item nav-link" onClick={this.handleClick}>{'休假审核'}</Link></li>
              </div>) : null}
              {this.state.admin_show === "true"? (<div>
                <li className="nav-item"><Link to='/approval' className="list-group-item nav-link" onClick={this.handleClick}>{'休假审核'}</Link></li>
                <li className="nav-item"><Link to='/vacation-manage' className="list-group-item nav-link" onClick={this.handleClick}>{'休假管理'}</Link></li>
              </div>) : null}
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}
export default withRouter(Nav);
