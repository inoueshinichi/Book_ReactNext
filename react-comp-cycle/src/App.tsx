import React from 'react';
import logo from './logo.svg';
import './App.css';

import Cycle from './components/Cylcle';
import StopWatch from './components/StopWatch';
import ItemCart from './components/ItemCart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React Component Cycle Test
        </p>
      </header>
      <Cycle />
      <hr />
      <StopWatch />
      <hr />
      <ItemCart />
    </div>
  );
}


export default App;