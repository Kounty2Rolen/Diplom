import React from "react";
import { InpCode } from "./Code/InputCode";
import { ContextInput } from "./Context";
import "./Home.css";

export class Home extends React.Component {
    public render() {
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
