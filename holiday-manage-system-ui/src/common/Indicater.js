import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import '../css/Indicater.css';


class Indicater extends React.Component{
  componentDidMount() {
    $('#coverLayout').on('shown.bs.modal', function () {
      const coverLogoWidth = $('#coverLayout .modal-dialog.modal-dialog-centered').width()/2-72;
       $('#coverLayout').css({left:coverLogoWidth});
       $('#coverLogo').show();
    })
  }

  render(){
    return (
      <div className="modal fade" id="coverLayout" data-backdrop="static"
         tabIndex="-1" aria-hidden="true">
           <div className="modal-dialog modal-dialog-centered" role="document">
              <div id="coverLogo">
                <div  className="sk-fading-circle">
                  <div  className="sk-circle1 sk-circle"></div>
                  <div  className="sk-circle2 sk-circle"></div>
                  <div  className="sk-circle3 sk-circle"></div>
                  <div  className="sk-circle4 sk-circle"></div>
                  <div  className="sk-circle5 sk-circle"></div>
                  <div  className="sk-circle6 sk-circle"></div>
                  <div  className="sk-circle7 sk-circle"></div>
                  <div  className="sk-circle8 sk-circle"></div>
                  <div  className="sk-circle9 sk-circle"></div>
                  <div  className="sk-circle10 sk-circle"></div>
                  <div  className="sk-circle11 sk-circle"></div>
                  <div  className="sk-circle12 sk-circle"></div>
                 </div>
               </div>
           </div>
      </div>
    );
  }
}
export default Indicater;
