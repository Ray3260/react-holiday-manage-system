import React from 'react';
import $ from 'jquery';

class HintModal extends React.Component{
  openMessageDialog = (title, message) => {
    let $modal = $("#hint-modal");
    $modal.find("h5").text(title);
    $modal.find("p").text(message);
    $modal.modal("toggle");
    $(".modal-backdrop").css("z-index","9998");
  };
  closeMessageDialog = () => {
    $(".modal-backdrop").css("z-index","1040");
  }

  render(){
    return (
      <div className="modal fade" id="hint-modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true"  data-backdrop="static">
        <div className="modal-dialog modal-dialog-centered w-356px" role="document">
            <div className="modal-content">
                <div className="modal-header pt-1 pb-1">
                    <h5 className="modal-title" />
                </div>
                <div className="modal-body">
                    <p className="d-flex justify-content-center" />
                    <div className="d-flex align-items-end flex-column mt-4">
                        <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={this.closeMessageDialog}>关闭</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}
export default HintModal;