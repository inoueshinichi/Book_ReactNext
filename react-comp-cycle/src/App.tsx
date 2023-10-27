import React from 'react';
import logo from './logo.svg';
import './App.css';

import Cycle from './components/Cylcle';
import StopWatch from './components/StopWatch';
import ItemCart from './components/ItemCart';
import SimpleForm from './components/SimpleForm';
import NumberForm from './components/NumberForm';
import MultiForm from './components/MultiForm';
import Inch2CmForm from './components/Inch2CmForm';
import CustomForm from './components/CustomForm';
import TextForm from './components/TextForm';
import CBoxForm from './components/CBoxForm';

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
      <hr />
      <SimpleForm />
      <hr />
      <NumberForm />
      <hr />
      <MultiForm />
      <hr />
      <Inch2CmForm />
      <hr />
      <CustomForm />
      <hr />
      <TextForm />
      <hr />
      <CBoxForm />
      <hr />

    </div>
  );
}


export default App;