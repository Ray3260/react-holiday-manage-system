import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/Search.css'
import Table from '../components/table'
import axios from "axios"
import $ from 'jquery';
import checkLoginStatus from '../common/checkLoginStatus'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '1',
      startTime: '',
      endTime: '',
      message: [],
      times: 0,
    }
    this.InfoComponent = React.createRef();

    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleClickReset = this.handleClickReset.bind(this);
  }

  componentDidMount(){
    checkLoginStatus();
  }

  openMessageDialog = (title, message) => {
    let $modal = $("#hint-modal");
    $modal.find("h5").text(title);
    $modal.find("p").text(message);
    $modal.modal("toggle");
    $(".modal-backdrop").css("z-index","9998");
  };

  handleChangeStartTime(event) {
    this.setState({
      startTime: event.target.value
    })
  }

  handleChangeEndTime(event) {
    this.setState({
      endTime: event.target.value
    })
  }

  handleChangeType(event) {
    this.setState({
      type: event.target.value
    })
  }
  startSearch = () => {
    this.setState({
      message: []
    });
    function isLegal(startTime, endTime) {
      if (startTime.length === 0 || endTime.length === 0) {
        return true;
      }
      //两个时间都有值，对两个时间进行合法性判断
      let startTime_unix = Date.parse(startTime.replace(/-/g, '/'));
      let endTime_unix = Date.parse(endTime.replace(/-/g, '/'));
      return startTime_unix <= endTime_unix;
    }

    if (checkLoginStatus()) {
      let startTime = this.state.startTime;
      let endTime = this.state.endTime;
      let result = isLegal(startTime, endTime);
      if (result) {
        let startDate = this.state.startTime.length === 0 ? this.state.startTime : this.state.startTime.concat(' 00:00:00');
        let endDate = this.state.endTime.length === 0 ? this.state.endTime : this.state.endTime.concat(' 23:59:59');
        let data = {
          email: sessionStorage.getItem('userInfo'),
          dateType: this.state.type,
          startDate: startDate,
          endDate: endDate,
        };
        this.setState({
          times: 1,
        });
        axios.post(`/holiday-record`, data)
          .then(res => {
            let responseData = res.data;
            let newMessage = [];
            for (let obj of responseData) {
              let messageElement = [];
              messageElement.push(obj['name']);
              messageElement.push(obj['applyTime'].slice(0, 10));
              messageElement.push(obj['dateTime'].slice(0, 10).concat(obj['dateTime'].slice(21, 32)));
              messageElement.push(this.state.type);
              messageElement.push(obj['dateLength']);
              messageElement.push(obj['tele']);
              messageElement.push(obj['note']);
              messageElement.push(obj['comment']);
              messageElement.push(obj['result']);
              newMessage.push(messageElement);
            }
            this.setState({
              message: newMessage,
            });
          })
      } else {
        this.openMessageDialog("日期错误", "您输入的日期格式有误");
        this.setState({
          startTime: "",
          endTime: "",
        })
      }
    }
  }

  handleClickReset() {
    this.setState({
      type: '1',
      startTime: '',
      endTime: '',
      message: [],
    })
  }

  render() {
    return (
      <div className="content approval-scrollable" style={{ height: window.innerHeight }}>
        <div className="container  pl-60px approval-section">
          <div className="row mb-5 pt-4">
            <div className="mx-auto">
              <h3>我申请的假期</h3>
            </div>
          </div>

          <form>
            <div className="w-50 min-w-480px">
              <div className="input-group mb-3">
                <label className="input-group-text w-180px">请假类型:</label>
                <select value={this.state.type} onChange={this.handleChangeType} className="form-control w-180px">
                  <option value="1">调休假</option>
                  <option value="0">年假</option>
                  <option value="2">病假/事假</option>
                </select>
              </div>

              <div className="input-group mb-3">
                <label className="input-group-text w-180px">开始时间:</label>
                <input type="date" onChange={this.handleChangeStartTime} value={this.state.startTime} className="form-control w-180px" />
              </div>

              <div className="input-group mb-3">
                <label className="input-group-text w-180px">结束时间:</label>
                <input type="date" onChange={this.handleChangeEndTime} value={this.state.endTime} className="form-control w-180px" />
              </div>

            </div>
          </form>
          <div className="row mb-5">
            <div className="col-md-1">
              <button className="btn btn-outline-primary" onClick={this.startSearch}>查询</button>
            </div>
            <div className="col-md-1">
              <button className="btn btn-outline-primary" onClick={this.handleClickReset}>重置</button>
            </div>
          </div>
          <Table message={this.state.message} times={this.state.times} search={this.startSearch}/>
        </div>
      </div>
    )
  }
}

export default Search;
