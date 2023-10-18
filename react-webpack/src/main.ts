// main.ts

// simple
import { mul } from "./calc";
const a: number = mul(3,5);
console.log(a);

// react
import React from "react";
import ReactDOM from "react-dom";
import { Hello } from "./Hello";

ReactDOM.render(
    <Hello />,
    document.getElementById('root')
);