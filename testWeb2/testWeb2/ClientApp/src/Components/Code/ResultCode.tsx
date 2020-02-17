import React from "react";
import "../Home.css";
import { Button, Row, Col } from "reactstrap";
import ReactCodeMirror from "react-codemirror";
import CodeMirror from "codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import '../../../node_modules/codemirror/mode/clike/clike'

interface props {
    codeResult: string;
}

export class Result extends React.Component<props> {
    constructor(props: props) {
        super(props);
    }

    render() {
        let options = {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-csharp",
            readOnly: true,
            value: this.props.codeResult
        };
        return (
            <ReactCodeMirror className="ResultCode" options={options}></ReactCodeMirror>

        );
    }
}