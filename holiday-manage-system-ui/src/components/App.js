import React from 'react';
import Home from '../Routes/Home';
import VacationManage from '../Routes/VacationManage';
import VacationApply from '../Routes/VacationApply';
import Approval from '../Routes/Approval';
import Indicater from '../common/Indicater';
import MainLayout from './layout/MainLayout';
import Search from '../Routes/Search';
import SignInModal from './SignInModal';
import SignOutModal from './SignOutModal';
import Hintmodal from './HintModal';
import About from '../Routes/About';
import NotFoundPage from '../Routes/NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  browserHistory,
  Redirect
} from "react-router-dom";

class App extends React.Component{
  render(){
    const Path = {
      main: "/",
      home: '/home',
      vacationManage:'/vacation-manage',
      approval: '/approval',
      search: '/search',
      vacationApply: '/vacation-apply',
      about: '/about'
    };
    return (
      <Router history={browserHistory}>
        <SignInModal />
        <SignOutModal />
        <Indicater />
        <Hintmodal />
        <Switch>
          <Route path="/404" component={NotFoundPage}/>
          <MainLayout>
            <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
            <Route path={Path.home}><Home /></Route>
            <Route path={Path.about}><About /></Route>
            <Route path={Path.vacationManage}><VacationManage /></Route>
            <Route path={Path.approval}><Approval /></Route>
            <Route path={Path.search}><Search /></Route>
            <Route path={Path.vacationApply}><VacationApply /></Route>
            {
              Object.values(Path).indexOf(window.location.pathname) === -1 ?
              <Redirect to='/404' /> : null
            }
          </MainLayout>
        </Switch>

      </Router>
    );
  }
}
export default App;