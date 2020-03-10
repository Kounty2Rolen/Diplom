import CodeMirror from "codemirror";
import React from "react";
import ReactCodeMirror from "react-codemirror";
import { Button, Col, Row } from "reactstrap";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import "../Home.css";
import * as SignalR from "@aspnet/signalr"

interface props {
    Result: {
        resultcode: string;
        sql: string;
    };
}

export class Result extends React.Component<props> {
    constructor(props: props) {
        super(props);
    }

    public render() {
         const hub =new SignalR.HubConnectionBuilder().withUrl("/rtt").build();
         hub.start();
        const options = {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-csharp",
            readOnly: true,
            value: this.props.Result.resultcode + "\n\n\n" + this.props.Result.sql,
        };
        console.log(this.props.Result);

        return (
            <ReactCodeMirror
                className="ResultCode"
                options={options}
            ></ReactCodeMirror>
        );
    }
}
