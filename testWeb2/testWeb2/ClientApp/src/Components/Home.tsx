import React from "react";
import { InpCode } from "./Code/InputCode";
import { ContextInput } from "./Context";
import "./Home.css";

export class Home extends React.Component {
    public render() {
        return (
            <div className="homeContainer">
                <br />
                <div className={"homeConnectionContainer"}>
                <ContextInput ProjName=""></ContextInput>
                </div>
                <br />
                <InpCode model="" />
            </div>
        );
    }
}
