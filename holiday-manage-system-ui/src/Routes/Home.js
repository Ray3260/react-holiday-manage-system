import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import $ from "jquery";
require('../css/Home.css');
const demoImgArr = [
  "pic (1)", 
  "pic (2)", 
  "pic (3)",
  "pic (4)",
  "pic (5)",
  "pic (6)",
  "pic (7)",
  "pic (8)",
  "pic (9)",
  "pic (10)",
  "pic (11)",
  "pic (12)"
];
const ticks = demoImgArr.map(item => require("../images/" + item + ".jpg"));

class Home extends React.Component{
  constructor(){
    super();
    this.state={
      ticks_index: 0
    }
  }
  showImg(event){
    this.setState({ticks_index: event.target.id});
    $('#imgShow').modal('show');
  }

  render(){
    return (
      <div id="phoebe-index-main" className="d-flex flex-column" style={{ height: window.innerHeight,overflow:"hidden"}}>
        <section className="container">
        <div id="phoebe-index-photo" >
          <div id="phoebe-index-photo-inside" style={{ height: window.innerHeight/2}} className="animated slideInRight">
            <ul id="phoebe-index-photo-ul" className="d-flex flex-row">
              {ticks.map((item, i) => <li key={i}><img className="rounded" src={item} id={i} alt="" onClick={()=> this.showImg(event)}/></li>)}
            </ul>
          </div>
          </div>
        </section>

          <div id="phoebe-index-Manifesto">
            <h3 className="font-weight-bold display-4 animated fadeIn">假期管理系统</h3>
            <blockquote className="blockquote animated fadeIn">
              <p className="font-weight-bold">让我们开启一个不一样的世界,</p>
              <p className="font-weight-bold">这只是我们小小的尝试。</p>
              <footer className="blockquote-footer">DAITO 全组成员</footer>
            </blockquote>
        </div>
        <div className="modal fade" id="imgShow" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" id="modal-info" role="document">
            <img id="img-info" src={ticks[this.state.ticks_index]} alt="#"/>
          </div>      
        </div>
      </div>

    );
  }
}
export default Home;