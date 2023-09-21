import logo from './logo.svg';
import './App.css';

import React, { useState } from "react";
import ReactDom from "react-dom/client";

function App() { 
  const [text, setText] = useState("");

  return (
    <div className="App">
      <button className="track-button" onClick={() => setText("hello track")}>Click me!</button>
      <p>{text}</p>
    </div>
  );
}

export default App;
