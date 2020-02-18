import React from "react";
import "./Home.css";
import { InpCode } from "./Code/InputCode";
import { ContextInput } from "./Context";

export class Home extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <br />
        <ContextInput ProjName=""></ContextInput>
        <br />
        <InpCode />
      </div>
    );
  }
}
