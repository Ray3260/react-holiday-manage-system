import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/Search.css'
import '../css/VacationEntryDialog.css';
import $ from 'jquery';
class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trIndex: null,
      current: 1,
      num: 5,
      back: '',
      next: ''
    };

    this.handleClickNext = this.handleClickNext.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleChangeNum = this.handleChangeNum.bind(this);
    this.canBack = this.canBack.bind(this);
    this.canNext = this.canNext.bind(this);
    this.canDisabled = this.canDisabled.bind(this);
  }

  canBack() {
    if (this.state.current > 1) {
      this.setState({
        back: ''
      })
    } else {
      this.setState({
        back: 'disabled'
      })
    }
  }

  canNext() {
    if (this.state.current < this.props.message.length / this.state.num) {
      this.setState({
        next: ''
      })
    } else {
      this.setState({
        next: 'disabled'
      })
    }
  }
  /*
     * 打开消息modal
     */
  openMessageDialog = (message, index) => {
      let $modal = $("#message-dialog");
      $modal.find("p").text(message);
      $modal.modal("toggle");
  };
  /*
   * 关闭消息modal
   */
  closeMessageDialog = () => {
    $("#message-dialog").modal("toggle");
  };

  confirmRevoke = () => {
    let email = sessionStorage.getItem('userInfo');
    let startDate = $("#"+this.state.trIndex+"-cell-2").text().split("~")[0];
    $.ajax({
      type: "GET",
      url: "/vacation-revoke",
      data: {email: email, startDate: startDate},
      success: () => {
        this.closeMessageDialog();
        this.props.search();
      }
    });
  };

  //撤销函数
  Revoke = (trIndex, tdIndex) => {
    this.setState({trIndex: trIndex});
    this.openMessageDialog("确定撤销此记录？");
  };

  canDisabled() {
    this.canBack();
    this.canNext();
  }

  handleClickBack() {
    this.setState((state) => {
      if (state.current > 1) {
        return {
          current: state.current - 1
        }
      } else {
        return {
          current: state.current
        }
      }
    }, this.canDisabled)
  }

  handleClickNext() {
    this.setState((state) => {
      if (state.current < this.props.message.length / state.num) {
        return {
          current: state.current + 1
        }
      } else {
        return {
          current: state.current
        }
      }
    }, this.canDisabled)
  }

  handleChangeNum(event) {
    this.setState({
      num: event.target.value,
      current: 1,
    }, this.canDisabled)
  }

  componentDidMount() {
    this.canDisabled();
  }

  render() {
    const headerList = ['姓名', '申请时间', '休假时间', '休假类型', '休假总天数', '紧急联系电话', '备注', '审批意见', '审批结果','是否撤销'];
    const data = this.props.message;

    const showData = data.filter((element, index) => {
      return (this.state.num * (this.state.current - 1) <= index) && (index < this.state.num * this.state.current);
    });

    return (
      <div>
        <table className="table table-hover table-bordered text-center my-table">
          <thead>
            <tr>
              {
                headerList.map((element, index) => {
                  return (<th key={index.toString()} style={{ backgroundColor: 'white' }}>{element}</th>)
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              showData.map((element, trIndex) => {
                return (
                  <tr key={trIndex.toString()} style={{ backgroundColor: 'rgb(243, 243, 243)}' }}>
                    {
                      element.map((e, tdIndex) => {
                        if (tdIndex.toString() === '3') {
                          if (e === '0') {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>年假</td>
                          } else if (e === '1') {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>调休假</td>
                          } else {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>病假/事假</td>
                          }
                        } else if (tdIndex.toString() === '8') {
                          if (e === 0) {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>未审批</td>
                          } else if (e === 1) {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>审批中</td>
                          } else if (e === 2) {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>同意</td>
                          } else if (e === 3){
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>不同意</td>
                          } else if (e === 4){
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>已撤销</td>
                          } else {
                            return <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()} />
                          }
                        } else {
                          return (
                            <td id={trIndex+"-cell-"+tdIndex} key={(tdIndex + 1).toString()}>{e}</td>
                          )
                        }
                      })
                    }
                    {
                      element.map((e, tdIndex) => {
                        if(tdIndex.toString() === '8') {
                          if(e === 0 || e === 1){
                            return <td key={(tdIndex + 1)}><button className="btn btn btn-primary" onClick={this.Revoke.bind(this, trIndex)}>撤销</button></td>
                          } else {
                            return <td key={(tdIndex+1)}/>
                          }
                        }else {
                          return null;
                        }
                      })
                    }
                  </tr>
                )
              }
              )
            }
          </tbody>
        </table>
        <div className="d-flex justify-content-end">
          <div className="mr-2">
            <select value={this.state.num} onChange={this.handleChangeNum} className="form-control form-control-sm">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="mr-2">
            <button type="button" onClick={this.handleClickBack} disabled={this.state.back} className="btn btn-outline-primary btn-sm">上一页</button>
          </div>
          <div className="mr-2 btn-sm">
            <p>{this.state.current}/{Math.ceil(this.props.message.length / this.state.num)}</p>
          </div>
          <div className="mr-2">
            <button type="button" onClick={this.handleClickNext} disabled={this.state.next} className="btn btn-outline-primary btn-sm">下一页</button>
          </div>
        </div>
        <div className="modal fade" id="message-dialog" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
             aria-hidden="true"  data-backdrop="static">
          <div className="modal-dialog modal-dialog-centered w-356px" role="document">
            <div className="modal-content">
              <div className="modal-header pt-1 pb-1">
                <h5 className="modal-title">确认</h5>
              </div>
              <div className="modal-body">
                <p className="d-flex justify-content-center" />
                <div className="d-flex justify-content-end mt-4">
                  <button type="button" className="btn btn-outline-primary mr-2" onClick={this.confirmRevoke}>确认</button>
                  <button type="button" className="btn btn-outline-primary" onClick={this.closeMessageDialog}>关闭</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class NullTable extends React.Component {
  render() {
    const headerList = ['姓名', '申请时间', '休假时间', '休假类型', '休假总天数', '紧急联系电话', '备注', '审批意见', '审批结果','是否撤销'];
    return (
      <div>
        <table className="table table-hover table-bordered text-center my-table">
          <thead>
            <tr>
              {
                headerList.map((element, index) => {
                  return <th key={index} style={{ backgroundColor: 'white' }}>{element}</th>
                })
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="10" className="text-left">暂时没有信息</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
class Table extends React.Component {
  render() {
    if (this.props.times === 0) {
      return <div></div>
    } else if (this.props.message.length === 0) {
      return <NullTable />
    } else {
      return <MyTable message={this.props.message} times={this.props.times} search={this.props.search}/>
    }
  }
}

export default Table;
