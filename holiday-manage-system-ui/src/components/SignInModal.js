import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SingInModal.css';
import axios from 'axios';
import $ from "jquery";
import ICTLogo from '../images/blogo_img_sc.png';
class SignInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: ""
    };
  }

  render() {
    document.addEventListener("keydown", this.onKeyup)
    return (
      <div className="modal fade" id="exampleModalCenter" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered mx-auto pl-70px" role="document">
          <div className="modal-content w-356px">
            <div className="modal-content-titel nav ">
              <div className="ICT-logo-size">
                <img className="ICTLogo" src={ICTLogo} alt="ICT解决方案中心" />
              </div>
              <h5 className="modal-title mx-auto pt-15px" id="exampleModalCenterTitle">Welcome</h5>
              <button id="close" type="button" className="btn close btn-outline-light w-45px" data-dismiss="modal" onClick={this.closeDialog}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="text" ref={input => this.input = input} className="form-control mb-3" placeholder="用户名" name="userName" id="loginName" />
              <input type="password" ref={input => this.input = input} className="form-control mb-3" placeholder="密码" name="userPassword" id="loginPassword" />
              <div className="invalid-feedback mb-3">用户名或密码错误，请重新输入</div>
              <div className="row">
                <div className="col-6">
                  <input type="text" className="form-control mb-3" placeholder="验证码" name="username" id="verificationCode" />
                  <div className="invalid-feedback">验证码错误，请重新输入</div>
                </div>
                <div className="col-6">
                  <div className="form-control mb-3 overflow-hidden pl-0 pt-0">
                    <canvas id="s-canvas" onClick={this.draw} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-3 w-50 mx-auto">
              <button id="keyBtn" type="button" className="btn btn-dark btn-block" onClick={this.loginStart}>Sign in</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.draw();
  }
  draw = () => {
    const canvas = document.getElementById('s-canvas');
    const context = canvas.getContext('2d');
    context.clearRect(-1, -1, 146, 38);
    context.strokeRect(-1, -1, 146, 38);
    const aCode = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
      'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A',
      'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
      'V', 'W', 'X', 'Y', 'Z'];
    let indexCode = "";
    for (let i = 0; i < 4; i++) {
      const x = 15 + 36 * i;
      const y = 18 + 10 * Math.random();
      const index = Math.floor(Math.random() * aCode.length);
      const txt = aCode[index];
      indexCode += txt.toLowerCase();
      context.font = 'bold 20px 微软雅黑';
      context.fillStyle = this.getTextColor();
      context.translate(x, y);
      const deg = Math.random() * 70 * Math.PI / 180;
      context.rotate(deg);
      context.fillText(txt, 0, 0);
      context.rotate(-deg);
      context.translate(-x, -y);
    }
    for (let i = 0; i < 8; i++) {
      context.beginPath();
      context.moveTo(Math.random() * 146, Math.random() * 38);
      context.lineTo(Math.random() * 146, Math.random() * 38);
      context.strokeStyle = this.getTextColor();
      context.stroke();
    }
    for (let i = 0; i < 20; i++) {
      context.beginPath();
      const x = Math.random() * 146;
      const y = Math.random() * 38;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.strokeStyle = this.getTextColor();
      context.stroke();
    }
    this.setState({
      verificationCode: indexCode
    })
  }
  //获取随机颜色
  getTextColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`
  }

  closeDialog = () => {
    this.draw();
    document.getElementById('loginName').value = "";
    document.getElementById('loginPassword').value = "";
    document.getElementById('verificationCode').value = "";
  }

  loginStart = (event) => {
    const verificationCode = document.getElementById('verificationCode').value.toLowerCase();
    if (this.state.verificationCode === verificationCode) {
      const userName = document.getElementById('loginName').value;
      const password = document.getElementById('loginPassword').value;
      const data = {
        login: userName,
        password: password
      }
      axios.post('/login', data).then(item => {
        var isAccess = item.data.isAccess;
        if (isAccess) {
          sessionStorage.setItem("isAccess", isAccess);
          sessionStorage.setItem("isSystemManager", (item.data.isManager === 1));
          sessionStorage.setItem("isManager", (item.data.isManager === 2));
          sessionStorage.setItem("userInfo", item.data.userInfo);
          $("#close").trigger("click");
          if(sessionStorage.getItem('toUrl')) {
            window.location.href = sessionStorage.getItem('toUrl');
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else {
          $("#loginName").addClass('is-invalid');
          $("#loginPassword").addClass('is-invalid');
          this.draw();
          $("input[id=loginPassword]").focus().val("");
          $("input[id=verificationCode]").focus().val("");
        }
      }, (error) => {
        console.log(error);
      });
    } else {
      $("#verificationCode").addClass('is-invalid');
      this.draw();
      $("input[id=verificationCode]").focus().val("");
    }
  }

  onKeyup = (event) => {
    const isloginShow = $('#exampleModalCenter').css('display')
    if (isloginShow === "block" && event.keyCode === 13) {//回车键的键值为13
      var toClick = document.getElementById("keyBtn")
      toClick.click();  //调用登录按钮的登录事件
    }
  }

}
export default SignInModal;
