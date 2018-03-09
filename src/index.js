import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'

class App extends React.Component {
  render() {
    return (
        <Routes />
    );
  }
}

// ========================================

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);