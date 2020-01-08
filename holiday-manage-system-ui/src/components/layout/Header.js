import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import $ from "jquery";
import Avatar from '../../images/Avatar.png';
class Header extends React.Component{
  constructor() {
    super();
    this.state = {
      login_state: sessionStorage.getItem("isAccess")
    }
  }
  handleNavClick = () => {
    var wrapper = document.getElementById('wrapper');
    wrapper.classList.toggle('is-nav-open');
  }
  showModalLogOut = () => {
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
  showModalSignIn = () => {
    $('#exampleModalCenter').modal({show:true});
  }
  render(){
    return (
      <nav className="navbar navbar-light bg-light hms-header navbar-expand">
        <button className="btn btn-outline-danger md-3" onClick={this.handleNavClick}>
          <AiOutlineMenu size={25}/>
        </button>
        <h3 className="ml-3 font-weight-bold">假期管理系统</h3>
        <a className="sign-in">
          {this.state.login_state
            ? (<img src={Avatar} width="40px" height="40px" alt="" data-placement="top"
                data-toggle="tooltip" title="personal" onClick={this.showModalLogOut}/>)
            : (<span onClick={this.showModalSignIn} className="btn btn-danger"
                data-toggle="modal" data-target="#exampleModalCenter">SignIn</span>)}
          </a>
      </nav>
    );
  }
}
export default Header;