import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './index.css';
import { Routes } from './routes'
import NavigationSide from './components/navigation/navigationside' 
import NavigationHeader from './components/navigation/navigationheader';
import { translate } from 'react-i18next';

class App extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div className="wrapper">
          <nav id="sidebar" className="bg-dark active">
              <div className="sidebar-header">
                  <h3>Kastra</h3>
                  <img id="logo" alt="Kastra" src="/img/logo.svg" />
              </div>
              <div id="navigation-side">
                <NavigationSide />
              </div>
              <ul className="list-unstyled CTAs">
                  <li>
                      <a href="/" className="article">
                          <i className="icon ion-arrow-return-left"></i>  
                          <span className="sidebar-hidden">{t('navigation.backToHome')}</span>
                      </a>
                  </li>
              </ul>
          </nav>
          <div id="content">
                <NavigationHeader />
                <div id="root">
                  <Routes />  
                </div>
          </div>
        </div>
    );
  }
}

export default translate()(App)