import React, { useState } from "react";
import ReactDom from "react-dom/client";

function App1() { 
  const [text, setText] = useState("");

  return (
    <div className="App1">
      <button className="track-button" onClick={() => setText("hello track")}>Click me!</button>
      <p>{text}</p>
    </div>
  );
}

export default App1;
