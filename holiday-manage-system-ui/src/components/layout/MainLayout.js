import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Header from './Header';
import '../../css/MainLayout.css';

class MainLayout extends React.Component {
  render(){
    const { children } = this.props;
    return (
      <main className="hms-app bg-light">
        <Nav/>
        <div className="hms-content container-fluid">
          <Header />
          {children}
          <Footer />
        </div>
      </main>
    );
  }
}
export default MainLayout;